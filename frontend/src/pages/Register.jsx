import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Register() {
  const [form, setForm] = useState({
    username: '', firstName: '', lastName: '', phone: '', role: '', email: '', password: '',
  });
  const [roleError, setRoleError] = useState('');
  const navigate = useNavigate();

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) {
      setRoleError('Please select a role.');
      return;
    }
    setRoleError('');
    await api.post('/auth/register', {
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      role: form.role,
      email: form.email,
      password: form.password,
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        {['username', 'firstName', 'lastName', 'phone', 'email', 'password'].map((field) => (
          <div key={field} className="mb-3">
            <label className="text-sm capitalize">{field}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              className="w-full p-2 rounded text-black"
              value={form[field]}
              onChange={(e) => update(field, e.target.value)}
              required
            />
          </div>
        ))}
        <label className="text-sm">Role</label>
        <select
          className="w-full p-2 rounded text-black mb-2"
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
        >
          <option value="">Select role</option>
          <option value="CUSTOMER">Customer</option>
          <option value="ORGANISER">Organiser</option>
        </select>
        {roleError && <p className="text-red-400 text-sm mb-2">{roleError}</p>}
        <button type="submit" className="w-full bg-indigo-600 py-2 rounded mt-2">Register</button>
      </form>
    </div>
  );
}
