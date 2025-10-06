import { connectToDB } from '@/lib/mongoose';
import Member from '@/models/Member';

export async function POST(req) {
  try {
    await connectToDB();
    const { token, answers } = await req.json();
    if (!token) return new Response(JSON.stringify({ error: 'token missing' }), { status: 400 });

    const member = await Member.findOne({
      onboarding_token: token,
      onboarding_token_expires: { $gt: new Date() }
    });

    if (!member) return new Response(JSON.stringify({ error: 'invalid token' }), { status: 400 });

    // mark onboarded and clear token
    member.onboarded = true;
    member.onboarding_token = null;
    member.onboarding_token_expires = null;

    // optionally: store answers somewhere (e.g., onboarding collection) — left as exercise
    await member.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('complete-onboarding error', err);
    return new Response(JSON.stringify({ error: 'server error' }), { status: 500 });
  }
}
