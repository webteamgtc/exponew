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

export function expoWelcomeEmail({ lang = 'en', name, email, password, portalUrl, supportEmail, expoName, amount }) {
  const c = COPY[lang] ?? COPY.en;
  const align = c.dir === 'rtl' ? 'right' : 'left';
  const steps = c
    .steps(amount)
    .map(
      ([title, text], i) => `
          <tr>
            <td style="width:44px;vertical-align:top;padding:0 0 18px;">
              <div style="width:32px;height:32px;border-radius:16px;background:#192055;color:#ffffff;font-size:14px;font-weight:700;line-height:32px;text-align:center;">${i + 1}</div>
            </td>
            <td style="vertical-align:top;padding:4px 0 18px;">
              <div style="font-size:15px;font-weight:700;color:#192055;">${esc(title)}</div>
              <div style="font-size:13px;line-height:20px;color:#4b5563;margin-top:2px;">${esc(text)}</div>
            </td>
          </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html dir="${c.dir}" lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background-color:#F7F7F7;font-family:Arial,sans-serif;color:#111827;line-height:22px;text-align:${align};">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="width:100%;"><tr><td align="center" bgcolor="#F7F7F7" style="padding:24px 12px;">
    <div style="max-width:560px;margin:0 auto;background-color:#192055;padding:5px;border-radius:40px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" dir="${c.dir}" style="border-radius:36px;padding:28px;background-color:#ffffff;width:100%;text-align:${align};">
        <tr><td style="padding:4px 0 20px;text-align:center;"><img src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/email-test.png" alt="GTCFX" style="max-width:165px;height:auto;"></td></tr>
        <tr><td>
          <h2 style="color:#ffffff;text-align:center;font-size:16px;margin:0 auto 28px;padding:10px 16px;background:#192055;border-radius:27px;max-width:80%;">${esc(c.banner)}</h2>
          <p style="font-size:16px;color:#192055;margin:0 0 12px;"><strong>${esc(c.dear(name))}</strong></p>
          <p style="margin:0 0 12px;">${esc(c.intro(expoName, amount))}</p>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:22px 0 8px;">${steps}
          </table>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:6px 0 22px;background:#f6f7fb;border:1px solid #e6e9f2;border-radius:16px;">
            <tr><td style="padding:16px 20px 6px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7194;">${esc(c.details)}</td></tr>
            <tr><td style="padding:4px 20px;font-size:14px;"><span style="color:#6b7194;">${esc(c.url)}:</span> <a href="${esc(portalUrl)}" style="color:#293b93;font-weight:700;" dir="ltr">${esc(portalUrl.replace(/^https?:\/\//, '').split('?')[0])}</a></td></tr>
            <tr><td style="padding:4px 20px;font-size:14px;"><span style="color:#6b7194;">${esc(c.email)}:</span> <strong style="color:#192055;" dir="ltr">${esc(email)}</strong></td></tr>
            <tr><td style="padding:4px 20px 16px;font-size:14px;"><span style="color:#6b7194;">${esc(c.password)}:</span> <strong style="color:#192055;font-family:Consolas,Menlo,monospace;letter-spacing:0.5px;" dir="ltr">${esc(password)}</strong></td></tr>
          </table>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 22px;"><tr><td style="border-radius:30px;background:#293b93;">
            <a href="${esc(portalUrl)}" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:30px;">${esc(c.button)}</a>
          </td></tr></table>

          <p style="margin:0 0 12px;padding:12px 16px;background:#fff8ec;border:1px solid #f1dfbf;border-radius:12px;font-size:13px;line-height:20px;color:#7a5418;">${c.safe}</p>
          <p style="margin:0 0 12px;">${esc(c.questions)} <a href="mailto:${esc(supportEmail)}" style="color:#5166ff;">${esc(supportEmail)}</a>.</p>
          <p style="line-height:30px;padding-top:12px;margin:0;">${esc(c.regards)}<br><strong style="color:#192055;">${esc(c.team)}</strong></p>
        </td></tr>
        <tr><td style="padding:24px 0 0;font-size:9px;line-height:13px;color:#000;">
          ${c.footer(supportEmail).map((l) => `<p style="margin:0 0 6px;">${esc(l)}</p>`).join('\n          ')}
        </td></tr>
      </table>
    </div>
  </td></tr></table>
</body></html>`;

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
