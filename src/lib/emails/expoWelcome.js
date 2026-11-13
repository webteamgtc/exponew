/**
 * Welcome e-mail after an account is opened on the expo page (/api/expo/register): the login details (the password is
 * created on the server and only ever sent here), a button to the client portal and the next steps for the bonus.
 * Same look as the main site's welcome e-mail (gtcrevamp2: src/lib/emails/liveAccountWelcome.js).
 * English, Arabic, Chinese, Uzbek and Russian; other languages get English. Returns { subject, html, text }.
 */
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const COPY = {
  en: {
    dir: 'ltr',
    subject: 'Welcome to GTCFX — your login details',
    banner: 'Your account is ready',
    dear: (n) => `Dear ${n},`,
    intro: (expo, amount) => `Thank you for opening your GTC Standard account with us at ${expo}. Your $${amount} trading bonus is waiting: log in with the details below to activate it.`,
    steps: (amount) => [
      ['Log in to the client portal', 'Use the login details below to sign in.'],
      ['Activate your account', 'Complete your profile and verify your identity to unlock the bonus.'],
      ['Start trading', `Trade real markets with your $${amount} trading bonus.`]
    ],
    details: 'Your login details',
    url: 'Login URL',
    email: 'E-mail',
    password: 'Password',
    button: 'Log in to my account',
    safe: '<strong>Keep your account safe:</strong> change your password after your first login, delete this e-mail once you have done so, and never share your login details with anyone. GTCFX will never ask for your password.',
    questions: 'If you have any questions, contact us at',
    regards: 'Best Regards,',
    team: 'GTCFX Team',
    footer: (support) => [
      `Company name: GTC FX / Website: www.gtcfx.com / Email: ${support}`,
      `You received this e-mail because this address was used to open an account with GTCFX. If this wasn't you, please contact ${support}.`,
      'Disclaimers: The information in this email is for general purposes only and does not constitute personal financial advice. Investing in contract for difference products carries significant risks and may not be suitable for all investors.'
    ]
  },
  ar: {
    dir: 'rtl',
    subject: 'مرحبًا بك في GTCFX — بيانات تسجيل الدخول',
    banner: 'حسابك جاهز',
    dear: (n) => `عزيزي/عزيزتي ${n}،`,
    intro: (expo, amount) => `شكرًا لفتح حساب GTC Standard معنا في ${expo}. مكافأة التداول البالغة ${amount}$ بانتظارك: سجّل الدخول بالبيانات أدناه لتفعيلها.`,
    steps: (amount) => [
      ['سجّل الدخول إلى بوابة العملاء', 'استخدم بيانات تسجيل الدخول أدناه.'],
      ['فعّل حسابك', 'أكمل ملفك الشخصي وتحقق من هويتك لتفعيل المكافأة.'],
      ['ابدأ التداول', `تداول في الأسواق الحقيقية بمكافأة التداول البالغة ${amount}$.`]
    ],
    details: 'بيانات تسجيل الدخول',
    url: 'رابط الدخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    button: 'تسجيل الدخول إلى حسابي',
    safe: '<strong>حافظ على أمان حسابك:</strong> غيّر كلمة المرور بعد أول تسجيل دخول، واحذف هذا البريد بعد ذلك، ولا تشارك بيانات الدخول مع أي شخص. لن تطلب منك GTCFX كلمة المرور أبدًا.',
    questions: 'إذا كانت لديك أي أسئلة، تواصل معنا على',
    regards: 'مع أطيب التحيات،',
    team: 'فريق GTCFX',
    footer: (support) => [
      `اسم الشركة: GTC FX / الموقع: www.gtcfx.com / البريد: ${support}`,
      `وصلك هذا البريد لأن هذا العنوان استُخدم لفتح حساب لدى GTCFX. إذا لم تكن أنت، يرجى التواصل مع ${support}.`,
      'إخلاء المسؤولية: المعلومات الواردة في هذا البريد لأغراض عامة فقط ولا تشكل نصيحة مالية شخصية. ينطوي الاستثمار في عقود الفروقات على مخاطر كبيرة وقد لا يناسب جميع المستثمرين.'
    ]
  },
  zh: {
    dir: 'ltr',
    subject: '欢迎加入 GTCFX — 您的登录信息',
    banner: '您的账户已开通',
    dear: (n) => `尊敬的 ${n}：`,
    intro: (expo, amount) => `感谢您在 ${expo} 开设 GTC 标准账户。您的 ${amount} 美元交易赠金已在等您：请使用以下信息登录并激活。`,
    steps: (amount) => [
      ['登录客户门户', '使用以下登录信息登录。'],
      ['激活您的账户', '完善个人资料并完成身份验证，即可解锁赠金。'],
      ['开始交易', `使用 ${amount} 美元交易赠金交易真实市场。`]
    ],
    details: '您的登录信息',
    url: '登录网址',
    email: '电子邮箱',
    password: '密码',
    button: '登录我的账户',
    safe: '<strong>保护账户安全：</strong>首次登录后请修改密码，修改后删除本邮件，切勿与任何人分享您的登录信息。GTCFX 绝不会向您索取密码。',
    questions: '如有任何疑问，请联系',
    regards: '此致敬礼，',
    team: 'GTCFX 团队',
    footer: (support) => [
      `公司名称：GTC FX / 网站：www.gtcfx.com / 邮箱：${support}`,
      `您收到此邮件，是因为此邮箱地址被用于在 GTCFX 开设账户。如非本人操作，请联系 ${support}。`,
      '免责声明：本邮件内容仅供一般参考，不构成个人财务建议。差价合约投资存在重大风险，未必适合所有投资者。'
    ]
  },
  uz: {
    dir: 'ltr',
    subject: 'GTCFX — xush kelibsiz: kirish maʼlumotlaringiz',
    banner: 'Hisobingiz tayyor',
    dear: (n) => `Hurmatli ${n},`,
    intro: (expo, amount) => `${expo} doirasida GTC Standard hisobini ochganingiz uchun rahmat. Sizning $${amount} savdo bonusingiz kutmoqda: uni faollashtirish uchun quyidagi maʼlumotlar bilan tizimga kiring.`,
    steps: (amount) => [
      ['Mijozlar portaliga kiring', 'Tizimga kirish uchun quyidagi maʼlumotlardan foydalaning.'],
      ['Hisobingizni faollashtiring', 'Bonusni ochish uchun profilingizni toʻldiring va shaxsingizni tasdiqlang.'],
      ['Savdoni boshlang', `$${amount} savdo bonusi bilan real bozorlarda savdo qiling.`]
    ],
    details: 'Kirish maʼlumotlaringiz',
    url: 'Kirish havolasi',
    email: 'Elektron pochta',
    password: 'Parol',
    button: 'Hisobimga kirish',
    safe: '<strong>Hisobingiz xavfsizligini taʼminlang:</strong> birinchi kirishdan soʻng parolni oʻzgartiring, shundan keyin ushbu xatni oʻchirib tashlang va kirish maʼlumotlaringizni hech kimga bermang. GTCFX hech qachon sizdan parolingizni soʻramaydi.',
    questions: 'Savollaringiz boʻlsa, biz bilan bogʻlaning:',
    regards: 'Hurmat bilan,',
    team: 'GTCFX jamoasi',
    footer: (support) => [
      `Kompaniya nomi: GTC FX / Veb-sayt: www.gtcfx.com / Elektron pochta: ${support}`,
      `Siz ushbu xatni ushbu manzil GTCFX da hisob ochish uchun ishlatilgani sababli oldingiz. Agar bu siz boʻlmasangiz, iltimos, ${support} bilan bogʻlaning.`,
      'Ogohlantirish: ushbu xatdagi maʼlumotlar faqat umumiy maqsadlar uchun moʻljallangan va shaxsiy moliyaviy maslahat hisoblanmaydi. Farq uchun shartnomalar (CFD) mahsulotlariga sarmoya kiritish sezilarli xavflarga ega va barcha investorlar uchun mos kelmasligi mumkin.'
    ]
  },
  ru: {
    dir: 'ltr',
    subject: 'Добро пожаловать в GTCFX — ваши данные для входа',
    banner: 'Ваш счёт готов',
    dear: (n) => `Уважаемый(ая) ${n},`,
    intro: (expo, amount) => `Спасибо, что открыли счёт GTC Standard у нас на ${expo}. Ваш торговый бонус $${amount} ждёт вас: войдите с указанными ниже данными, чтобы активировать его.`,
    steps: (amount) => [
      ['Войдите в клиентский портал', 'Используйте указанные ниже данные для входа.'],
      ['Активируйте счёт', 'Заполните профиль и подтвердите личность, чтобы разблокировать бонус.'],
      ['Начните торговать', `Торгуйте на реальных рынках с торговым бонусом $${amount}.`]
    ],
    details: 'Ваши данные для входа',
    url: 'Адрес входа',
    email: 'Эл. почта',
    password: 'Пароль',
    button: 'Войти в мой счёт',
    safe: '<strong>Берегите свой счёт:</strong> смените пароль после первого входа, затем удалите это письмо и никому не сообщайте свои данные для входа. GTCFX никогда не запрашивает ваш пароль.',
    questions: 'Если у вас есть вопросы, свяжитесь с нами:',
    regards: 'С уважением,',
    team: 'Команда GTCFX',
    footer: (support) => [
      `Название компании: GTC FX / Сайт: www.gtcfx.com / Эл. почта: ${support}`,
      `Вы получили это письмо, потому что этот адрес был использован для открытия счёта в GTCFX. Если это были не вы, свяжитесь с ${support}.`,
      'Отказ от ответственности: информация в этом письме носит общий характер и не является персональной финансовой консультацией. Инвестиции в контракты на разницу сопряжены со значительными рисками и могут подойти не всем инвесторам.'
    ]
  }
};

