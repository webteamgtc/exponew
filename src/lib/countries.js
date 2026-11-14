import 'server-only';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/min';

/**
 * Built-in country list, used only while the CRM's own list (web.mygtc.app/api/pub/get_country) is failing, so the register
 * form still works and can preselect the visitor's country. Same shape as the CRM's entries: { code, name, phone_code }.
 * English names from Intl.DisplayNames; NAME_FIX holds the few the CRM words differently (add more if it rejects a name).
 */
const NAME_FIX = { TR: 'Turkey', MM: 'Myanmar' };

let list;
export function fallbackCountries() {
  if (!list) {
    const names = new Intl.DisplayNames(['en'], { type: 'region' });
    list = getCountries().map((code) => ({
      code,
      name: NAME_FIX[code] ?? names.of(code),
      phone_code: String(getCountryCallingCode(code))
    }));
  }
  return list;
}
