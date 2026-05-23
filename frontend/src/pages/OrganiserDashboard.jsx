import { useEffect, useState } from 'react';
import api from '../api/client';

const CATEGORIES = ['MUSIC', 'SPORTS', 'CONFERENCE', 'ARTS', 'FOOD', 'COMEDY', 'OTHER'];

export default function OrganiserDashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ eventName: '', category: '', venueId: '', eventDate: '', totalTickets: '' });

  const load = async () => {
    const { data } = await api.get('/events/organiser/me');
    setEvents(data);
    document.title = 'StagePass X — Organiser Dashboard';
  };

  useEffect(() => { load(); }, []);

  const addEvent = async (e) => {
    e.preventDefault();
    await api.post('/events', form);
    setForm({ eventName: '', category: '', venueId: '', eventDate: '', totalTickets: '' });
    await load();
    alert('Event created successfully');
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    await load();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Organiser Dashboard</h1>
      <form onSubmit={addEvent} className="mb-8 p-4 bg-gray-800 rounded grid gap-2 max-w-xl">
        <h2 className="font-semibold">+ Add Event</h2>
        <input placeholder="Event name" className="p-2 text-black rounded" value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} required />
        <select className="p-2 text-black rounded" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
          <option value="">Category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="date" className="p-2 text-black rounded" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required />
        <button type="submit" className="bg-indigo-600 py-2 rounded">Save Event</button>
      </form>
      <table className="w-full">
        <thead><tr><th className="text-left p-2">Name</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id} className="border-t border-gray-700">
              <td className="p-2">{ev.eventName}</td>
              <td>{ev.status}</td>
              <td><button className="text-red-400" onClick={() => remove(ev.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
