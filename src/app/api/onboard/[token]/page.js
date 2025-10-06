'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function OnboardPage() {
  const { token } = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [answers, setAnswers] = useState({ preferredName: '', team: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      const res = await fetch(`/api/verify-token?token=${token}`);
      if (!res.ok) {
        alert('Invalid or expired link');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setMember(data.member);
      setLoading(false);
    }
    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, answers })
    });
    if (res.ok) {
      alert('Onboarding complete — thank you!');
      router.push('/');
    } else {
      alert('Failed to submit onboarding — try again.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!member) return <div className="p-6">Invalid link.</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome {member.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Preferred name"
          value={answers.preferredName}
          onChange={e => setAnswers(prev => ({ ...prev, preferredName: e.target.value }))}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="Team (if different)"
          value={answers.team}
          onChange={e => setAnswers(prev => ({ ...prev, team: e.target.value }))}
          className="w-full p-3 border rounded"
        />
        <button className="px-4 py-2 bg-black text-white rounded">Submit</button>
      </form>
    </div>
  );
}
