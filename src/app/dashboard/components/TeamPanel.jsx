'use client';
import React from 'react';
import AddMemberForm from './AddMemberForm';
export default function TeamPanel({ team,onClose,onUploadCSV,onAddMember,onSendWarnings }){
if(!team) return <section className="text-center text-gray-500">Select a team to see details and manage members.</section>;
return (<section className="bg-white rounded-lg shadow p-4">
<div className="flex items-center justify-between mb-4">
<div><h2 className="text-xl font-semibold">{team.name}</h2><p className="text-sm text-gray-500">{team.description}</p></div>
<div className="flex gap-2">
<label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded cursor-pointer">
<input type="file" accept=".csv" className="hidden" onChange={e=>onUploadCSV(team.id,e.target.files[0])} />
<span className="text-sm">Upload CSV</span>
</label>
<button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>onSendWarnings(team.id)}>Send Warning Emails</button>
<button className="px-3 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<h3 className="font-medium mb-2">Members ({team.members.length})</h3>
<div className="space-y-2">{team.members.map(m=>(<div key={m.id} className="flex items-center justify-between p-3 border rounded">
<div><div className="font-medium">{m.name}</div><div className="text-xs text-gray-500">{m.role} • {m.email}</div></div>
<button className="text-sm px-2 py-1 bg-yellow-100 rounded" onClick={()=>alert(`(Demo) Would send warning to ${m.email}`)}>Warn</button>
</div>))}</div>
</div>
<div>
<h3 className="font-medium mb-2">Add member</h3>
<AddMemberForm onAdd={member=>onAddMember(team.id,member)} />
<div className="mt-6"><h4 className="font-medium mb-2">CSV format</h4><p className="text-sm text-gray-500">Header row: name,email,role (optional id)</p><pre className="mt-2 p-2 bg-gray-50 text-xs rounded">name,email,role\nJohn Doe,john@example.com,Volunteer</pre></div>
</div>
</div>
</section>);
}