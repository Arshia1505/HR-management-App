// // src/app/api/send-warning/route.js
// import nodemailer from 'nodemailer';
// import { queryDB } from '@/lib/db';

// export async function POST(req) {
//   const { memberIds, subject, body } = await req.json();
//   if (!memberIds?.length) return new Response('No members', { status: 400 });

//   const members = await queryDB('SELECT email FROM members WHERE id = ANY($1::int[])', [memberIds]);
//   const toList = members.map(m => m.email).join(',');

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: +process.env.SMTP_PORT,
//     secure: +process.env.SMTP_PORT === 465,
//     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
//   });

//   try {
//     await transporter.sendMail({ from: process.env.FROM_EMAIL, bcc: toList, subject, html: body });
//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: 'failed' }), { status: 500 });
//   }
// }

// src/app/api/send-warning/route.js
import { connectToDB } from '@/lib/mongoose';
import Member from '@/models/Member';
import nodemailer from 'nodemailer';

async function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: +process.env.SMTP_PORT === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function POST(req) {
  try {
    await connectToDB();
    const { memberIds, subject, body } = await req.json();
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No members selected' }), { status: 400 });
    }
    if (!subject || !body) {
      return new Response(JSON.stringify({ error: 'subject/body required' }), { status: 400 });
    }

    // fetch emails
    const members = await Member.find({ _id: { $in: memberIds } }, { email: 1 }).lean();
    const emails = members.map(m => m.email).filter(Boolean);
    if (emails.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid emails found' }), { status: 400 });
    }

    const transporter = await createTransporter();

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      bcc: emails, // BCC to protect privacy
      subject,
      html: body
    });

    // optional: log in warnings collection/table (not implemented here)

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('send-warning error', err);
    return new Response(JSON.stringify({ error: 'Failed to send warning' }), { status: 500 });
  }
}
