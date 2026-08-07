export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = String(body.name || '').slice(0, 100).trim();
    const phone = String(body.phone || '').slice(0, 40).trim();
    const type = String(body.type || '').slice(0, 60).trim();
    if (!name || !phone) {
      res.status(400).json({ ok: false, error: 'missing fields' });
      return;
    }
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      res.status(500).json({ ok: false, error: 'not configured' });
      return;
    }
    const when = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
    const digits = phone.replace(/\D/g, '');
    const wa = digits.startsWith('0') ? '972' + digits.slice(1) : digits;
    const text =
      '\u{1F525} ליד חדש מהאתר\n\n' +
      'שם: ' + name + '\n' +
      'טלפון: ' + phone + '\n' +
      (type ? 'סוג אירוע: ' + type + '\n' : '') +
      'זמן: ' + when + '\n\n' +
      'https://wa.me/' + wa;

    const tg = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text, disable_web_page_preview: true })
    });
    if (!tg.ok) {
      const detail = await tg.text();
      console.error('telegram error', detail);
      res.status(502).json({ ok: false, error: 'telegram failed' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'server error' });
  }
}
