import { connectToDB } from '@/lib/mongoose';
import Member from '@/models/Member';

export async function GET() {
  try {
    await connectToDB();
    const members = await Member.find().sort({ created_at: -1 }).lean();
    return new Response(JSON.stringify({ members }), { status: 200 });
  } catch (err) {
    console.error('get-members error', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch members' }), { status: 500 });
  }
}
