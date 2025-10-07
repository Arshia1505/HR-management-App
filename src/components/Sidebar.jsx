'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen border-r hidden md:flex flex-col justify-between sticky top-0">
      <div>
        <div className="p-6 text-xl font-semibold border-b">Coding Ninjas</div>
        <ul className="p-4 space-y-2 text-sm">
          {['Home', 'Teams', 'Hiring', 'Finance'].map((item, idx) => (
            <li
              key={idx}
              className={`p-2 rounded cursor-pointer ${
                item === 'Employee' ? 'bg-gray-50 font-medium' : 'hover:bg-gray-100'
              }`}
            >
              {item === 'Home' ? (
                <Link href="/" className="block w-full h-full">
                  {item}
                </Link>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 text-xs text-gray-500">Help and support</div>
    </aside>
  );
}
