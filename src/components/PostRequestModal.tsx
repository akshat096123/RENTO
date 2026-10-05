import React, { useState, useEffect } from 'react';
import { User, RentalRequest } from '../types';
import { parseRequirementAI, createRequest } from '../api';
import { X, Sparkles, Send, CheckCircle2, AlertCircle, Calendar, MapPin, IndianRupee } from 'lucide-react';

interface PostRequestModalProps {
  currentUser: User;
  initialPrompt?: string;
  onClose: () => void;
  onRequestCreated: (request: RentalRequest) => void;
}

export const PostRequestModal: React.FC<PostRequestModalProps> = ({
  currentUser,
  initialPrompt = '',
  onClose,
  onRequestCreated
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiStructured, setAiStructured] = useState<any>(null);

  // Editable structured fields
  const [category, setCategory] = useState('Cameras');
  const [budgetDaily, setBudgetDaily] = useState(1800);
  const [durationDays, setDurationDays] = useState(3);
  const [location, setLocation] = useState('Delhi NCR, India');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-15');

  // Trigger AI parsing automatically when modal opens if prompt exists
  useEffect(() => {
    if (initialPrompt.trim()) {
      handleAnalyze(initialPrompt);
    }
  }, [initialPrompt]);

  const handleAnalyze = async (textToParse: string) => {
    if (!textToParse.trim()) return;
    setIsAnalyzing(true);
    try {
      const parsed = await parseRequirementAI(textToParse);
      setAiStructured(parsed);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.budgetDaily) setBudgetDaily(parsed.budgetDaily);
      if (parsed.durationDays) setDurationDays(parsed.durationDays);
    } catch (err) {
      console.error('AI parse error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await createRequest({
        renter_id: currentUser.id,
        raw_prompt: prompt,
        category,
        budget_daily: budgetDaily,
        duration_days: durationDays,
        location,
        start_date: startDate,
        end_date: endDate
      });
      onRequestCreated(res.request);
      onClose();
    } catch (err: any) {
      alert('Error creating request: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Post a Custom Rental Request
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Demand Creates Supply</span>
              </h3>
              <p className="text-xs text-slate-400">Describe what you need in natural language. AI will structure and dispatch it.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Natural Language Prompt Area */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Describe What You Need (Natural Language)
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., I need a high-power projector with extra cables for a 100-person outdoor movie night for 2 days under ₹1,800/day."
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => handleAnalyze(prompt)}
                disabled={isAnalyzing || !prompt.trim()}
                className="absolute right-3 bottom-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700 disabled:opacity-50 transition"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Parse with AI'}</span>
              </button>
            </div>
          </div>

          {/* AI Structuring Feedback Card */}
          {aiStructured && (
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Requirement Understanding Engine Breakdown:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>• Identified Intent: <strong className="text-white">{aiStructured.productType}</strong></div>
                <div>• Detected Purpose: <strong className="text-white">{aiStructured.purpose}</strong></div>
                <div>• Target Daily Budget: <strong className="text-emerald-400">₹{aiStructured.budgetDaily}/day</strong></div>
                <div>• Suggested Duration: <strong className="text-white">{aiStructured.durationDays} Days</strong></div>
              </div>
              {aiStructured.priorityFactors && (
                <div className="mt-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Priority Factors: </span>
                  {aiStructured.priorityFactors.join(' • ')}
                </div>
              )}
            </div>
          )}

          {/* Editable Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Cameras">Cameras</option>
                <option value="Drones">Drones</option>
                <option value="Laptops">Laptops</option>
                <option value="Projectors">Projectors</option>
                <option value="Audio">Audio & Speakers</option>
                <option value="Electronics">Other Electronics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Budget (₹)</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  value={budgetDaily}
                  onChange={(e) => setBudgetDaily(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rental Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Delivery Location</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Distributing Request...' : 'Dispatch Request to Registered Owners'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Verified local suppliers will receive opportunity alerts and send you competitive offers.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
