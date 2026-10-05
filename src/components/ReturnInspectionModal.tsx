import React, { useState } from 'react';
import { Rental, User } from '../types';
import { returnRental } from '../api';
import { X, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReturnInspectionModalProps {
  rental: Rental;
  currentUser: User;
  onClose: () => void;
  onReturnCompleted: () => void;
  onOpenDispute: (rental: Rental) => void;
}

export const ReturnInspectionModal: React.FC<ReturnInspectionModalProps> = ({
  rental,
  currentUser,
  onClose,
  onReturnCompleted,
  onOpenDispute
}) => {
  const [returnNotes, setReturnNotes] = useState('Product returned in clean, fully operational condition with all accessories intact.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await returnRental(rental.id, {
        returnNotes,
        returnPhotos: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
        ]
      });
      setResult(res);
      if (res.conditionStatus === 'CLEAN_RETURN') {
        confetti({ particleCount: 80, spread: 60 });
      }
      onReturnCompleted();
    } catch (err: any) {
      alert('Return error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Post-Rental Condition Inspection</h3>
              <p className="text-xs text-slate-400">{rental.product_title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Pre-rental score card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Pre-Dispatch Certified Condition</span>
              <div className="text-xl font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
                96 / 100 Condition Score
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Escrow Security Deposit</span>
              <div className="text-base font-black text-white">₹{rental.deposit_amount.toLocaleString()}</div>
            </div>
          </div>

          {!result ? (
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Inspection Notes & Photos
                </label>
                <textarea
                  rows={3}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Describe cosmetic and mechanical condition upon return..."
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Sample return inspection presets */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setReturnNotes('Clean return. Everything functional, zero scratches, all accessories accounted for.')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60"
                >
                  🟢 Test Clean Return (100% Refund)
                </button>
                <button
                  type="button"
                  onClick={() => setReturnNotes('Minor superficial scuff on bottom tripod plate from normal usage.')}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400 hover:bg-amber-950/60"
                >
                  🟡 Test Minor Scuff
                </button>
                <button
                  type="button"
                  onClick={() => setReturnNotes('Deep scratch on front lens glass and missing original battery.')}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-950/60"
                >
                  🔴 Test Damage Dispute
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-500/20 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Comparing with AI Computer Vision...' : 'Run AI Condition Verification & Return'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Result card */}
              <div className={`p-4 rounded-2xl border ${result.conditionStatus === 'CLEAN_RETURN' ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-rose-950/20 border-rose-500/40'}`}>
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  {result.conditionStatus === 'CLEAN_RETURN' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400">Clean Return Verified (Score: {result.aiComparison.postRentalScore}/100)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-400">Discrepancy Detected (Score: {result.aiComparison.postRentalScore}/100)</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.aiComparison.recommendation}
                </p>

                {result.aiComparison.anomalies?.length > 0 && (
                  <div className="mt-2 text-xs text-rose-300">
                    <strong>Flags: </strong> {result.aiComparison.anomalies.join(', ')}
                  </div>
                )}
              </div>

              {result.conditionStatus === 'CLEAN_RETURN' ? (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center text-emerald-400 font-semibold">
                  ✅ Security deposit of ₹{rental.deposit_amount.toLocaleString()} has been released to your account!
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDispute(rental);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2"
                  >
                    <span>Open Dispute Locker for Arbitration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
