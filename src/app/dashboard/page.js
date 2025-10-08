// 'use client';

// import React, { useState, useEffect } from 'react';

// /**
//  * HR Dashboard - Single-file Next.js React component (client)
//  * - Shows horizontal team cards with members preview and "more..."
//  * - Click a team card to open team view (members list, add member, CSV upload, send warning emails)
//  * - Supports creating new teams
//  *
//  * How to use:
//  * 1) Place this file in app/dashboard/page.jsx (or pages/dashboard/index.jsx) inside a Next.js app using the App Router or Pages Router.
//  * 2) Ensure Tailwind is configured for the project.
//  * 3) Implement server API endpoints for persistence (optional) or rely on client-side state (demo).
//  *
//  * Suggested API endpoints (not implemented here):
//  * POST /api/teams        -> create team
//  * POST /api/teams/:id/members -> add members
//  * POST /api/send-warning -> { teamId, memberIds, subject, body }
//  *
//  */

// function sampleTeams() {
//   return [
//     {
//       id: 'outreach',
//       name: 'Outreach',
//       description: 'Community & partnerships',
//       members: [
//         { id: 'o1', name: 'Priya Joshi', email: 'priya.j@example.com', role: 'Lead' },
//         { id: 'o2', name: 'Rahul Verma', email: 'rahul.v@example.com', role: 'Member' },
//       ],
//     },
//     {
//       id: 'events',
//       name: 'Events',
//       description: 'On-campus events & logistics',
//       members: [
//         { id: 'e1', name: 'Asha Patel', email: 'asha.p@example.com', role: 'Coordinator' },
//         { id: 'e2', name: 'Vikram Singh', email: 'vikram.s@example.com', role: 'Volunteer' },
//       ],
//     },
//     {
//       id: 'technical',
//       name: 'Technical',
//       description: 'Dev & infra',
//       members: [
//         { id: 't1', name: 'Arshia Sharma', email: 'arshia15854@gmail.com', role: 'Frontend' },
//         { id: 't2', name: 'Geojane', email: 'geojane@example.com', role: 'Mentor' },
//       ],
//     },
//   ];
// }

// // small CSV parser (expects header row: name,email,role,id?)
// function parseCSV(text) {
//   const lines = text.split(/\r?\n/).filter(Boolean);
//   if (lines.length === 0) return [];
//   const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
//   const rows = lines.slice(1).map(line => {
//     const cols = line.split(',').map(c => c.trim());
//     const obj = {};
//     headers.forEach((h, i) => (obj[h] = cols[i] ?? ''));
//     // ensure id and name & email
//     return {
//       id: obj.id || `${(Math.random() + 1).toString(36).substring(7)}`,
//       name: obj.name || obj.fullname || '',
//       email: obj.email || '',
//       role: obj.role || '',
//     };
//   });
//   return rows;
// }

// export default function DashboardPage() {
//   const [teams, setTeams] = useState(() => sampleTeams());
//   const [activeTeamId, setActiveTeamId] = useState(null);
//   const [showAddTeam, setShowAddTeam] = useState(false);
//   const [newTeamName, setNewTeamName] = useState('');
//   const [newTeamDesc, setNewTeamDesc] = useState('');
//   const [csvProcessing, setCsvProcessing] = useState(false);
//   const [alert, setAlert] = useState(null);

//   useEffect(() => {
//     if (alert) {
//       const t = setTimeout(() => setAlert(null), 4000);
//       return () => clearTimeout(t);
//     }
//   }, [alert]);

//   function openTeam(teamId) {
//     setActiveTeamId(teamId);
//   }

//   function closeTeam() {
//     setActiveTeamId(null);
//   }

//   function addTeam() {
//     if (!newTeamName.trim()) return setAlert({ type: 'error', message: 'Team name required' });
//     const id = newTeamName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
//     const newTeam = { id, name: newTeamName.trim(), description: newTeamDesc, members: [] };
//     setTeams(prev => [...prev, newTeam]);
//     setNewTeamName('');
//     setNewTeamDesc('');
//     setShowAddTeam(false);
//     setAlert({ type: 'success', message: `Team "${newTeam.name}" created` });
//     // TODO: call POST /api/teams
//   }

//   function addMemberToTeam(teamId, member) {
//     setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, members: [...t.members, member] } : t)));
//     setAlert({ type: 'success', message: `Added ${member.name} to team` });
//     // TODO: call POST /api/teams/:id/members
//   }

//   function uploadCSV(teamId, file) {
//     if (!file) return;
//     setCsvProcessing(true);
//     const reader = new FileReader();
//     reader.onload = e => {
//       try {
//         const text = e.target.result;
//         const parsed = parseCSV(text);
//         if (parsed.length === 0) throw new Error('No valid rows found');
//         setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, members: [...t.members, ...parsed] } : t)));
//         setAlert({ type: 'success', message: `${parsed.length} members added` });
//         // TODO: POST parsed to backend
//       } catch (err) {
//         setAlert({ type: 'error', message: `CSV parse error: ${err.message}` });
//       } finally {
//         setCsvProcessing(false);
//       }
//     };
//     reader.readAsText(file);
//   }

