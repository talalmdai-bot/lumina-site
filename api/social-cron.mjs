// Scheduler tick. Called by the GitHub Actions workflow, never by a browser.
// Finds posts whose publishAt has passed and sends each one to Telegram for approval.

const SITE = process.env.SITE_URL || 'https://luminavisual.co.il';
// Instagram Login flavour of the API — no Facebook Page in the chain.
const GRAPH = 'https://graph.instagram.com/v25.0';

async function loadQueue() {
  const index = await fetch(SITE + '/social/queue/index.json', { cache: 'no-store' });
  if (!index.ok) throw new Error('queue index unreachable: ' + index.status);
  const names = (await index.json()).posts || [];
  const posts = await Promise.all(names.map(async function (name) {
    const res = await fetch(SITE + '/social/queue/' + name, { cache: 'no-store' });
    if (!res.ok) {
      console.error('[social] cannot read', name, res.status);
      return null;
    }
    return res.json();
  }));
  return posts.filter(Boolean);
}

// Instagram itself is the source of truth for what already went out, so a
// repeated tick or a double button press cannot post the same caption twice.
async function publishedCaptions() {
  const url = GRAPH + '/' + process.env.IG_USER_ID + '/media?fields=caption&limit=25';
  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + process.env.IG_ACCESS_TOKEN }
  });
  if (!res.ok) throw new Error('instagram media list failed: ' + (await res.text()));
  return ((await res.json()).data || []).map(function (m) { return (m.caption || '').trim(); });
}

// A carousel holds an array, so list the slides in order rather than letting
// the array stringify itself into one unreadable comma-joined line.
function describeMedia(media) {
  if (!Array.isArray(media)) return media;
  return media.length + ' שקופיות\n' +
    media.map(function (url, i) { return '  ' + (i + 1) + '. ' + url; }).join('\n');
}

async function askApproval(post) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const due = new Date(post.publishAt).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
  const text =
    'פוסט מוכן לפרסום\n\n' +
    'מזהה: ' + post.id + '\n' +
    'זמן שנקבע: ' + due + '\n' +
    'סוג: ' + (post.type || 'reel') + '\n' +
    'מדיה: ' + describeMedia(post.media) + '\n\n' +
    '--- הכיתוב ---\n' + post.caption;
  const res = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: text,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[
          { text: 'פרסם עכשיו', callback_data: 'pub:' + post.id },
          { text: 'דלג', callback_data: 'skip:' + post.id }
        ]]
      }
    })
  });
  if (!res.ok) console.error('[social] telegram send failed', await res.text());
}

export default async function handler(req, res) {
  if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
    res.status(403).json({ ok: false, error: 'forbidden' });
    return;
  }
  try {
    const now = Date.now();
    const [queue, already] = await Promise.all([loadQueue(), publishedCaptions()]);
    const due = queue.filter(function (p) {
      return new Date(p.publishAt).getTime() <= now && !already.includes((p.caption || '').trim());
    });
    for (const post of due) await askApproval(post);
    res.status(200).json({ ok: true, checked: queue.length, pending: due.length });
  } catch (err) {
    console.error('[social] tick failed', err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
