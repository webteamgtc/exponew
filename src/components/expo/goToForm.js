/**
 * Every "Register now" button below the hero uses this: smooth-scrolls back up to the account form (id="register" in
 * ExpoHero.jsx) and puts the cursor in its first field. Use it as `<a href="#register" onClick={goToForm}>`, so the
 * link still works as a plain anchor if scripts have not loaded.
 */
export function goToForm(e) {
  const form = document.getElementById('register');
  if (!form) return;
  e?.preventDefault();
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => document.getElementById('expo-first')?.focus({ preventScroll: true }), 700);
}