/** Words the e-mail layout needs on top of COPY; languages missing here use English. */
const LAYOUT = {
  en: { portal: 'Client Portal', welcome: 'Welcome aboard,', access: 'Client Access', fallback: 'Button not working? Copy this link into your browser:', nextEyebrow: 'Your next steps', nextTitle: 'Three steps to your first trade', stats: ['Clients served', 'Trading markets', 'Languages'], rights: 'All rights reserved.' },
  ar: { portal: 'بوابة العملاء', welcome: 'أهلًا بك،', access: 'بيانات الدخول', fallback: 'الزر لا يعمل؟ انسخ هذا الرابط في متصفحك:', nextEyebrow: 'خطواتك التالية', nextTitle: 'ثلاث خطوات نحو صفقتك الأولى', stats: ['عميل', 'أسواق تداول', 'لغة'], rights: 'جميع الحقوق محفوظة.' },
  zh: { portal: '客户门户', welcome: '欢迎加入，', access: '客户登录', fallback: '按钮无法使用？请将此链接复制到浏览器：', nextEyebrow: '下一步', nextTitle: '三步开启您的首笔交易', stats: ['服务客户', '交易市场', '支持语言'], rights: '版权所有。' },
  uz: { portal: 'Mijozlar portali', welcome: 'Xush kelibsiz,', access: 'Mijoz kirishi', fallback: 'Tugma ishlamayaptimi? Ushbu havolani brauzeringizga nusxalang:', nextEyebrow: 'Keyingi qadamlaringiz', nextTitle: 'Birinchi savdongizgacha uch qadam', stats: ['Mijozlar', 'Savdo bozorlari', 'Tillar'], rights: 'Barcha huquqlar himoyalangan.' },
  ru: { portal: 'Клиентский портал', welcome: 'Добро пожаловать,', access: 'Доступ клиента', fallback: 'Кнопка не работает? Скопируйте эту ссылку в браузер:', nextEyebrow: 'Ваши следующие шаги', nextTitle: 'Три шага до первой сделки', stats: ['Клиентов', 'Торговых рынков', 'Языков'], rights: 'Все права защищены.' }
};

