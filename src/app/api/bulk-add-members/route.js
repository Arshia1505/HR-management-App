// src/app/api/bulk-add-members/route.js
import { connectToDB } from '@/lib/mongoose';
import Member from '@/models/Member';

export async function POST(req) {
  try {
    await connectToDB();
    const { members } = await req.json();
    if (!Array.isArray(members) || members.length === 0) {
      return new Response(JSON.stringify({ error: 'No members provided' }), { status: 400 });
    }

    // Normalize and map incoming CSV columns to model fields
    const docs = members.map(m => ({
      name: (m.name || m.fullName || '').trim(),
      email: (m.email || '').trim().toLowerCase(),
      role: m.role || m.title || '',
      team: m.team || '',
      empId: m.empId || m.employeeId || ''
    })).filter(d => d.email); // require email

    // Use insertMany with ordered:false to skip duplicates and keep going
    const res = await Member.insertMany(docs, { ordered: false }).catch(err => {
      // insertMany will throw on duplicate keys; ignore but log other errors
      if (err && err.writeErrors) {
        console.warn('Some rows failed to insert (likely duplicates).', err.writeErrors.length);
      } else {
        throw err;
      }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('bulk-add-members error', err);
    return new Response(JSON.stringify({ error: 'Failed to add members' }), { status: 500 });
  }
}
