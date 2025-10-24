import { useEffect, useState } from 'react';
import api from '../api/client';

export default function CustomerDashboard() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [ev, bk] = await Promise.all([
      api.get('/events'),
      api.get('/bookings/customer/me'),
    ]);
    setEvents(ev.data);
    setBookings(bk.data);
    setLoading(false);
    document.title = 'StagePass X — Customer Dashboard';
  };

  useEffect(() => { load(); }, []);

  const book = async (eventId) => {
    if (!window.confirm('Confirm booking for this event?')) return;
    await api.post('/bookings', { eventId, quantity: 1 });
    await load();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <button onClick={() => { localStorage.clear(); window.location = '/login'; }}>Logout</button>
      </header>
      {loading && <p>Loading events...</p>}
      <h2 className="text-lg mb-2">All Events</h2>
      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">Event</th><th>Date</th><th>Time</th><th>Venue</th><th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-b border-gray-700">
              <td className="p-2">{e.eventName}</td>
              <td>{e.eventDate}</td>
              <td>{e.eventTime}</td>
              <td>{e.venue}</td>
              <td>
                {e.totalTicketsAvailable === 0 ? (
                  <span className="text-red-400">Sold Out</span>
                ) : (
                  <button className="bg-indigo-600 px-3 py-1 rounded" onClick={() => book(e.id)}>Book</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-lg mb-2">My Bookings</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id} className="mb-2">
            {b.eventName} — <span className={
              b.status === 'CONFIRMED' ? 'text-green-400' : b.status === 'CANCELLED' ? 'text-red-400' : 'text-amber-400'
            }>{b.status}</span> — Ref: {b.bookingReference}
          </li>
        ))}
      </ul>
    </div>
  );
}
