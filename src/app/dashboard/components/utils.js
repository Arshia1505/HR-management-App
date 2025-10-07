export function sampleTeams() {
  return [
    {
      id: 'outreach',
      name: 'Outreach',
      description: 'Community & partnerships',
      members: [
        { id: 'o1', name: 'Priya Joshi', email: 'priya.j@example.com', role: 'Lead' },
        { id: 'o2', name: 'Rahul Verma', email: 'rahul.v@example.com', role: 'Member' },
      ],
    },
    {
      id: 'events',
      name: 'Events',
      description: 'On-campus events & logistics',
      members: [
        { id: 'e1', name: 'Asha Patel', email: 'asha.p@example.com', role: 'Coordinator' },
        { id: 'e2', name: 'Vikram Singh', email: 'vikram.s@example.com', role: 'Volunteer' },
      ],
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Dev & infra',
      members: [
        { id: 't1', name: 'Arshia Sharma', email: 'arshia15854@gmail.com', role: 'Frontend' },
        { id: 't2', name: 'Geojane', email: 'geojane@example.com', role: 'Mentor' },
      ],
    },
  ];
}

// small CSV parser (expects header row: name,email,role,id?)
export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => (obj[h] = cols[i] ?? ''));
    // ensure id and name & email
    return {
      id: obj.id || `${(Math.random() + 1).toString(36).substring(7)}`,
      name: obj.name || obj.fullname || '',
      email: obj.email || '',
      role: obj.role || '',
    };
  });
  return rows;
}