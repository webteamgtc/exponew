/**
 * Everything about the current expo in one place: change these for the next show. Page text is in messages/<lang>.json.
 *
 *   name, dates,   shown as one line above the form: "name, dates, city (kind)". name is also used in the page title
 *   city, kind     and in the welcome e-mail (no expo logo: it changes every show)
 *   booth          shown as "Visit us at Booth …" when set
 *   bonus          the welcome bonus shown on the page, the button and in the e-mail
 *   inviteCode     sent as the invitation (IB / partner) code when the visitor leaves the field empty, so every
 *                  account opened at the booth is tagged to the expo. A code in the link (?ref=, ?code=…) wins.
 */
export const EXPO = {
  name: 'Traders Fair 2026 - Uzbekistan',
  dates: '14 NOVEMBER',
  city: 'Tashkent',
  kind: 'Financial Event',
  booth: '',
  bonus: 50,
  currency: 'USD',
  inviteCode: '',
  termsUrl: 'https://www.gtcfx.com/terms',
  bonusTermsUrl: 'https://www.gtcfx.com/terms',
  clientAgreementUrl: 'https://www.gtcfx.com/terms',
  /** where a new client logs in (same as the main site's PORTAL.login) */
  loginUrl: 'https://web.mygtc.app/user?redirect=%252Fdashboard',
  /**
   * "GTCFX: GTC GO" in the phone stores, shown on the thank-you panel after registering. Paste the real store links here;
   * while one is empty its button opens the GTC Go page on gtcfx.com in the visitor's language instead.
   */
  apps: { appStore: '', googlePlay: '' },
  /** shown in the welcome e-mail */
  supportEmail: 'support@gtcfx.com'
};

/** The main website: links in the sections brought over from it (Platforms, Regulation, Awards, FAQ) open there. */
export const MAIN_SITE = 'https://www.gtcfx.com';
