// src/app/api/remove-member/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';        // adjust path to your DB connection helper
import Team from '@/models/Team';              // adjust to your Team model

export async function POST(req) {
  try {
    const { teamId, memberId } = await req.json();
    if (!teamId || !memberId) return NextResponse.json({ success: false, error: 'teamId and memberId required' }, { status: 400 });

    await connectDB();

    // Remove member from team's members array
    const update = await Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: { id: memberId } } },
      { new: true }
    );

    if (!update) return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 });

    return NextResponse.json({ success: true, team: update });
  } catch (err) {
    console.error('remove-member error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
