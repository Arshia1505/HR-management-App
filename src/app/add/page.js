'use client';
import { useState } from 'react';

export default function Add() {
  const [form, setForm] = useState({ name: '', email: '', title: '', team: '', empId: '' });
  const onSubmit = e => { e.preventDefault(); alert('Implement API to save member'); };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Member</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required className="w-full p-3 border rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required className="w-full p-3 border rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-3 border rounded" placeholder="Employee ID" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} />
        <input className="w-full p-3 border rounded" placeholder="Job title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="w-full p-3 border rounded" placeholder="Department" value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} />
        <div>
          <button className="px-4 py-2 bg-black text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