//   async function sendWarningEmails(teamId) {
//     const team = teams.find(t => t.id === teamId);
//     if (!team || team.members.length === 0) return setAlert({ type: 'error', message: 'No members to email' });
//     const confirmed = confirm(`Send warning email to ${team.members.length} members of ${team.name}?`);
//     if (!confirmed) return;

//     // Example payload; replace with real API. This demo simulates success.
//     try {
//       // TODO: Replace fetch URL with your server endpoint
//       // const res = await fetch('/api/send-warning', { method: 'POST', body: JSON.stringify({ teamId }) });
//       // handle response
//       await new Promise(r => setTimeout(r, 800)); // simulate network
//       setAlert({ type: 'success', message: `Warning emails queued for team ${team.name}` });
//     } catch (err) {
//       setAlert({ type: 'error', message: 'Failed to send emails' });
//     }
//   }

//   const activeTeam = teams.find(t => t.id === activeTeamId);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <header className="mb-6 flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">HR Dashboard</h1>
//         <div className="flex gap-2">
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:opacity-90"
//             onClick={() => setShowAddTeam(true)}
//           >
//             + New Team
//           </button>
//         </div>
//       </header>

//       {alert && (
//         <div className={`mb-4 p-3 rounded ${alert.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//           {alert.message}
//         </div>
//       )}

//       {/* Horizontal cards */}
//       <section className="mb-8">
//         <div className="flex space-x-4 overflow-x-auto py-2">
//           {teams.map(team => (
//             <div key={team.id} className="min-w-[260px] bg-white rounded-lg shadow p-4 flex-shrink-0">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-lg font-medium">{team.name}</h2>
//                   <p className="text-sm text-gray-500">{team.description}</p>
//                 </div>
//                 <div className="text-sm text-gray-400">{team.members.length}</div>
//               </div>

//               <ul className="mt-3 space-y-1 text-sm">
//                 {team.members.slice(0, 3).map(m => (
//                   <li key={m.id} className="flex items-center justify-between">
//                     <div>
//                       <div className="font-medium">{m.name}</div>
//                       <div className="text-xs text-gray-500">{m.role} • {m.email}</div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>

//               <div className="mt-3 flex items-center justify-between">
//                 <button className="text-sm text-blue-600" onClick={() => openTeam(team.id)}>
//                   More...
//                 </button>
//                 <button className="text-sm px-2 py-1 bg-yellow-100 rounded" onClick={() => sendWarningEmails(team.id)}>
//                   Send Warnings
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Active team panel */}
//       {activeTeam ? (
//         <section className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-xl font-semibold">{activeTeam.name}</h2>
//               <p className="text-sm text-gray-500">{activeTeam.description}</p>
//             </div>
//             <div className="flex gap-2">
//               <label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded cursor-pointer">
//                 <input
//                   type="file"
//                   accept=".csv"
//                   className="hidden"
//                   onChange={e => uploadCSV(activeTeam.id, e.target.files[0])}
//                 />
//                 <span className="text-sm">Upload CSV</span>
//               </label>

//               <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => sendWarningEmails(activeTeam.id)}>
//                 Send Warning Emails
//               </button>

//               <button className="px-3 py-2 bg-gray-200 rounded" onClick={closeTeam}>
//                 Close
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <h3 className="font-medium mb-2">Members ({activeTeam.members.length})</h3>
//               <div className="space-y-2">
//                 {activeTeam.members.map(m => (
//                   <div key={m.id} className="flex items-center justify-between p-3 border rounded">
//                     <div>
//                       <div className="font-medium">{m.name}</div>
//                       <div className="text-xs text-gray-500">{m.role} • {m.email}</div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         className="text-sm px-2 py-1 bg-yellow-100 rounded"
//                         onClick={() => alert(`(Demo) Would send warning to ${m.email}`)}
//                       >
//                         Warn
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-medium mb-2">Add member</h3>
//               <AddMemberForm
//                 onAdd={member => {
//                   addMemberToTeam(activeTeam.id, member);
//                 }}
//               />

//               <div className="mt-6">
//                 <h4 className="font-medium mb-2">CSV format</h4>
//                 <p className="text-sm text-gray-500">Header row: name,email,role (optional id)</p>
//                 <pre className="mt-2 p-2 bg-gray-50 text-xs rounded">name,email,role\nJohn Doe,john@example.com,Volunteer</pre>
//               </div>
//             </div>
//           </div>
//         </section>
//       ) : (
//         <section className="text-center text-gray-500">Select a team to see details and manage members.</section>
//       )}

