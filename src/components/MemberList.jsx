// src/components/MemberList.jsx
'use client';
import { useState } from 'react';

export default function MemberList({ members = [], onSend }) {
  const [selected, setSelected] = useState([]);
  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          onClick={() => onSend(selected)}
        >
          Send Warning
        </button>
      </div>
      <div className="space-y-2">
        {members.map(m => (
          <div key={m.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggle(m.id)} />
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-gray-500">{m.email}</div>
              </div>
            </div>
            <div>
              {m.onboarded ? <span className="text-green-600">Onboarded</span> : <span className="text-yellow-600">Pending</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
