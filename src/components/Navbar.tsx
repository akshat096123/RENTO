import React from 'react';
import { User } from '../types';
import { Search, Sparkles, ShieldCheck, Truck, PlusCircle, ArrowLeftRight, Bell } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  activeTab: 'marketplace' | 'demand_feed' | 'dashboard' | 'owner_studio' | 'logistics_portal';
  setActiveTab: (tab: 'marketplace' | 'demand_feed' | 'dashboard' | 'owner_studio' | 'logistics_portal') => void;
  onOpenPostRequest: () => void;
  onOpenAddProduct: () => void;
  onOpenAIAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSwitchUser,
  activeTab,
  setActiveTab,
  onOpenPostRequest,
  onOpenAddProduct,
  onOpenAIAssistant
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-xl font-black text-slate-950 tracking-tighter">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">RENTO</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI Powered</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Don’t Buy. Request. Rent. Return.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'marketplace' ? 'bg-slate-800 text-white font-semibold shadow-inner' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('demand_feed')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'demand_feed' ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Demand Feed
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              Renter Hub
            </button>
            <button
              onClick={() => setActiveTab('owner_studio')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'owner_studio' ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              Owner Studio
            </button>
            <button
              onClick={() => setActiveTab('logistics_portal')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${activeTab === 'logistics_portal' ? 'bg-slate-800 text-indigo-400 font-semibold shadow-inner' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
            >
              <Truck className="w-3.5 h-3.5" />
              Porter Partner
            </button>
          </nav>

          {/* Action Buttons & Persona Switcher */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIAssistant}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Ask RENTO AI Assistant"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden lg:inline">RENTO AI</span>
            </button>

            {/* Post Request (Demand-First CTA) */}
            <button
              onClick={onOpenPostRequest}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Request</span>
            </button>

            {/* Persona / Role Quick Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1 leading-tight">
                    {currentUser.name.split(' ')[0]}
                    <span className="text-[10px] text-emerald-400 font-normal">({currentUser.role})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Switch Persona ▾</div>
                </div>
              </button>

              {/* Persona Dropdown */}
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 hidden group-hover:block transition-all z-50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800/80">
                  Switch Active Persona
                </div>
                <div className="mt-1 space-y-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => onSwitchUser(u)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition ${u.id === currentUser.id ? 'bg-slate-800 text-white font-medium' : 'text-slate-300 hover:bg-slate-800/60'}`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{u.role} • ⭐ {u.rating}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
