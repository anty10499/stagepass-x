import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { identifier, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      document.title = 'StagePass X — Login';
      if (data.role === 'ADMIN') navigate('/admin');
      else if (data.role === 'ORGANISER') navigate('/organiser');
      else navigate('/customer');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">StagePass X — Login</h1>
        <label className="block mb-2 text-sm">Username / Email / Mobile</label>
        <input
          className="w-full mb-4 p-2 rounded text-black"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded">
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          <a href="/register" className="text-indigo-300">Create account</a>
        </p>
      </form>
    </div>
  );
}
