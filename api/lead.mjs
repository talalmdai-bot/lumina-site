const ALLOWED_HOSTS = ['luminavisual.co.il', 'www.luminavisual.co.il'];
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;
const MIN_FILL_MS = 3000;

// survives only while the serverless instance stays warm — slows floods, does not stop them
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(function (t) { return now - t < RATE_WINDOW_MS; });
  if (recent.length >= RATE_MAX) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

function clean(value, max) {
  return String(value || '').replace(/[\r\n\t]+/g, ' ').slice(0, max).trim();
}

function originAllowed(origin) {
  if (!origin) return true; // non-browser callers and same-origin requests without the header
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.includes(host) || host.endsWith('.vercel.app');
  } catch (err) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }
  if (!originAllowed(req.headers.origin)) {
    res.status(403).json({ ok: false, error: 'forbidden origin' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // bot traps: hidden field must stay empty, and a human cannot fill the form instantly
    const elapsed = Number(body.elapsed) || 0;
    if (clean(body.company, 100) || (elapsed > 0 && elapsed < MIN_FILL_MS)) {
      console.warn('[lead] bot trap triggered');
      res.status(200).json({ ok: true });
      return;
    }

    const name = clean(body.name, 100);
    const phone = clean(body.phone, 40);
    const type = clean(body.type, 60);
    const venue = clean(body.venue, 120);
    const world = clean(body.world, 60);
    const rawDate = clean(body.eventDate, 20);
    // the date input sends yyyy-mm-dd; the Telegram message reads better day-first
    const eventDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate.split('-').reverse().join('.') : rawDate;
    if (!name || phone.replace(/\D/g, '').length < 9) {
      res.status(400).json({ ok: false, error: 'missing fields' });
      return;
    }
    // consent to the terms and the privacy policy is what makes the contact lawful
    if (body.consent !== true) {
      res.status(400).json({ ok: false, error: 'consent required' });
      return;
    }

    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) {
      console.warn('[lead] rate limited', ip);
      res.status(429).json({ ok: false, error: 'too many requests' });
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
      (eventDate ? 'תאריך האירוע: ' + eventDate + '\n' : '') +
      (venue ? 'אולם: ' + venue + '\n' : '') +
      (world ? 'עולם שעניין אותו: ' + world + '\n' : '') +
      'זמן: ' + when + '\n' +
      'אישר תקנון ומדיניות פרטיות: כן\n\n' +
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