const FONT = 'font-family:Arial,Helvetica,sans-serif;';

export function expoWelcomeEmail({ lang = 'en', name, email, password, portalUrl, supportEmail, expoName, amount }) {
  const c = COPY[lang] ?? COPY.en;
  const l = LAYOUT[lang] ?? LAYOUT.en;
  const rtl = c.dir === 'rtl';
  const start = rtl ? 'right' : 'left';
  const end = rtl ? 'left' : 'right';
  const url = esc(portalUrl);
  const urlShort = esc(portalUrl.replace(/^https?:\/\//, '').split('?')[0]);
  const [, received, disclaimer] = c.footer(supportEmail);
  const label = `margin:0;font-size:11px;line-height:14px;letter-spacing:1.5px;text-transform:uppercase;color:#8d95c4;`;

  const steps = c
    .steps(amount)
    .map(([title, text], i) => {
      const last = i === 2;
      const badge = last ? 'background-color:#b68756;background-image:linear-gradient(135deg,#e3c7a7 0%,#b68756 60%);' : 'background-color:#293b93;';
      const panel = last ? 'background-color:#faf4ee;border:1px solid #f0e2d2;' : 'background-color:#f5f6fb;';
      return `
              ${i ? `<tr><td height="12" colspan="2" style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>` : ''}
              <tr>
                <td width="56" valign="top" style="width:56px;padding:0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr><td align="center" width="40" height="40" bgcolor="${last ? '#b68756' : '#293b93'}" style="width:40px;height:40px;${badge}border-radius:12px;${FONT}font-size:15px;line-height:40px;color:#ffffff;font-weight:bold;">0${i + 1}</td></tr></table>
                </td>
                <td valign="top">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;${panel}border-radius:14px;border-collapse:separate;">
                    <tr><td style="padding:12px 16px;${FONT}text-align:${start};">
                      <p style="margin:0;font-size:15px;line-height:22px;color:#141a4a;font-weight:bold;">${esc(title)}</p>
                      <p style="margin:2px 0 0 0;font-size:13px;line-height:20px;color:#5b6180;">${esc(text)}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>`;
    })
    .join('');

  const stat = (value, text, color, mid) =>
    `<td width="${mid ? 34 : 33}%" align="center" valign="top" style="width:${mid ? 34 : 33}%;padding:20px 4px;${mid ? 'border-left:1px solid #eceef6;border-right:1px solid #eceef6;' : ''}${FONT}">
                  <p style="margin:0;font-size:22px;line-height:28px;color:${color};font-weight:bold;" dir="ltr">${value}</p>
                  <p style="margin:4px 0 0 0;font-size:10px;line-height:14px;letter-spacing:1.2px;text-transform:uppercase;color:#8a90ad;">${esc(text)}</p>
                </td>`;

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${c.dir}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(c.subject)}</title>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#e9ecf5;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#e9ecf5;opacity:0;">${esc(c.banner)} &middot; ${esc(c.details)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e9ecf5" style="width:100%;background-color:#e9ecf5;border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:28px 10px 36px 10px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" dir="${c.dir}" style="width:100%;max-width:600px;border-collapse:separate;">

        <!-- Top bar -->
        <tr>
          <td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:22px 22px 0 0;padding:22px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td align="${start}" valign="middle">
                  <a href="https://www.gtcfx.com" target="_blank" style="text-decoration:none;">
                    <img src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/logo/main-logo.webp" width="132" alt="GTCFX" style="display:block;width:132px;max-width:132px;height:auto;border:0;outline:none;text-decoration:none;">
                  </a>
                </td>
                <td align="${end}" valign="middle">
                  <span style="display:inline-block;padding:6px 12px;background-color:#eef0fa;border-radius:20px;${FONT}font-size:11px;line-height:14px;letter-spacing:1px;text-transform:uppercase;color:#293b93;font-weight:bold;">${esc(l.portal)}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td align="center" bgcolor="#141a4a" style="background-color:#141a4a;background-image:radial-gradient(circle at 15% 0%,rgba(81,102,255,0.45) 0%,rgba(81,102,255,0) 55%),radial-gradient(circle at 100% 100%,rgba(210,166,122,0.35) 0%,rgba(210,166,122,0) 50%),linear-gradient(160deg,#293b93 0%,#141a4a 60%,#0b0f2e 100%);padding:48px 24px 36px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
              <tr>
                <td style="padding:7px 16px;border:1px solid rgba(227,199,167,0.55);border-radius:20px;${FONT}font-size:11px;line-height:14px;letter-spacing:2.5px;text-transform:uppercase;color:#e3c7a7;font-weight:bold;">&#10022;&nbsp; ${esc(c.banner)} &nbsp;&#10022;</td>
              </tr>
            </table>
            <h1 style="margin:22px 0 0 0;${FONT}font-size:34px;line-height:42px;color:#ffffff;font-weight:bold;letter-spacing:-0.5px;">${esc(l.welcome)}<br><span style="color:#e3c7a7;">${esc(name)}</span></h1>
            <p style="margin:16px auto 0 auto;max-width:440px;${FONT}font-size:15px;line-height:24px;color:#c3c9ea;">${esc(c.intro(expoName, amount))}</p>

            <!-- Access card -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;margin-top:34px;">
              <tr>
                <td align="${start}" bgcolor="#1d2563" style="background-color:#1d2563;background-image:linear-gradient(135deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.03) 100%);border:1px solid #b68756;border-radius:20px;padding:0;text-align:${start};box-shadow:0 24px 50px rgba(5,8,30,0.45);">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:22px 24px 6px 24px;" valign="middle">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                          <tr>
                            <td align="${start}" valign="middle" style="${FONT}font-size:11px;line-height:14px;letter-spacing:2.5px;text-transform:uppercase;color:#e3c7a7;font-weight:bold;">GTCFX &middot; ${esc(l.access)}</td>
                            <td align="${end}" valign="middle">
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                                <tr><td width="38" height="28" bgcolor="#d2a67a" style="width:38px;height:28px;background-color:#d2a67a;background-image:linear-gradient(135deg,#f1e3d3 0%,#d2a67a 45%,#9a6f43 100%);border-radius:6px;font-size:0;line-height:0;">&nbsp;</td></tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 24px 0 24px;${FONT}">
                        <p style="${label}">${esc(c.url)}</p>
                        <p style="margin:6px 0 0 0;font-size:15px;line-height:22px;word-break:break-all;" dir="ltr"><a href="${url}" target="_blank" style="color:#ffffff;font-weight:bold;text-decoration:underline;">${urlShort}</a></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 24px 0 24px;${FONT}">
                        <p style="${label}">${esc(c.email)}</p>
                        <p style="margin:6px 0 0 0;font-size:15px;line-height:22px;color:#ffffff;font-weight:bold;word-break:break-all;" dir="ltr">${esc(email)}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 24px 24px 24px;${FONT}">
                        <p style="${label}">${esc(c.password)}</p>
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin-top:8px;">
                          <tr>
                            <td bgcolor="#ffffff" dir="ltr" style="background-color:#ffffff;border-radius:10px;padding:10px 16px;font-family:Consolas,'Courier New',Courier,monospace;font-size:20px;line-height:26px;letter-spacing:2px;color:#141a4a;font-weight:bold;">${esc(password)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 28px 6px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
              <tr>
                <td align="center" bgcolor="#b68756" style="background-color:#b68756;background-image:linear-gradient(135deg,#e3c7a7 0%,#b68756 50%,#8a5f37 100%);border-radius:40px;box-shadow:0 12px 26px rgba(182,135,86,0.45);">
                  <a href="${url}" target="_blank" style="display:inline-block;padding:17px 44px;${FONT}font-size:16px;line-height:20px;color:#ffffff;font-weight:bold;text-decoration:none;border-radius:40px;letter-spacing:0.3px;">${esc(c.button)} &nbsp;${rtl ? '&larr;' : '&rarr;'}</a>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0 0;${FONT}font-size:12px;line-height:18px;color:#8a90ad;">${esc(l.fallback)}<br><a href="${url}" target="_blank" dir="ltr" style="color:#293b93;text-decoration:underline;word-break:break-all;">${url}</a></p>
          </td>
        </tr>

        <!-- Steps -->
        <tr>
          <td bgcolor="#ffffff" style="background-color:#ffffff;padding:34px 28px 4px 28px;text-align:${start};">
            <p style="margin:0 0 6px 0;${FONT}font-size:11px;line-height:14px;letter-spacing:2px;text-transform:uppercase;color:#9a6f43;font-weight:bold;">${esc(l.nextEyebrow)}</p>
            <p style="margin:0 0 20px 0;${FONT}font-size:22px;line-height:28px;color:#141a4a;font-weight:bold;">${esc(l.nextTitle)}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${steps}
            </table>
          </td>
        </tr>

        <!-- Numbers -->
        <tr>
          <td bgcolor="#ffffff" style="background-color:#ffffff;padding:30px 28px 4px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border-top:1px solid #eceef6;border-bottom:1px solid #eceef6;">
              <tr>
                ${stat('985K+', l.stats[0], '#293b93')}
                ${stat('7+', l.stats[1], '#b68756', true)}
                ${stat('20+', l.stats[2], '#293b93')}
              </tr>
            </table>
          </td>
        </tr>

        <!-- Security note -->
        <tr>
          <td bgcolor="#ffffff" style="background-color:#ffffff;padding:26px 28px 6px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff8ec" style="width:100%;background-color:#fff8ec;border:1px solid #f1dfbf;border-radius:14px;border-collapse:separate;">
              <tr>
                <td width="34" valign="top" style="width:34px;padding:14px 16px;font-size:18px;line-height:20px;">&#128274;</td>
                <td valign="top" style="padding:14px 6px 14px 16px;${FONT}font-size:13px;line-height:20px;color:#7a5418;text-align:${start};">${c.safe}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Sign-off -->
        <tr>
          <td bgcolor="#ffffff" style="background-color:#ffffff;padding:24px 28px 36px 28px;${FONT}text-align:${start};">
            <p style="margin:0 0 14px 0;font-size:14px;line-height:22px;color:#5b6180;">${esc(c.questions)} <a href="mailto:${esc(supportEmail)}" style="color:#293b93;font-weight:bold;text-decoration:none;">${esc(supportEmail)}</a>.</p>
            <p style="margin:0;font-size:14px;line-height:22px;color:#5b6180;">${esc(c.regards)}<br><strong style="color:#141a4a;">${esc(c.team)}</strong></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" bgcolor="#0f1438" style="background-color:#0f1438;border-radius:0 0 22px 22px;padding:28px 28px 30px 28px;${FONT}">
            <p style="margin:0 0 14px 0;font-size:13px;line-height:18px;">
              <a href="https://www.gtcfx.com" target="_blank" style="color:#e3c7a7;font-weight:bold;text-decoration:none;">www.gtcfx.com</a>
              <span style="color:#4b5385;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <a href="mailto:${esc(supportEmail)}" style="color:#e3c7a7;font-weight:bold;text-decoration:none;">${esc(supportEmail)}</a>
            </p>
            <p style="margin:0 0 12px 0;font-size:11px;line-height:17px;color:#8d95c4;">${esc(received)}</p>
            <p style="margin:0;font-size:10px;line-height:15px;color:#6c739f;">${esc(disclaimer)}</p>
            <p style="margin:14px 0 0 0;font-size:10px;line-height:15px;color:#6c739f;">&copy; ${new Date().getFullYear()} GTCFX. ${esc(l.rights)}</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    c.dear(name),
    '',
    c.intro(expoName, amount),
    '',
    ...c.steps(amount).map(([title, t], i) => `${i + 1}. ${title} — ${t}`),
    '',
    c.details,
    `${c.url}: ${portalUrl}`,
    `${c.email}: ${email}`,
    `${c.password}: ${password}`,
    '',
    c.safe.replace(/<[^>]+>/g, ''),
    '',
    `${c.questions} ${supportEmail}.`,
    '',
    c.regards,
    c.team
  ].join('\n');

  return { subject: c.subject, html, text };
}
