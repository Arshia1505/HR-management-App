// components/Header.jsx
'use client';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6 bg-white shadow-sm sticky top-0 z-50">
      <div className="text-xl font-semibold text-purple-700">Sprout</div>
      <nav className="space-x-6 hidden md:flex text-gray-700">
        <a href="/" className="text-sm hover:text-purple-700 transition">Home</a>
        <a href="/dashboard" className="text-sm hover:text-purple-700 transition">Dashboard</a>
        <a href="/add" className="text-sm hover:text-purple-700 transition">Add Member</a>
      </nav>
      <div className="hidden md:block">
        <button className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition">Login</button>
      </div>
    </header>
  );
}
