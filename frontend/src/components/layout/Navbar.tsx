import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Search, UserCheck, LogOut, Menu, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-500 fill-orange-500/20" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Donation<span className="text-orange-500">.app</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-orange-400 uppercase">
                Ganesh Chaturthi & Dasara Portal
              </span>
            </div>
          </Link>

          {/* Public Desktop Navigation Links (Zero Login Required) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link to="/ganesh" className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition">
              <span>🕉️ Ganesh Chaturthi</span>
            </Link>

            <Link to="/dasara" className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition">
              <span>🏹 Dasara</span>
            </Link>

            <Link to="/transparency" className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transparency</span>
            </Link>

            <Link to="/community" className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Community</span>
            </Link>

            <Link to="/verify" className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Verify Receipt</span>
            </Link>
          </div>

          {/* Committee Organizer Portal Links */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-800 border border-slate-700 text-slate-200 hover:border-orange-500/50 hover:text-white transition"
                >
                  <UserCheck className="w-4 h-4 text-orange-400" />
                  <span>Admin Dashboard ({user.role})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/60 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Organizer Admin</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/ganesh"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-orange-400 bg-orange-500/10"
          >
            🕉️ Ganesh Chaturthi
          </Link>
          <Link
            to="/dasara"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-400 bg-amber-500/10"
          >
            🏹 Dasara
          </Link>
          <Link
            to="/transparency"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Transparency
          </Link>
          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Community
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Verify Receipt
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-3 rounded-xl bg-slate-800 font-bold text-slate-300 text-xs border border-slate-700"
          >
            Organizer Admin Portal (/admin)
          </Link>
        </div>
      )}
    </nav>
  );
};
