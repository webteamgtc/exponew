import 'server-only';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

/**
 * Mailgun, set up like the main site (gtcrevamp2: src/config/nodemailer.js). Needs MAILGUN_API_KEY in the environment
 * (same value as on gtcfx.com); without it nothing is sent and sendMail resolves to false.
 */
export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mx.gtcmail.com';
export const MAILGUN_FROM = process.env.MAILGUN_FROM || `GTCFX <portal@${MAILGUN_DOMAIN}>`;

let client;
function mailgun() {
  if (!process.env.MAILGUN_API_KEY) return null;
  client ??= new Mailgun(formData).client({
    username: process.env.MAILGUN_USERNAME || 'api',
    key: process.env.MAILGUN_API_KEY,
    url: process.env.MAILGUN_API_URL || 'https://api.mailgun.net'
  });
  return client;
}

/** Sends one e-mail; resolves to true when Mailgun accepted it. */
export async function sendMail({ to, subject, html, text }) {
  const mg = mailgun();
  if (!mg) {
    console.warn('[mail] MAILGUN_API_KEY is not set, e-mail not sent:', subject);
    return false;
  }
  try {
    await mg.messages.create(MAILGUN_DOMAIN, { from: MAILGUN_FROM, to, subject, html, text });
    return true;
  } catch (err) {
    console.error('[mail] send failed:', err?.message ?? err);
    return false;
  }
}
