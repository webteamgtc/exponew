'use client';
/**
 * "Register now" card: opens a GTC Standard account in the CRM, exactly like the main site's live-account form
 * (src/components/shared/LiveApplicationForm.jsx in gtcrevamp2), through the same proxy routes:
 *   /api/gtc/get-country → /api/gtc/check-email → /api/gtc/get-code (email code) → /api/expo/register
 * Fields: first + last name, mobile, email + code, country, invitation code, terms. No password to choose: the server
 * creates one, opens the account with it and e-mails the login details in the visitor's language (/api/expo/register).
 *
 * Invitation code: the field starts with EXPO.inviteCode. With EXPO.forceInviteCode it is read-only and the server always
 * uses it; otherwise a link code (?code, ?ref → locked; ?partner_id, ?partner_code, ?ib) or a typed one replaces it.
 * After a successful registration the card shows the success panel; "Register another visitor" clears it for the next
 * person (the booth tablet flow).
 * Messages (code sent, email already registered, errors) are react-toastify toasts (<Toaster /> on the page).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'react-toastify';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ChevronDown, Gift, Globe, KeyRound, LoaderCircle, LockKeyhole, Mail, Ticket, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EASE } from '@/components/motion';
import { EMAIL_RE, LETTERS_RE, PHONE_COUNTRIES, Field, dialFor, fieldBox as box, fieldInput as input, fieldState as boxState, phoneCountryOf, phoneField as phoneCls, post, useGtcCountries } from '@/components/shared/formKit';
import { EXPO } from '@/config/expo';
import { cn } from '@/lib/utils';
import OtpBoxes from './OtpBoxes';
import RegisterSuccess from './RegisterSuccess';

const EMPTY = { firstname: '', lastname: '', phone: '', email: '', otp: '', country: '', invite: EXPO.inviteCode, terms: false };
const REQUIRED = ['firstname', 'lastname', 'phone', 'email', 'otp', 'country', 'terms'];
const RESEND_SECONDS = 60;

function readUrlParams() {
  const q = new URLSearchParams(window.location.search);
  const partner = q.get('code') || q.get('ref') || q.get('partner_id') || q.get('partner_code') || q.get('ib') || '';
  return { partner, locked: !!(q.get('code') || q.get('ref')), deepLink: q.get('deep_link_value') || '' };
}

export default function ExpoRegisterForm({ onProgress, onDone, onReset, className }) {
  const t = useTranslations('form');
  const locale = useLocale();
  const amount = EXPO.bonus;
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const { countries, failed: countriesFailed, suggested } = useGtcCountries();
  const [inviteLocked, setInviteLocked] = useState(false);
  const [deepLink, setDeepLink] = useState('');
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const submitLock = useRef(false);

  // link parameters (after mount, so the page stays static)
  useEffect(() => {
    const { partner, locked, deepLink: dl } = readUrlParams();
    // with forceInviteCode the expo's code stays, whatever the link says
    if (partner && !EXPO.forceInviteCode) setValues((v) => ({ ...v, invite: partner }));
    setInviteLocked(locked);
    setDeepLink(dl);
  }, []);

  // preselect the visitor's country once the list arrives
  useEffect(() => {
    if (suggested) setValues((v) => (v.country ? v : { ...v, country: suggested.name }));
  }, [suggested]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // the expo's code is shown filled in; it can't be edited when forced (or when it came from a ?ref= link)
  const inviteReadOnly = EXPO.forceInviteCode || inviteLocked;
  const selected = countries.find((c) => c.name === values.country);
  const dial = dialFor(selected);
  const phoneEmpty = !values.phone || /^\+\d{0,4}$/.test(values.phone);

  // picking a country starts the phone with its dial code, unless a number was typed
  useEffect(() => {
    if (dial) setValues((v) => (!v.phone || /^\+\d{0,4}$/.test(v.phone) ? { ...v, phone: `+${dial}` } : v));
  }, [dial]);

  const errors = useMemo(() => {
    const e = {};
    if (!values.firstname.trim()) e.firstname = t('errors.firstName');
    else if (!LETTERS_RE.test(values.firstname)) e.firstname = t('errors.firstNameLetters');
    if (!values.lastname.trim()) e.lastname = t('errors.lastName');
    else if (!LETTERS_RE.test(values.lastname)) e.lastname = t('errors.lastNameLetters');
    if (phoneEmpty) e.phone = t('errors.phone');
    else if (!isValidPhoneNumber(values.phone)) e.phone = t('errors.phoneInvalid');
    if (!values.email.trim()) e.email = t('errors.email');
    else if (!EMAIL_RE.test(values.email.trim())) e.email = t('errors.emailInvalid');
    if (!values.otp) e.otp = t('errors.otpRequired');
    else if (!/^\d{6}$/.test(values.otp)) e.otp = t('errors.otpLength');
    if (!values.country) e.country = t('errors.country');
    if (!values.terms) e.terms = t('errors.terms');
    return e;
  }, [values, phoneEmpty, t]);

  // share of the required fields that are valid → the hero's Register step and the card's top bar
  const filled = REQUIRED.filter((k) => !errors[k]).length / REQUIRED.length;
  useEffect(() => onProgress?.(filled), [filled, onProgress]);

  const err = (k) => (touched[k] ? errors[k] : undefined);
  const ok = (k) => touched[k] && !errors[k];
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }));
  const blur = (k) => () => setTouched((tc) => ({ ...tc, [k]: true }));

  const sendCode = async () => {
    setTouched((tc) => ({ ...tc, email: true }));
    if (errors.email) return toast.error(errors.email);
    setSending(true);
    try {
      const email = values.email.trim();
      const check = await post('/api/gtc/check-email', { email });
      if (!(check?.code === 200 && /available/i.test(check?.message || ''))) {
        toast.error(check?.message || t('errors.emailRegistered'));
        return;
      }
      const res = await post('/api/gtc/get-code', { email, type: '0' });
      if (res?.code === 200) {
        setCodeSent(true);
        setCooldown(RESEND_SECONDS);
        toast.success(res?.message || t('toast.otpSent'));
        document.getElementById('expo-otp-0')?.focus();
      } else toast.error(res?.message || t('toast.codeError'));
    } catch {
      toast.error(t('toast.codeError'));
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitLock.current || loading) return;
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errors).length) return;
    if (!selected) return toast.error(t('errors.validCountry'));

    // the server adds the password, the expo's invitation code (when none is given) and sends the welcome e-mail
    const payload = {
      code: values.otp.replace(/\D/g, '').padStart(6, '0').slice(-6),
      area: parsePhoneNumber(values.phone)?.countryCallingCode || dial,
      country: selected.name,
      email: values.email.trim(),
      phone: values.phone,
      lastname: values.lastname.trim(),
      firstname: values.firstname.trim(),
      invite: values.invite.trim(),
      deepLink: deepLink.trim(),
      locale
    };

    submitLock.current = true;
    setLoading(true);
    try {
      const res = await post('/api/expo/register', payload);
      if (res?.code === 200) {
        setDone({ name: payload.firstname, email: payload.email, emailSent: res.emailSent !== false });
        onDone?.();
      } else toast.error(res?.message || t('toast.registrationFailed'));
    } catch {
      toast.error(t('toast.registrationFailed'));
    } finally {
      setLoading(false);
      submitLock.current = false;
    }
  };

  /** Clears everything for the next visitor (keeps the country and a locked invitation code, otherwise back to the expo's code). */
  const reset = () => {
    setValues((v) => ({ ...EMPTY, country: v.country, phone: dial ? `+${dial}` : '', invite: inviteReadOnly ? v.invite : EXPO.inviteCode }));
    setTouched({});
    setCodeSent(false);
    setCooldown(0);
    setDone(null);
    onReset?.();
  };

  const codeLabel = sending ? t('sending') : cooldown > 0 ? t('resendIn', { seconds: cooldown }) : codeSent ? t('resend') : t('sendCode');

  return (
    <div className={cn('is-light relative overflow-hidden rounded-[1.75rem] bg-white text-ink shadow-[0_40px_100px_-30px_rgba(10,14,38,0.9)] ring-1 ring-white/20', className)}>
      {/* progress along the top edge */}
      <div className="absolute inset-x-0 top-0 h-1 bg-brand-50">
        <motion.div className="h-full origin-left bg-gradient-to-r from-brand via-brand-400 to-gold" initial={false} animate={{ scaleX: done ? 1 : Math.max(0.04, filled) }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <RegisterSuccess key="done" name={done.name} email={done.email} emailSent={done.emailSent} amount={amount} onAnother={reset} />
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="px-5 pb-6 pt-7 sm:px-7"
          >
            <header className="mb-6">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-600">
                <motion.span animate={{ rotate: [0, -12, 12, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }} className="inline-flex">
                  <Gift className="size-4" />
                </motion.span>
                {t('eyebrow', { amount })}
              </p>
              <h2 className="heading-card mt-2">{t('title')}</h2>
              <p className="mt-1 text-sm text-ink/60">{t('subtitle', { amount })}</p>
            </header>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field id="expo-first" label={t('firstName')} error={err('firstname')}>
                  <div className={cn(box, boxState(err('firstname')))}>
                    <User className={cn('size-4 shrink-0', ok('firstname') ? 'text-up' : 'text-ink/35')} />
                    <input id="expo-first" className={input} value={values.firstname} onChange={set('firstname')} onBlur={blur('firstname')} placeholder={t('firstNamePlaceholder')} autoComplete="given-name" />
                  </div>
                </Field>
                <Field id="expo-last" label={t('lastName')} error={err('lastname')}>
                  <div className={cn(box, boxState(err('lastname')))}>
                    <input id="expo-last" className={input} value={values.lastname} onChange={set('lastname')} onBlur={blur('lastname')} placeholder={t('lastNamePlaceholder')} autoComplete="family-name" />
                  </div>
                </Field>
              </div>

              <Field id="expo-phone" label={t('phone')} error={err('phone')}>
                <div className={cn(box, boxState(err('phone')), phoneCls)} dir="ltr">
                  <PhoneInput
                    id="expo-phone"
                    international
                    countryCallingCodeEditable={false}
                    countries={PHONE_COUNTRIES}
                    defaultCountry={phoneCountryOf(selected?.code)}
                    value={values.phone}
                    onChange={(v) => setValues((s) => ({ ...s, phone: v ?? '' }))}
                    onBlur={blur('phone')}
                    placeholder={t('phonePlaceholder')}
                    autoComplete="tel"
                  />
                </div>
              </Field>

              <Field id="expo-email" label={t('email')} error={err('email')}>
                <div className={cn(box, boxState(err('email')), 'pe-1.5')}>
                  <Mail className={cn('size-4 shrink-0', ok('email') ? 'text-up' : 'text-ink/35')} />
                  <input
                    id="expo-email"
                    type="email"
                    className={input}
                    value={values.email}
                    onChange={(e) => {
                      set('email')(e);
                      // a code belongs to the address it was sent to
                      setCodeSent(false);
                      setCooldown(0);
                      setValues((v) => (v.otp ? { ...v, otp: '' } : v));
                    }}
                    onBlur={blur('email')}
                    placeholder={t('emailPlaceholder')}
                    autoComplete="email"
                  />
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={sending || cooldown > 0}
                    className={cn(
                      'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                      codeSent && cooldown > 0 ? 'bg-up/10 text-up' : 'bg-brand-50 text-brand hover:bg-brand hover:text-white',
                      'disabled:cursor-default'
                    )}
                  >
                    {sending && <LoaderCircle className="me-1 inline size-3.5 animate-spin" />}
                    {codeLabel}
                  </button>
                </div>
              </Field>

              <Field id="expo-otp-0" label={t('code')} error={err('otp')} hint={codeSent ? t('codeHint') : undefined}>
                <OtpBoxes value={values.otp} onChange={(otp) => setValues((v) => ({ ...v, otp }))} onBlur={blur('otp')} invalid={Boolean(err('otp'))} highlight={codeSent} labelFor={(n) => t('codeDigit', { n })} />
              </Field>

              <Field id="expo-country" label={t('country')} error={err('country') || (countriesFailed ? t('countriesFailed') : undefined)}>
                <div className={cn(box, boxState(err('country')), 'relative')}>
                  <Globe className="size-4 shrink-0 text-ink/35" />
                  <select id="expo-country" className={cn(input, 'cursor-pointer appearance-none pe-6', !values.country && 'text-ink/35')} value={values.country} onChange={set('country')} onBlur={blur('country')}>
                    <option value="" disabled>
                      {t('countryPlaceholder')}
                    </option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name} className="text-ink">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-3.5 size-4 text-ink/40" />
                </div>
              </Field>

              <Field
                id="expo-invite"
                label={
                  <>
                    {t('invite')} {!EXPO.forceInviteCode && <span className="font-normal text-ink/40">{t('optional')}</span>}
                  </>
                }
              >
                <div className={cn(box, boxState(false), inviteReadOnly && 'bg-brand-50/60')}>
                  <Ticket className="size-4 shrink-0 text-ink/35" />
                  <input id="expo-invite" className={input} value={values.invite} onChange={set('invite')} readOnly={inviteReadOnly} placeholder={t('invitePlaceholder')} autoComplete="off" />
                </div>
              </Field>

              <p className="flex items-start gap-3 rounded-xl bg-brand-50/70 px-3.5 py-3 text-xs leading-relaxed text-brand">
                <KeyRound className="mt-0.5 size-4 shrink-0" />
                <span>{t('passwordNote')}</span>
              </p>

              <label className={cn('flex cursor-pointer items-start gap-3 rounded-xl p-1 text-xs leading-relaxed text-ink/60', err('terms') && 'text-down')}>
                <input type="checkbox" checked={values.terms} onChange={set('terms')} onBlur={blur('terms')} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand" />
                <span>
                  {t('termsBefore')}{' '}
                  <a href={EXPO.termsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline-offset-2 hover:underline">
                    {t('termsLink')}
                  </a>
                  ,{' '}
                  <a href={EXPO.bonusTermsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline-offset-2 hover:underline">
                    {t('bonusTermsLink')}
                  </a>{' '}
                  {t('and')}{' '}
                  <a href={EXPO.clientAgreementUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline-offset-2 hover:underline">
                    {t('agreementLink')}
                  </a>
                  .
                </span>
              </label>

              <Button type="submit" variant="gold" size="lg" disabled={loading} className="bonus-cta w-full">
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" /> {t('submitting')}
                  </>
                ) : (
                  <>
                    <Gift /> {t('submit', { amount })}
                  </>
                )}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink/45">
                <LockKeyhole className="size-3" /> {t('secure')}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