//       {/* Add Team Modal */}
//       {showAddTeam && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//           <div className="bg-white rounded p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-3">Create New Team</h3>
//             <div className="space-y-3">
//               <input
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="Team name"
//                 value={newTeamName}
//                 onChange={e => setNewTeamName(e.target.value)}
//               />
//               <input
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="Short description"
//                 value={newTeamDesc}
//                 onChange={e => setNewTeamDesc(e.target.value)}
//               />
//               <div className="flex justify-end gap-2">
//                 <button className="px-4 py-2" onClick={() => setShowAddTeam(false)}>Cancel</button>
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={addTeam}>Create</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function AddMemberForm({ onAdd }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('');

//   function submit(e) {
//     e.preventDefault();
//     if (!name.trim() || !email.trim()) return alert('Name and email required');
//     const member = { id: `${(Math.random() + 1).toString(36).substring(7)}`, name: name.trim(), email: email.trim(), role: role.trim() };
//     onAdd(member);
//     setName('');
//     setEmail('');
//     setRole('');
//   }

//   return (
//     <form onSubmit={submit} className="space-y-3 bg-gray-50 p-4 rounded">
//       <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
//       <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//       <input className="w-full border rounded px-3 py-2" placeholder="Role (optional)" value={role} onChange={e => setRole(e.target.value)} />
//       <div className="flex justify-end">
//         <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Member</button>
//       </div>
//     </form>
//   );
// }


'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TeamCard from './components/TeamCard';
import TeamPanel from './components/TeamPanel';
import NewTeamModal from './components/NewTeamModal';
import { sampleTeams, parseCSV } from './components/utils';

export default function DashboardPage() {
  const [teams, setTeams] = useState(() => sampleTeams());
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [alert, setAlert] = useState(null);

  const activeTeam = teams.find((t) => t.id === activeTeamId);

  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  function openTeam(id) { setActiveTeamId(id); }
  function closeTeam() { setActiveTeamId(null); }

  function addTeam() {
    if (!newTeamName.trim())
      return setAlert({ type: 'error', message: 'Team name required' });
    const id = newTeamName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newTeam = { id, name: newTeamName.trim(), description: newTeamDesc, members: [] };
    setTeams((prev) => [...prev, newTeam]);
    setNewTeamName('');
    setNewTeamDesc('');
    setShowAddTeam(false);
    setAlert({ type: 'success', message: `Team "${newTeam.name}" created` });
  }

  function addMemberToTeam(teamId, member) {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, members: [...t.members, member] } : t))
    );
    setAlert({ type: 'success', message: `Added ${member.name} to team` });
  }

  function uploadCSV(teamId, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        if (!parsed.length) throw new Error('No valid rows found');
        setTeams((prev) =>
          prev.map((t) => (t.id === teamId ? { ...t, members: [...t.members, ...parsed] } : t))
        );
        setAlert({ type: 'success', message: `${parsed.length} members added` });
      } catch (err) {
        setAlert({ type: 'error', message: `CSV parse error: ${err.message}` });
      }
    };
    reader.readAsText(file);
  }

async function sendWarningEmails(teamId) {
  const team = teams.find(t => t.id === teamId);
  if (!team || !team.members.length) return setAlert({ type: 'error', message: 'No members to email' });
  if (!confirm(`Send warning email to ${team.members.length} members of ${team.name}?`)) return;

  try {
    const res = await fetch('/api/send-warning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emails: team.members.map(m => m.email),
        subject: `Warning from ${team.name} Team`,
        message: `Dear team member, this is an important warning from the ${team.name} team.`,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      setAlert({ type: 'error', message: `Email API error: ${data.error || 'unknown'}` });
      console.error('send-warning error:', data);
      return;
    }

    const { accepted, failed, results } = data;
    // show summary
    setAlert({ type: failed === 0 ? 'success' : 'error', message: `Emails: ${accepted} sent, ${failed} failed` });

    // optionally log details to console and show first few errors in UI
    const failedDetails = results.filter(r => !r.success).slice(0, 5);
    if (failedDetails.length) {
      console.error('Failed recipients:', failedDetails);
      // You could show a modal or expanded UI with the failedDetails
    }

  } catch (err) {
    console.error('Network/send error:', err);
    setAlert({ type: 'error', message: `Network error: ${err.message}` });
  }
}



  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">HR Dashboard</h1>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:opacity-90"
            onClick={() => setShowAddTeam(true)}
          >
            + New Team
          </button>
        </div>

        {/* Alert */}
        {alert && (
          <div
            className={`mb-4 p-3 rounded ${
              alert.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Teams Cards */}
        <div className="flex space-x-4 overflow-x-auto py-2 mb-8">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onOpen={openTeam}
              onSendWarnings={sendWarningEmails}
            />
          ))}
        </div>

        {/* Active Team Panel */}
        <TeamPanel
          team={activeTeam}
          onClose={closeTeam}
          onUploadCSV={uploadCSV}
          onAddMember={addMemberToTeam}
          onSendWarnings={sendWarningEmails}
        />

        {/* New Team Modal */}
        <NewTeamModal
          show={showAddTeam}
          onClose={() => setShowAddTeam(false)}
          onCreate={addTeam}
          name={newTeamName}
          setName={setNewTeamName}
          desc={newTeamDesc}
          setDesc={setNewTeamDesc}
        />
      </div>
    </div>
  );
}
