// 'use client';
// import React from 'react';
// import AddMemberForm from './AddMemberForm';
// export default function TeamPanel({ team,onClose,onUploadCSV,onAddMember,onSendWarnings }){
// if(!team) return <section className="text-center text-gray-500">Select a team to see details and manage members.</section>;
// return (<section className="bg-white rounded-lg shadow p-4">
// <div className="flex items-center justify-between mb-4">
// <div><h2 className="text-xl font-semibold">{team.name}</h2><p className="text-sm text-gray-500">{team.description}</p></div>
// <div className="flex gap-2">
// <label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded cursor-pointer">
// <input type="file" accept=".csv" className="hidden" onChange={e=>onUploadCSV(team.id,e.target.files[0])} />
// <span className="text-sm">Upload CSV</span>
// </label>
// <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>onSendWarnings(team.id)}>Send Warning Emails</button>
// <button className="px-3 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
// </div>
// </div>
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// <div>
// <h3 className="font-medium mb-2">Members ({team.members.length})</h3>
// <div className="space-y-2">{team.members.map(m=>(<div key={m.id} className="flex items-center justify-between p-3 border rounded">
// <div><div className="font-medium">{m.name}</div><div className="text-xs text-gray-500">{m.role} • {m.email}</div></div>
// <button className="text-sm px-2 py-1 bg-yellow-100 rounded" onClick={()=>alert(`(Demo) Would send warning to ${m.email}`)}>Warn</button>
// </div>))}</div>
// </div>
// <div>
// <h3 className="font-medium mb-2">Add member</h3>
// <AddMemberForm onAdd={member=>onAddMember(team.id,member)} />
// <div className="mt-6"><h4 className="font-medium mb-2">CSV format</h4><p className="text-sm text-gray-500">Header row: name,email,role (optional id)</p><pre className="mt-2 p-2 bg-gray-50 text-xs rounded">name,email,role\nJohn Doe,john@example.com,Volunteer</pre></div>
// </div>
// </div>
// </section>);
// }


//==================================================================

'use client';
import React, { useEffect, useState } from 'react';
import AddMemberForm from './AddMemberForm';

export default function TeamPanel({ team, onClose, onUploadCSV, onAddMember, onSendWarnings }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    // reset selection when team changes
    setSelectedIds([]);
    setSelectAll(false);
    setStatusMessage(null);
  }, [team?.id]);

  if (!team) return <section className="text-center text-gray-500">Select a team to see details and manage members.</section>;

  const members = team.members || [];

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(members.map(m => m.id));
      setSelectAll(true);
    }
  };

  const handleSendSelected = async () => {
    if (!selectedIds.length) {
      setStatusMessage({ type: 'error', text: 'Please select at least one member.' });
      return;
    }

    // find selected members' emails
    const selectedMembers = members.filter(m => selectedIds.includes(m.id));
    const emails = selectedMembers.map(m => m.email).filter(Boolean);

    if (!emails.length) {
      setStatusMessage({ type: 'error', text: 'Selected members do not have valid emails.' });
      return;
    }

    // If parent provided handler, call it (teamId, emails array)
    if (typeof onSendWarnings === 'function') {
      setSending(true);
      setStatusMessage(null);
      try {
        await onSendWarnings(team.id, emails);
        setStatusMessage({ type: 'success', text: `Warning queued for ${emails.length} member(s).` });
        setSelectedIds([]);
        setSelectAll(false);
      } catch (err) {
        setStatusMessage({ type: 'error', text: err?.message || 'Failed to send warnings' });
      } finally {
        setSending(false);
      }
      return;
    }

    // Fallback: call API directly (POST /api/send-warning with emails)
    setSending(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/send-warning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails,
          subject: `Warning from ${team.name} Team`,
          message: `Dear team member,\n\nThis is an important warning from the ${team.name} team.\n\nRegards,\nHR`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        console.error('send-warning failed', data);
        setStatusMessage({ type: 'error', text: data.error || 'Server error while sending emails' });
      } else {
        // show summary if available
        if (typeof data.accepted === 'number' && typeof data.failed === 'number') {
          setStatusMessage({ type: data.failed === 0 ? 'success' : 'error', text: `Sent: ${data.accepted}, Failed: ${data.failed}` });
        } else {
          setStatusMessage({ type: 'success', text: `Warning queued for ${emails.length} member(s).` });
        }
        setSelectedIds([]);
        setSelectAll(false);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err?.message || 'Network error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{team.name}</h2>
          <p className="text-sm text-gray-500">{team.description}</p>
        </div>

        <div className="flex gap-2">
          <label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={e => onUploadCSV(team.id, e.target.files[0])} />
            <span className="text-sm">Upload CSV</span>
          </label>

          <button
            className="px-3 py-2 bg-green-600 text-white rounded"
            onClick={handleSendSelected}
            disabled={sending}
            title="Send warning emails to selected members"
          >
            {sending ? 'Sending...' : 'Warn Selected'}
          </button>

          <button className="px-3 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Members ({members.length})</h3>
            <label className="text-sm inline-flex items-center gap-2">
              <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              <span className="text-gray-500">Select All</span>
            </label>
          </div>

          <div className="space-y-2">
          
{members.map(m => (
  <div key={m.id} className="flex items-center justify-between p-3 border rounded">
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={selectedIds.includes(m.id)}
        onChange={() => toggleSelect(m.id)}
        className="cursor-pointer"
      />
      <div>
        <div className="font-medium">{m.name}</div>
        <div className="text-xs text-gray-500">{m.role} • {m.email}</div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        className="text-sm px-2 py-1 bg-yellow-100 rounded"
        onClick={async () => {
          setSelectedIds([m.id]);
          await handleSendSelected();
        }}
        disabled={sending}
      >
        Warn
      </button>

      <button
        className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded"
        onClick={async () => {
          // confirm and call parent to remove member
          if (!confirm(`Remove ${m.name} from ${team.name}? This cannot be undone.`)) return;
          try {
            // prefer parent handler
            if (typeof onRemoveMember === 'function') {
              await onRemoveMember(team.id, m.id);
            } else {
              // fallback: call API directly (DELETE)
              await fetch('/api/remove-member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: team.id, memberId: m.id }),
              });
            }
            // optimistic local UI handled by parent when it implements onRemoveMember
          } catch (err) {
            console.error('Remove member failed', err);
            alert('Failed to remove member');
          }
        }}
        disabled={sending}
        title="Remove member"
      >
        Remove
      </button>
    </div>
  </div>
))}

          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Add member</h3>
          <AddMemberForm onAdd={member => onAddMember(team.id, member)} />

          <div className="mt-6">
            <h4 className="font-medium mb-2">CSV format</h4>
            <p className="text-sm text-gray-500">Header row: name,email,role (optional id)</p>
            <pre className="mt-2 p-2 bg-gray-50 text-xs rounded">name,email,role{'\n'}John Doe,john@example.com,Volunteer</pre>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={`mt-4 p-3 rounded ${statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {statusMessage.text}
        </div>
      )}
    </section>
  );
}
