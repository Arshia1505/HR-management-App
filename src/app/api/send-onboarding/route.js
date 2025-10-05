// // src/app/api/send-onboarding/route.js
// import crypto from 'crypto';
// import { queryDB } from '@/lib/db';
// import nodemailer from 'nodemailer';

// export async function POST(req) {
//   const { memberId } = await req.json();
//   if (!memberId) return new Response('Missing memberId', { status: 400 });

//   const token = crypto.randomBytes(24).toString('hex');
//   const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

//   await queryDB('UPDATE members SET onboarding_token=$1, onboarding_token_expires=$2 WHERE id=$3', [token, expires.toISOString(), memberId]);

//   const member = (await queryDB('SELECT * FROM members WHERE id=$1', [memberId]))[0];
//   const link = `${process.env.APP_URL}/onboard/${token}`;

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: +process.env.SMTP_PORT,
//     secure: +process.env.SMTP_PORT === 465,
//     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
//   });

//   await transporter.sendMail({
//     from: process.env.FROM_EMAIL,
//     to: member.email,
//     subject: 'Onboarding Form',
//     html: `<p>Hi ${member.name},</p><p>Please fill your onboarding form: <a href="${link}">${link}</a></p>`
//   });

//   return new Response(JSON.stringify({ success: true }), { status: 200 });
// }
// src/app/api/send-onboarding/route.js
import crypto from 'crypto';
import { connectToDB } from '@/lib/mongoose';
import Member from '@/models/Member';
import nodemailer from 'nodemailer';

async function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: +process.env.SMTP_PORT === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

export async function POST(req) {
  try {
    await connectToDB();
    const { memberId } = await req.json();
    if (!memberId) return new Response(JSON.stringify({ error: 'memberId required' }), { status: 400 });

    const member = await Member.findById(memberId);
    if (!member) return new Response(JSON.stringify({ error: 'Member not found' }), { status: 404 });

    const token = crypto.randomBytes(24).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    member.onboarding_token = token;
    member.onboarding_token_expires = expires;
    await member.save();

    const link = `${process.env.APP_URL}/onboard/${token}`;

    const transporter = await createTransporter();
    const html = `<p>Hi ${member.name || 'there'},</p>
      <p>Please complete your onboarding form: <a href="${link}">${link}</a></p>
      <p>This link expires in 24 hours.</p>`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: member.email,
      subject: 'Onboarding Form',
      html
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('send-onboarding error', err);
    return new Response(JSON.stringify({ error: 'Failed to send onboarding' }), { status: 500 });
  }
}
