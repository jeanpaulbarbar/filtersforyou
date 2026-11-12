const HOME = 'https://filtersforyou.com.au/';
const TITLE = 'Filters For You installation';
const PHONE = '0430 546 749';
const ZONE = 'Australia/Sydney';
const WINDOW_MINUTES = 30;
const PICTURE = 'https://filtersforyou.com.au/assets/photos/preview.png';
const PREVIEWERS = /facebookexternalhit|facebot|twitterbot|whatsapp|slackbot|telegrambot|discordbot|linkedinbot|skypeuripreview|applebot|googlebot|bingbot|crawler|spider|preview/i;

function esc(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n');
}

function fold(line) {
  let raw = Buffer.from(line, 'utf8');
  const out = [];
  while (raw.length > 75) {
    let cut = 75;
    while (cut > 0 && (raw[cut] & 0xc0) === 0x80) cut -= 1;
    out.push(raw.subarray(0, cut).toString('utf8'));
    raw = Buffer.concat([Buffer.from(' '), raw.subarray(cut)]);
  }
  out.push(raw.toString('utf8'));
  return out.join('\r\n');
}

function stamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function clock(date) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: ZONE, hour: 'numeric', minute: '2-digit', hour12: true,
  }).formatToParts(date);
  const get = (type) => (parts.find((p) => p.type === type) || {}).value || '';
  return get('hour') + ':' + get('minute') + get('dayPeriod').toLowerCase().replace(/[^apm]/g, '');
}

function day(date) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: ZONE, weekday: 'long', day: 'numeric', month: 'long',
  }).formatToParts(date);
  const get = (type) => (parts.find((p) => p.type === type) || {}).value || '';
  return get('weekday') + ' ' + get('day') + ' ' + get('month');
}

function html(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function card(job, until) {
  const title = 'Your installation, ' + day(job.start);
  const line = 'Arriving between ' + clock(job.start) + ' and ' + clock(until) + '. Tap to add it to your calendar.';
  return '<!doctype html><html lang="en-AU"><head><meta charset="utf-8">'
    + '<title>' + html(title) + '</title>'
    + '<meta name="robots" content="noindex, nofollow">'
    + '<meta name="description" content="' + html(line) + '">'
    + '<meta property="og:type" content="website">'
    + '<meta property="og:site_name" content="Filters For You">'
    + '<meta property="og:title" content="' + html(title) + '">'
    + '<meta property="og:description" content="' + html(line) + '">'
    + '<meta property="og:image" content="' + PICTURE + '">'
    + '<meta property="og:image:width" content="1200">'
    + '<meta property="og:image:height" content="630">'
    + '<meta name="twitter:card" content="summary_large_image">'
    + '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">'
    + '<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png">'
    + '</head><body><h1>' + html(title) + '</h1><p>' + html(line) + '</p></body></html>';
}

function token(req) {
  const q = req.query || {};
  if (q.p) return String(q.p);
  const m = String(req.url || '').match(/\/cal\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
}

function read(p) {
  if (!/^[A-Za-z0-9_-]{8,400}$/.test(p)) return null;
  let text = '';
  try {
    text = Buffer.from(p, 'base64url').toString('utf8');
  } catch (e) {
    return null;
  }
  const parts = text.split('~');
  if (parts.length < 3) return null;
  const startMinutes = parseInt(parts[0], 36);
  const length = parseInt(parts[1], 36);
  const address = parts.slice(2).join('~').replace(/[^A-Za-z0-9 ,.\/'&()#-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 140);
  if (!Number.isFinite(startMinutes) || !Number.isFinite(length)) return null;
  if (length < 15 || length > 1440) return null;
  if (/https?|www\.|\/\//i.test(address)) return null;
  const start = new Date(startMinutes * 60000);
  const now = Date.now();
  if (start.getTime() < now - 400 * 86400000 || start.getTime() > now + 800 * 86400000) return null;
  return { start, end: new Date(start.getTime() + length * 60000), address };
}

module.exports = (req, res) => {
  const p = token(req);
  const job = read(p);
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (!job) {
    res.statusCode = 302;
    res.setHeader('Location', HOME);
    return res.end();
  }
  const until = new Date(job.start.getTime() + WINDOW_MINUTES * 60000);
  const about = [
    'We arrive between ' + clock(job.start) + ' and ' + clock(until) + '.',
    'Please keep the installation area clear, including the cabinet for an under sink system.',
    'Need anything? Call us on ' + PHONE + '.',
  ].join('\n\n');
  const ua = String(req.headers['user-agent'] || '');
  const wantsFile = String((req.query || {}).f || '') === 'ics';
  if (PREVIEWERS.test(ua) && !wantsFile) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(card(job, until));
  }
  if (/Android/i.test(ua) && !wantsFile) {
    const google = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(TITLE)
      + '&dates=' + stamp(job.start) + '/' + stamp(job.end)
      + '&details=' + encodeURIComponent(about)
      + '&location=' + encodeURIComponent(job.address);
    res.statusCode = 302;
    res.setHeader('Location', google);
    return res.end();
  }
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Filters For You//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:install-' + p.slice(0, 48) + '@filtersforyou.com.au',
    'DTSTAMP:' + stamp(new Date()),
    'DTSTART:' + stamp(job.start),
    'DTEND:' + stamp(job.end),
    'SUMMARY:' + esc(TITLE),
    'LOCATION:' + esc(job.address),
    'DESCRIPTION:' + esc(about),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="filters-for-you-installation.ics"');
  return res.end(lines.map(fold).join('\r\n') + '\r\n');
};
