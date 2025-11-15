import { useEffect, useState } from 'react';
import api from '../api/client';

const TABS = ['Users', 'Venues', 'Bookings', 'Ticket Types', 'Orders', 'Events'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.title = 'StagePass X — Admin Dashboard';
  }, [dark]);

  useEffect(() => {
    if (tab === 'Users') {
      api.get('/admin/users').then((r) => setUsers(r.data));
    }
  }, [tab]);

  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`p-6 min-h-screen ${dark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="flex flex-wrap gap-2 justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => setDark(!dark)}>Dark Mode</button>
          <button onClick={() => { localStorage.clear(); window.location = '/login'; }}>Logout</button>
        </div>
      </header>
      <nav className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button key={t} className={`px-3 py-1 rounded ${tab === t ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>
      {tab === 'Users' && (
        <>
          <input
            placeholder="Search by username"
            className="mb-4 p-2 border rounded w-full max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <table className="w-full border">
            <thead>
              <tr><th className="p-2 text-left">Username</th><th>Role</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.username}</td>
                  <td>{u.role}</td>
                  <td className="text-green-600">{u.status || 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {tab !== 'Users' && <p className="text-sm opacity-70">Tab content loaded via API — connect endpoints in integration.</p>}
    </div>
  );
}
