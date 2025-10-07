'use client';
import React from 'react';
export default function NewTeamModal({ show,onClose,onCreate,name,setName,desc,setDesc }){
if(!show) return null;
return (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
<div className="bg-white rounded p-6 w-full max-w-md">
<h3 className="text-lg font-semibold mb-3">Create New Team</h3>
<div className="space-y-3">
<input className="w-full border rounded px-3 py-2" placeholder="Team name" value={name} onChange={e=>setName(e.target.value)} />
<input className="w-full border rounded px-3 py-2" placeholder="Short description" value={desc} onChange={e=>setDesc(e.target.value)} />
<div className="flex justify-end gap-2">
<button className="px-4 py-2" onClick={onClose}>Cancel</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onCreate}>Create</button>
</div>
</div>
</div>
</div>);
}