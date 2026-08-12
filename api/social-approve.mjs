// Telegram webhook. Fires when a button on an approval message is tapped.
// "pub" publishes to Instagram, "fin" finishes a container that was still encoding.

// Instagram Login flavour of the API — no Facebook Page in the chain.
const GRAPH = 'https://graph.instagram.com/v25.0';
const SITE = process.env.SITE_URL || 'https://luminavisual.co.il';
const POLL_BUDGET_MS = 45000;

async function tell(text, buttons) {
  const body = {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: text,
    disable_web_page_preview: true
  };
  if (buttons) body.reply_markup = { inline_keyboard: [buttons] };
  await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function graph(path, params) {
  const res = await fetch(GRAPH + '/' + process.env.IG_USER_ID + path, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.IG_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json.error || json));
  return json;
}

async function findPost(id) {
  const index = await fetch(SITE + '/social/queue/index.json', { cache: 'no-store' });
  const names = (await index.json()).posts || [];
  for (const name of names) {
    const res = await fetch(SITE + '/social/queue/' + name, { cache: 'no-store' });
    if (!res.ok) continue;
    const post = await res.json();
    if (post.id === id) return post;
  }
  return null;
}

// Instagram encodes video asynchronously; the container is only publishable once FINISHED.
// The deadline is shared across a whole publish, so a ten-slide carousel cannot
// spend the budget ten times over and leave Telegram waiting past its timeout.
async function waitForContainer(id, deadline) {
  while (Date.now() < deadline) {
    const res = await fetch(GRAPH + '/' + id + '?fields=status_code', {
      headers: { Authorization: 'Bearer ' + process.env.IG_ACCESS_TOKEN }
    });
    const status = (await res.json()).status_code;
    if (status === 'FINISHED') return true;
    if (status === 'ERROR') throw new Error('instagram rejected the media');
    await new Promise(function (r) { setTimeout(r, 4000); });
  }
  return false;
}

async function alreadyOut(caption) {
  const url = GRAPH + '/' + process.env.IG_USER_ID + '/media?fields=caption&limit=25';
  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + process.env.IG_ACCESS_TOKEN }
  });
  if (!res.ok) return false;
  return ((await res.json()).data || [])
    .some(function (m) { return (m.caption || '').trim() === (caption || '').trim(); });
}

// A carousel is assembled slide by slide: every slide becomes its own container,
// then one parent container ties them together under a single caption. Only the
// parent carries the caption — a caption on a child is silently dropped.
async function buildCarousel(post, deadline) {
  const slides = post.media;
  if (!Array.isArray(slides) || slides.length < 2 || slides.length > 10) {
    throw new Error('קרוסלה צריכה בין 2 ל-10 שקופיות במערך media');
  }
  const children = [];
  for (const url of slides) {
    const params = { is_carousel_item: true };
    if (/\.mp4($|\?)/i.test(url)) {
      params.media_type = 'VIDEO';
      params.video_url = url;
    } else {
      params.image_url = url;
    }
    const child = await graph('/media', params);
    // Stills report FINISHED on the first check, so this is nearly free for them.
    if (!(await waitForContainer(child.id, deadline))) {
      throw new Error('שקופית לא סיימה להתקודד בזמן: ' + url);
    }
    children.push(child.id);
  }
  const parent = await graph('/media', {
    media_type: 'CAROUSEL',
    children: children.join(','),
    caption: post.caption
  });
  return parent.id;
}

async function publish(post) {
  if (await alreadyOut(post.caption)) {
    await tell('"' + post.id + '" כבר פורסם. לא עשיתי כלום.');
    return;
  }
  const deadline = Date.now() + POLL_BUDGET_MS;
  const type = post.type || 'reel';
  let containerId;
  if (type === 'carousel') {
    containerId = await buildCarousel(post, deadline);
  } else {
    const params = { caption: post.caption };
    if (type === 'image') {
      params.image_url = post.media;
    } else {
      params.media_type = 'REELS';
      params.video_url = post.media;
    }
    containerId = (await graph('/media', params)).id;
  }
  if (!(await waitForContainer(containerId, deadline))) {
    await tell('"' + post.id + '" עדיין מקודד אצל אינסטגרם. לחץ כדי להשלים.',
      [{ text: 'השלם פרסום', callback_data: 'fin:' + containerId }]);
    return;
  }
  const published = await graph('/media_publish', { creation_id: containerId });
  await tell('פורסם. מזהה מדיה: ' + published.id);
}

export default async function handler(req, res) {
  if (req.headers['x-telegram-bot-api-secret-token'] !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    res.status(403).json({ ok: false });
    return;
  }
  const query = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}).callback_query;
  if (!query) {
    res.status(200).json({ ok: true });
    return;
  }
  // Stops the spinner on the button straight away; the real work still runs below.
  await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/answerCallbackQuery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: query.id })
  });

  const [action, value] = String(query.data || '').split(':');
  try {
    if (action === 'skip') {
      await tell('דילגתי על "' + value + '". כדי שלא יחזור, הסר אותו מ-social/queue/index.json.');
    } else if (action === 'fin') {
      const published = await graph('/media_publish', { creation_id: value });
      await tell('פורסם. מזהה מדיה: ' + published.id);
    } else if (action === 'pub') {
      const post = await findPost(value);
      if (!post) throw new Error('לא מצאתי את הפוסט ' + value + ' בתור');
      await publish(post);
    }
  } catch (err) {
    console.error('[social] approve failed', err);
    await tell('הפרסום נכשל: ' + String(err.message || err));
  }
  // Answered only now, so Telegram does not retry the update mid-publish.
  res.status(200).json({ ok: true });
}
