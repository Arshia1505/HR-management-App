// 'use client';
// import Sidebar from '@/components/Sidebar';
// import MemberTable from '@/components/MemberTable';
// import { useState } from 'react';

// const MOCK_MEMBERS = Array.from({ length: 10 }).map((_, i) => ({
//   id: i + 1,
//   name: ['Randy Rhiel Madsen', 'Maria Rosser', 'Cheyenne Bothman', 'Alfredo Curtis'][i % 4],
//   email: `user${i + 1}@email.com`,
//   empId: `A0${1000 + i}`,
//   title: ['UI Designer','UX Researcher','iOS Developer','Android Developer'][i % 4],
//   team: ['Design Team','Developer Team','Marketing Team'][i % 3],
//   joinDate: '11 Aug 2022',
//   status: ['Active','Inactive','Onboarding'][i % 3],
// }));

// export default function Dashboard() {
//   const [members] = useState(MOCK_MEMBERS);

//   const handleExport = () => {
//     const csv = ['Name,Employee ID,Job title,Department,Join date,Status', ...members.map(m => `${m.name},${m.empId},${m.title},${m.team},${m.joinDate},${m.status}`)].join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'members.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <MemberTable members={members} onExport={handleExport} />
//       </div>
//     </div>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MemberTable from '@/components/MemberTable';
import CsvUpload from '@/components/CsvUpload';

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');

  // Fetch members from API (replace with your DB API)
  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch('/api/get-members'); // create API route
      const data = await res.json();
      setMembers(data.members);
    }
    fetchMembers();
  }, []);

  // Filtered members
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesYear = yearFilter === 'all' || new Date(m.created_at).getFullYear() === +yearFilter;
    return matchesSearch && matchesYear;
  });

  const handleExport = async () => {
    const csv = [
      'Name,Employee ID,Job title,Department,Join date,Status',
      ...filteredMembers.map(m => `${m.name},${m.empId},${m.title},${m.team},${m.joinDate},${m.status}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name/email"
              className="border px-3 py-2 rounded"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border px-3 py-2 rounded"
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
            >
              <option value="all">All years</option>
              {Array.from(new Set(members.map(m => new Date(m.created_at).getFullYear()))).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button onClick={handleExport} className="px-4 py-2 border rounded">Export CSV</button>
          </div>
        </div>

        <CsvUpload />

        <MemberTable members={filteredMembers} onExport={handleExport} />
      </div>
    </div>
  );
}
