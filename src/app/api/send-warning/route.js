import nodemailer from 'nodemailer';

const MAX_RETRIES = Number(process.env.EMAIL_MAX_RETRIES || 4);
const BASE_RETRY_DELAY_MS = Number(process.env.EMAIL_RETRY_BASE_MS || 800); // exponential backoff base
const PER_RECIPIENT_DELAY_MS = Number(process.env.EMAIL_SEND_DELAY_MS || 250); // delay between recipients
const MAX_CONNECTIONS = Number(process.env.EMAIL_MAX_CONNECTIONS || 5); // pool connections

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// send with retries and exponential backoff
async function sendWithRetries(transporter, mailOpts, to) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // include an envelope to avoid provider rewriting recipients in some cases
      const info = await transporter.sendMail({ ...mailOpts, to, envelope: { from: mailOpts.from, to } });

      // nodemailer returns accepted/rejected arrays
      const accepted = info.accepted || [];
      const rejected = info.rejected || [];

      // If accepted contains the address, treat as success
      if (accepted.length > 0 && accepted.includes(String(to))) {
        return { to, success: true, info: { accepted, rejected, messageId: info.messageId } };
      }

      // If accepted doesn't include it but info has accepted (other recipients) — still look at info
      if (accepted.length > 0) {
        return { to, success: true, info: { accepted, rejected, messageId: info.messageId } };
      }

      // If rejected or nothing accepted, treat as failure and throw to retry
      const errMsg = `Rejected: ${JSON.stringify(rejected)}`;
      console.warn(`sendMail to ${to} responded with no accepted recipients: ${errMsg}`);
      throw new Error(errMsg);

    } catch (err) {
      const errMsg = err?.message || String(err);
      console.error(`send attempt ${attempt} for ${to} failed:`, errMsg);

      if (attempt === MAX_RETRIES) {
        return { to, success: false, error: errMsg };
      }

      // exponential backoff before retry
      const backoff = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      await wait(backoff);
    }
  }

  return { to, success: false, error: 'Unknown error' };
}

export async function POST(req) {
  try {
    const { emails, subject, message } = await req.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No recipients provided' }), { status: 400 });
    }

    // env validation
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
      console.error('Missing SMTP env variables');
      return new Response(JSON.stringify({ success: false, error: 'SMTP not configured' }), { status: 500 });
    }

    // create transporter with pooling (more reliable & performant)
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      pool: true,
      maxConnections: MAX_CONNECTIONS,
      maxMessages: 1000,
      // helpful during debugging:
      logger: Boolean(process.env.EMAIL_DEBUG_LOG === 'true'),
      debug: Boolean(process.env.EMAIL_DEBUG_LOG === 'true'),
    });

    // optional verify
    try {
      await transporter.verify();
      console.log('SMTP transporter verified');
    } catch (verifyErr) {
      console.warn('SMTP verify warning (continuing):', verifyErr?.message || verifyErr);
    }

    const mailOptsBase = {
      from: FROM_EMAIL, // ensure matches SMTP_USER for providers like Gmail
      subject: subject || '(No subject)',
      text: message || '',
      html: `<div>${(message || '').replace(/\n/g, '<br/>')}</div>`,
      headers: { 'X-Mailer': 'HRISELINK-Notifier' }
    };

    const results = [];
    for (let i = 0; i < emails.length; i++) {
      const to = emails[i];
      if (!to || !String(to).includes('@')) {
        results.push({ to, success: false, error: 'Invalid email address' });
        continue;
      }

      // small delay between recipients to avoid burst throttling
      if (i > 0) await wait(PER_RECIPIENT_DELAY_MS);

      const r = await sendWithRetries(transporter, mailOptsBase, to);
      results.push(r);
    }

    // close pooled connections
    try { transporter.close(); } catch (e) { console.warn('Error closing transporter pool:', e?.message || e); }

    const accepted = results.filter(r => r.success).length;
    const failed = results.length - accepted;
    return new Response(JSON.stringify({ success: true, accepted, failed, results }), { status: 200 });

  } catch (err) {
    console.error('Unexpected error in send-warning route:', err);
    return new Response(JSON.stringify({ success: false, error: err?.message || String(err) }), { status: 500 });
  }
}
