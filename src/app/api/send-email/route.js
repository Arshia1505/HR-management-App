// // src/app/api/send-email/route.js
// import nodemailer from 'nodemailer';

// export async function POST(req) {
//   const { to, subject, html } = await req.json();
//   if (!to || !subject || !html) return new Response('Missing fields', { status: 400 });

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: +process.env.SMTP_PORT,
//     secure: +process.env.SMTP_PORT === 465,
//     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
//   });

//   try {
//     const info = await transporter.sendMail({
//       from: process.env.FROM_EMAIL,
//       to, subject, html
//     });
//     return new Response(JSON.stringify({ success: true, info }), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: 'failed to send' }), { status: 500 });
//   }
// }

import nodemailer from 'nodemailer';

export async function POST(req) {
  const { to, subject, html } = await req.json();

  if (!to || !subject || !html) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Email error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
