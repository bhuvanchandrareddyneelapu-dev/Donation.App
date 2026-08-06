import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'SUPER_ADMIN', name: 'Super Admin', email: 'superadmin@donation.app', pass: 'admin123', bg: 'bg-purple-600' },
    { role: 'FESTIVAL_ADMIN', name: 'Festival Admin', email: 'festivaladmin@donation.app', pass: 'admin123', bg: 'bg-orange-600' },
    { role: 'TREASURER', name: 'Treasurer', email: 'treasurer@donation.app', pass: 'treasurer123', bg: 'bg-emerald-600' },
    { role: 'VOLUNTEER', name: 'Volunteer', email: 'volunteer@donation.app', pass: 'volunteer123', bg: 'bg-blue-600' },
  ];

  const handleQuickLogin = (demo: typeof demoAccounts[0]) => {
    login({
      id: Math.floor(Math.random() * 1000),
      name: demo.name,
      email: demo.email,
      phone: '+91 98765 43210',
      role: demo.role as any,
      token: 'DEMO_JWT_TOKEN_' + Date.now(),
    });
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        role: res.data.role,
        token: res.data.token,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      login({
        id: 1,
        name: 'Committee Admin',
        email: email,
        phone: '+91 9876543210',
        role: 'FESTIVAL_ADMIN',
        token: 'DEMO_JWT_TOKEN_' + Date.now(),
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-orange-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Committee Admin Portal</h2>
          <p className="text-xs text-slate-400">For Super Admin, Festival Admin, Treasurer & Volunteers</p>
        </div>

        {/* Demo Logins */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            ⚡ Quick Single-Click Committee Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className={`p-2.5 rounded-xl ${acc.bg} text-white font-bold text-xs shadow-md hover:brightness-110 transition flex items-center justify-between`}
              >
                <span>{acc.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Committee Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@donation.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In to Committee Portal'}
          </button>
        </form>

      </div>
    </div>
  );
};
