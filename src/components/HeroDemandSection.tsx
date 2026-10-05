import React, { useState } from 'react';
import { Search, Sparkles, PlusCircle, ShieldCheck, Truck, Cpu, Award } from 'lucide-react';

interface HeroDemandSectionProps {
  onSearch: (query: string) => void;
  onPostRequestWithPrompt: (prompt: string) => void;
}

export const HeroDemandSection: React.FC<HeroDemandSectionProps> = ({
  onSearch,
  onPostRequestWithPrompt
}) => {
  const [searchPrompt, setSearchPrompt] = useState('');

  const quickPrompts = [
    'Camera for college fest 3 days under ₹2,000/day',
    'High-lumen projector for 100 people outdoor event',
    'DJI 4K Drone with extra batteries for wedding shoot',
    'MacBook Pro M3 Max for 4K video editing'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPrompt.trim()) {
      onSearch(searchPrompt);
    }
  };

  const handlePostRequestClick = () => {
    onPostRequestWithPrompt(searchPrompt);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
      {/* Background glow circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Demand First Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Demand-First Rental Marketplace • Demand Creates Supply</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Don’t Buy. <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Request. Rent. Return.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Traditional rental platforms say <span className="text-rose-400 font-medium">“No results found”</span> when an item isn't listed. 
          RENTO says <span className="text-emerald-400 font-semibold">“Tell us what you need”</span>—our AI converts your requirement into structured demand and notifies verified suppliers near you.
        </p>

        {/* Natural Language Search & Request Input */}
        <div className="mt-8 max-w-3xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl backdrop-blur-xl">
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="What do you need? (e.g., Camera for college event for 3 days under ₹2,000/day)"
                className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handlePostRequestClick}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Request</span>
              </button>
            </div>
          </form>

          {/* Quick presets */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-400">Try asking:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchPrompt(prompt);
                  onSearch(prompt);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Pillars Trust Stack */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Escrow Buffer</div>
            <p className="text-[11px] text-slate-400 mt-1">Payment is protected until you verify product handover with OTP.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Porter Delivery</div>
            <p className="text-[11px] text-slate-400 mt-1">Integrated 3rd-party logistics handles pickup, transit & live tracking.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">AI Inspection</div>
            <p className="text-[11px] text-slate-400 mt-1">Computer vision scores condition before dispatch & after return.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Verified Gear</div>
            <p className="text-[11px] text-slate-400 mt-1">Serial numbers & authenticity screened to prevent counterfeits.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
