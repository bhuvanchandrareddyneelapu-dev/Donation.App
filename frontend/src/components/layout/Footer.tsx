import React from 'react';
import { Heart, ShieldCheck, Phone, Mail, MapPin, Award, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Donation.app</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's premier digital donation, festival management, and financial transparency platform. Empowering Ganesh Mandals, Temples, NGOs, and Community Trusts with 100% verifiable audits.
            </p>
            <div className="flex items-center space-x-3 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verifiable Public Audits</span>
            </div>
          </div>

          {/* Col 2: Festivals & Causes */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Supported Causes</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/festivals" className="hover:text-orange-400 transition">Ganesh Chaturthi Mahotsav</a></li>
              <li><a href="/festivals" className="hover:text-orange-400 transition">Navaratri & Durga Puja</a></li>
              <li><a href="/festivals" className="hover:text-orange-400 transition">Temple Annadanam Trusts</a></li>
              <li><a href="/festivals" className="hover:text-orange-400 transition">Medical Emergency Fundraisers</a></li>
              <li><a href="/festivals" className="hover:text-orange-400 transition">Orphanages & Educational Relief</a></li>
            </ul>
          </div>

          {/* Col 3: Features */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/photos" className="hover:text-orange-400 transition">Festival Photo Gallery</a></li>
              <li><a href="/transparency" className="hover:text-orange-400 transition">Live Expense Breakdown</a></li>
              <li><a href="/verify" className="hover:text-orange-400 transition">QR Code Receipt Verification</a></li>
              <li><a href="/community" className="hover:text-orange-400 transition">Community & Live Feeds</a></li>
              <li><a href="/donor/history" className="hover:text-orange-400 transition">Donor History & Receipts</a></li>
            </ul>
          </div>

          {/* Col 4: Security & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Trust & Security</h4>
            <div className="flex items-center space-x-3 text-sm text-slate-300">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>256-Bit Bank Level Encryption</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Registered 80G & 12A Compliant</span>
            </div>
            <div className="pt-2 text-xs text-slate-500">
              <p>Razorpay & UPI Instant Settlement Gateway Integration Supported</p>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Donation.app Enterprise Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
