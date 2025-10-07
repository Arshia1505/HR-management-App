'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function WarningPage() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // modal open
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/get-members');
        if (!res.ok) throw new Error('failed to fetch');
        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error(err);
        alert('Failed to load members');
      }
    }
    load();
  }, []);

  const toggle = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const toggleAll = () => {
    if (selected.length === members.length) setSelected([]);
    else setSelected(members.map(m => m._id || m.id));
  };

  const openCompose = () => {
    if (!selected.length) {
      alert('Please select at least one member');
      return;
    }
    setSubject('');
    setBody('');
    setIsOpen(true);
  };

  const sendWarning = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return alert('Subject and body are required');

    setLoading(true);
    try {
      const res = await fetch('/api/send-warning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberIds: selected, subject, body }),
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({ error: 'failed' }));
        throw new Error(err?.error || 'Failed to send');
      }
      alert('Emails sent successfully');
      setIsOpen(false);
      setSelected([]); // optionally clear selection
    } catch (err) {
      console.error(err);
      alert('Failed to send emails: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Send Warning / Appointment Emails</h1>

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="px-3 py-2 border rounded hover:bg-gray-100 transition"
            >
              {selected.length === members.length ? 'Unselect all' : 'Select all'}
            </button>

            <button
              onClick={openCompose}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Compose & Send Warning
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Selected: <span className="font-medium">{selected.length}</span>
          </div>
        </div>

        <div className="bg-white shadow rounded divide-y">
          {members.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No members found</div>
          ) : (
            members.map(m => {
              const id = m._id || m.id;
              return (
                <div key={id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(id)}
                      onChange={() => toggle(id)}
                    />
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-sm text-gray-500">{m.email}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    {m.onboarded ? (
                      <span className="text-green-600">Onboarded</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setIsOpen(false)} />
          <form
            onSubmit={sendWarning}
            className="relative z-60 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mx-4"
          >
            <h2 className="text-lg font-semibold mb-3">Compose Warning Email</h2>

            <div className="mb-3">
              <label className="text-sm block mb-1">To (BCC)</label>
              <div className="text-xs text-gray-500">Recipients will be sent as BCC for privacy. Selected: {selected.length}</div>
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full p-3 border rounded"
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here (HTML allowed)"
                rows={8}
                className="w-full p-3 border rounded"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={()=>setIsOpen(false)}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Warning'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
