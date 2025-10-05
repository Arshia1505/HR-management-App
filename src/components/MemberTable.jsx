// components/MemberTable.jsx
'use client';

export default function MemberTable({ members = [], onExport }) {
  return (
    <div className="p-6 bg-white rounded-md shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <h2 className="text-lg font-semibold">Employee</h2>
        <div className="flex gap-2">
          <button onClick={onExport} className="px-3 py-2 border rounded hover:bg-gray-100 transition">
            Export CSV
          </button>
          <a href="/add" className="px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
            Add New
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['1,384', '839', '531', '531'].map((num, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded text-center">
              {num}
              <div className={`text-sm ${idx % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>+{idx * 10}</div>
            </div>
          ))}
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                {['Name', 'Employee ID', 'Job title', 'Department', 'Join date', 'Status'].map((h, i) => (
                  <th key={i} className="px-3 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-3 py-3">
                    {m.name}
                    <div className="text-xs text-gray-400">{m.email}</div>
                  </td>
                  <td className="px-3 py-3">{m.empId}</td>
                  <td className="px-3 py-3">{m.title}</td>
                  <td className="px-3 py-3">{m.team}</td>
                  <td className="px-3 py-3">{m.joinDate}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      m.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : m.status === 'Onboarding'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-xs text-gray-500 gap-2">
          <div>Showing 10 records</div>
          <div className="space-x-2">
            <button className="px-2 py-1 border rounded">&lt;</button>
            <button className="px-2 py-1 border rounded">1</button>
            <button className="px-2 py-1 border rounded">2</button>
            <button className="px-2 py-1 border rounded">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
