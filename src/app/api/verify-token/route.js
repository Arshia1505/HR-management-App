// src/app/api/verify-token/route.js
import { connectToDB } from '@/lib/mongoose';
import Member from '@/models/Member';

export async function GET(req) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return new Response(JSON.stringify({ error: 'token missing' }), { status: 400 });

    const member = await Member.findOne({
      onboarding_token: token,
      onboarding_token_expires: { $gt: new Date() }
    }).lean();

    if (!member) return new Response(JSON.stringify({ valid: false }), { status: 400 });
    // do not return token fields
    delete member.onboarding_token;
    delete member.onboarding_token_expires;

    return new Response(JSON.stringify({ valid: true, member }), { status: 200 });
  } catch (err) {
    console.error('verify-token error', err);
    return new Response(JSON.stringify({ error: 'server error' }), { status: 500 });
  }
}
