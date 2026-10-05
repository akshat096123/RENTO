import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Mail, Key, Sparkles, User as UserIcon } from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, users }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'renter' | 'owner' | 'both'>('both');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo accounts data matching the screenshot
  const demoAccounts = [
    {
      id: 'usr_aarav',
      letter: 'A',
      letterBg: 'bg-[#6366f1]',
      name: 'Aarav Sharma',
      role: 'Owner & Renter',
      email: 'aarav@rento.in'
    },
    {
      id: 'usr_priya',
      letter: 'P',
      letterBg: 'bg-[#fb7185]',
      name: 'Priya Mehta',
      role: 'Renter',
      email: 'priya@rento.in'
    },
    {
      id: 'usr_kiran',
      letter: 'K',
      letterBg: 'bg-[#10b981]',
      name: 'Kiran Patel',
      role: 'Owner',
      email: 'kiran@rento.in'
    }
  ];

  const handleSelectDemo = (demo: typeof demoAccounts[0]) => {
    // Look up in users list or fallback
    const found = users.find(u => u.email === demo.email || u.id === demo.id);
    if (found) {
      onLoginSuccess(found);
    } else {
      const fallbackUser: User = {
        id: demo.id,
        name: demo.name,
        email: demo.email,
        phone: '+91 98765 00000',
        role: demo.role.includes('&') ? 'both' : demo.role.toLowerCase() as any,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(demo.name)}&background=random`,
        city: 'Delhi NCR',
        rating: 4.9,
        total_rentals: 15,
        is_verified: 1,
        kyc_status: 'VERIFIED'
      };
      onLoginSuccess(fallbackUser);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your full name');
          setIsLoading(false);
          return;
        }
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, role })
        });
        const data = await res.json();
        if (data.user) {
          onLoginSuccess(data.user);
        } else {
          setError('Signup failed. Please try again.');
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.user) {
          onLoginSuccess(data.user);
        } else {
          setError('User not found. Try one of the demo accounts below.');
        }
      }
    } catch {
      setError('Connection error. Falling back to demo account.');
      handleSelectDemo(demoAccounts[0]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Subtle Background Glows matching website tones */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[430px] bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 text-slate-900 shadow-2xl space-y-6 my-auto">
        
        {/* Brand Logo Header matching Top Navbar */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center shadow-xs">
              <span className="text-white font-black text-xl tracking-tighter">R</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              RENTO
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isSignUp ? 'Sign up to start renting & lending gear across Delhi NCR' : 'Sign in to access your rentals, escrow & gear catalog'}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {isSignUp && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#ea580c] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#ea580c] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#ea580c] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
              />
              <Key className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
                PRIMARY ROLE
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#ea580c] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
              >
                <option value="both">Owner & Renter (Full Marketplace Access)</option>
                <option value="renter">Renter (Browse & Book Gear)</option>
                <option value="owner">Equipment Owner (List Gear & Earn)</option>
              </select>
            </div>
          )}

          {error && (
            <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* Signature Orange Brand CTA Button matching "+ Post Ad" */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>🔐</span>
            <span>{isLoading ? 'Authenticating...' : isSignUp ? 'Create Free Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="text-center text-xs text-slate-500 font-medium">
          {isSignUp ? (
            <span>Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-[#ea580c] font-bold hover:underline">Sign In</button></span>
          ) : (
            <span>New to RENTO? <button type="button" onClick={() => setIsSignUp(true)} className="text-[#ea580c] font-bold hover:underline">Create an account</button></span>
          )}
        </div>

        {/* Divider: or try a demo account */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10.5px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
            or 1-click test account
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* 3 Demo Accounts Matching Website Aesthetic */}
        <div className="space-y-2">
          {demoAccounts.map((demo) => (
            <div
              key={demo.id}
              onClick={() => handleSelectDemo(demo)}
              className="bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-orange-400 hover:shadow-md rounded-2xl p-3 flex items-center justify-between cursor-pointer transition transform hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${demo.letterBg} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0`}>
                  {demo.letter}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900 group-hover:text-[#ea580c] transition">
                    {demo.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {demo.role} • <span className="text-slate-400">{demo.email}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#ea580c] transition bg-white px-2 py-1 rounded-lg border border-slate-200/80 group-hover:border-orange-300">
                1-Click Login ➔
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[10.5px] font-semibold text-slate-400">
          <span className="text-emerald-600">🛡️</span>
          <span>100% RBI Escrow Protected • Porter Delivery Network</span>
        </div>

      </div>
    </div>
  );
};
