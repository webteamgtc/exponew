# GTC Expo — booth registration page

Landing page for expos. Visitors read the offer and open a GTC Standard account; the account is created in the CRM
through the same portal API as the main site (gtcrevamp2):

```
/api/gtc/get-country → /api/gtc/check-email → /api/gtc/get-code (6-digit email code) → /api/expo/register
```

**No password field.** `/api/expo/register` creates a strong random password on the server, opens the account with it
and e-mails the login details (Mailgun, `src/lib/emails/expoWelcome.js`, in the visitor's language). The password never
reaches the browser.

Same stack and code format as the main site: Next.js 16 (App Router, JavaScript), Tailwind CSS 4, next-intl, Motion,
lucide-react, react-phone-number-input, react-toastify; shared pieces copied from it
(`components/ui/button.jsx`, `components/shared/formKit.jsx`, `components/motion`, `globals.css` heading system).

## Run

```bash
npm install
cp .env.example .env.local   # add MAILGUN_API_KEY
npm run dev                  # http://localhost:3000 → /en-intl
```

## Languages

Same languages and URLs as gtcfx.com (`src/i18n/locales.js`): `/en-intl`, `/ar`, `/zh`, `/hi`, `/ur`… Arabic, Urdu and
Pashto are right-to-left. Text lives in `messages/<lang>.json`; English, Arabic, Chinese, Uzbek (Latin script) and
Russian are translated, any other language (or missing key) shows English, like the main site. The welcome e-mail
(`src/lib/emails/expoWelcome.js`) exists in the same five languages. The language picker sits next to the logo and keeps the
link's `?ref=` / `?code=`.

## QR codes and language

A QR code can point to any of these links; query parameters such as `?ref=CODE` are always kept:

| Link | Opens |
| --- | --- |
| `https://<site>/uz` | Uzbek, always |
| `https://<site>/ru` | Russian, always |
| `https://<site>/` | the visitor's language (below) |

For a link without a language, `src/proxy.js` picks: the browser's language if we have it (phone set to Uzbek → `/uz`,
Russian → `/ru`); otherwise, a visitor in Uzbekistan → `/uz` or Russia → `/ru` even with an English phone (edit
`COUNTRY_LOCALE` to add countries); otherwise English. The country comes from the host's geo header
(`x-vercel-ip-country`, `cf-ipcountry` or `cloudfront-viewer-country`), so it needs Vercel, Cloudflare or CloudFront in
front of the site. For a booth where the language is known, print the `/uz` or `/ru` link in the QR code.

## Change for the next expo

- `src/config/expo.js` — expo name, dates, booth number, bonus amount, invitation code that tags every booth account,
  terms and login links. There is no expo logo on purpose: the page works for any show.
- `messages/<lang>.json` — page text.

## Page

- `ExpoHero.jsx` — split screen. Left (navy): logo + language picker, headline, the "$50" that fills with liquid gold,
  the How-it-works timeline and a moving strip of markets. Right (light): the account form.
- `ExpoRegisterForm.jsx`, `OtpBoxes.jsx`, `RegisterSuccess.jsx` ("Register another visitor" for the booth tablet),
  `JumpToForm.jsx` (phones).
- Below the hero, sections from gtcfx.com (`src/components/sections`, copied from gtcrevamp2): Stats, Benefits (expo),
  Awards, Regulation, Platforms and an expo FAQ. Their links open gtcfx.com in the same language
  (`components/shared/nav/NavLink.jsx`).

Every account is opened under `EXPO.inviteCode` (`src/config/expo.js`); with `forceInviteCode: true` the server ignores any
code in the link or form and the form has no invitation field. Set `forceInviteCode: false` to let `?ref=CODE` /
`?code=CODE` links prefill and lock a code instead (same as the main site), with `inviteCode` as the default.
