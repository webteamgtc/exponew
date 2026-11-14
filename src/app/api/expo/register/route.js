import { randomInt } from 'node:crypto';
import { NextResponse } from 'next/server';
import { EXPO } from '@/config/expo';
import { langOf } from '@/i18n/locales';
import { expoWelcomeEmail } from '@/lib/emails/expoWelcome';
import { sendMail } from '@/lib/mailer';
import { clientIp, portalPost, rateLimit, tooMany } from '@/lib/api';

/**
 * Opens the visitor's GTC Standard account (POST from ExpoRegisterForm). The visitor doesn't choose a password:
 *   1. checks the fields,
 *   2. creates a strong password here on the server (never sent to the browser),
 *   3. registers the account in the CRM: same call and payload as the main site's live-account form
 *      (web.mygtc.app/api/pub/reg, base URL from GTC_PORTAL_API),
 *   4. e-mails the login details (src/lib/emails/expoWelcome.js) in the visitor's language.
 * → { code: 200, emailSent } on success, otherwise the CRM's { code, message } (e.g. wrong code, email taken).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LETTERS_RE = /^[\p{L}\p{M}\s'’.-]{1,60}$/u;

// no look-alike characters (0/O, 1/l/I), so the password is easy to copy from the e-mail
const SETS = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnpqrstuvwxyz', '23456789'];
function makePassword(length = 12) {
  const all = SETS.join('');
  const chars = SETS.map((s) => s[randomInt(s.length)]); // at least one of each
  while (chars.length < length) chars.push(all[randomInt(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

const clean = (v, max = 120) => String(v ?? '').trim().slice(0, max);

export async function POST(req) {
  // a booth tablet legitimately registers many people from one network, so the limit is generous
  if (!rateLimit(`reg:${clientIp(req)}`, 30, 10 * 60_000)) return tooMany();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ code: 400, message: 'Invalid request' }, { status: 400 });
  }
  const firstname = clean(body.firstname, 60);
  const lastname = clean(body.lastname, 60);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 24);
  const area = clean(body.area, 6).replace(/\D/g, '');
  const country = clean(body.country, 80);
  const code = clean(body.code, 6).replace(/\D/g, '');
  // with forceInviteCode every account goes under the expo's code, whatever the browser sends
  const invite = EXPO.forceInviteCode && EXPO.inviteCode ? EXPO.inviteCode : clean(body.invite, 40) || EXPO.inviteCode;
  const lang = langOf(clean(body.locale, 10));

  if (!LETTERS_RE.test(firstname) || !LETTERS_RE.test(lastname) || !EMAIL_RE.test(email) || !/^\+\d{6,18}$/.test(phone) || !area || !country || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ code: 400, message: 'Please check your details and try again.' }, { status: 400 });
  }

  const password = makePassword();
  const reg = EXPO.registration ?? {};
  const fields = {
    nickname: `${firstname} ${lastname}`,
    email,
    phone,
    country,
    // a number, like the other GTC sign-up pages send it (a string or an empty from_type gets "Reg Type Error")
    type: Number(reg.type ?? 0),
    password,
    code,
    invitation_code: invite,
    area,
    from_type: reg.fromType,
    from_client_id: reg.fromClientId,
    recommend: reg.recommend,
    activity_code: reg.activityCode,
    is_company: 0,
    firstname,
    lastname,
    company_name: ''
  };
  // optional fields go out only when set: the CRM validates any value it receives, empty ones included
  const optional = ['from_type', 'from_client_id', 'recommend', 'activity_code', 'company_name'];
  for (const k of optional) if (fields[k] === undefined || fields[k] === null || fields[k] === '') delete fields[k];
  const { ok, data: res } = await portalPost('reg', fields, clientIp(req));
  if (!ok) return NextResponse.json({ code: 500, message: res?.message ?? 'Failed to reach GTC API' }, { status: 502 });
  if (res?.code !== 200) return NextResponse.json({ code: res?.code ?? 500, message: res?.message ?? '' }, { status: 200 });

  const mail = expoWelcomeEmail({ lang, name: firstname, email, password, portalUrl: EXPO.loginUrl, supportEmail: EXPO.supportEmail, expoName: EXPO.name, amount: EXPO.bonus });
  const emailSent = await sendMail({ to: email, ...mail });
  return NextResponse.json({ code: 200, message: res?.message ?? '', emailSent });
}
