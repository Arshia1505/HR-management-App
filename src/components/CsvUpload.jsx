// src/components/CsvUpload.jsx
'use client';
import Papa from 'papaparse';

export default function CsvUpload() {
  const handleFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await fetch('/api/bulk-add-members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: results.data }),
        });
        alert('Upload complete');
      },
      error: (err) => console.error(err)
    });
  };

  return (
    <div className="p-4">
      <input type="file" accept=".csv" onChange={(e) => handleFile(e.target.files[0])} className="border p-2" />
    </div>
  );
}
