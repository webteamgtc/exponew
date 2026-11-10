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
Pashto are right-to-left. Text lives in `messages/<lang>.json`; English, Arabic and Chinese are translated, any other
language (or missing key) shows English, like the main site. The language picker sits next to the logo and keeps the
link's `?ref=` / `?code=`.

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

Links like `?ref=CODE` or `?code=CODE` prefill and lock the invitation code (same as the main site).
