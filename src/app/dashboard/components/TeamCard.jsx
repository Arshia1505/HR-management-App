'use client';
import React from 'react';
export default function TeamCard({ team, onOpen, onSendWarnings }) {
return (
<div className="min-w-[260px] bg-white rounded-lg shadow p-4 flex-shrink-0">
<div className="flex justify-between items-start">
<div>
<h2 className="text-lg font-medium">{team.name}</h2>
<p className="text-sm text-gray-500">{team.description}</p>
</div>
<div className="text-sm text-gray-400">{team.members.length}</div>
</div>
<ul className="mt-3 space-y-1 text-sm">
{team.members.slice(0,3).map(m=>(<li key={m.id} className="flex items-center justify-between">
<div><div className="font-medium">{m.name}</div><div className="text-xs text-gray-500">{m.role} • {m.email}</div></div>
</li>))}
</ul>
<div className="mt-3 flex items-center justify-between">
<button className="text-sm text-blue-600" onClick={()=>onOpen(team.id)}>More...</button>
<button className="text-sm px-2 py-1 bg-yellow-100 rounded" onClick={()=>onSendWarnings(team.id)}>Send Warnings</button>
</div>
</div>
);
}