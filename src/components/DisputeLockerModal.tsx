import React, { useState } from 'react';
import { Rental, Dispute, User } from '../types';
import { openDispute, resolveDispute } from '../api';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Gavel, Scale } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DisputeLockerModalProps {
  rental: Rental;
  dispute?: Dispute;
  currentUser: User;
  onClose: () => void;
  onDisputeUpdated: () => void;
}

export const DisputeLockerModal: React.FC<DisputeLockerModalProps> = ({
  rental,
  dispute: existingDispute,
  currentUser,
  onClose,
  onDisputeUpdated
}) => {
  const [claimType, setClaimType] = useState('DAMAGE');
  const [description, setDescription] = useState('Deep scratch found on front lens glass and missing original lens hood.');
  const [deductionRequested, setDeductionRequested] = useState(1500);
  const [deductionApproved, setDeductionApproved] = useState(1200);
  const [resolutionNotes, setResolutionNotes] = useState('Mutual settlement: ₹1,200 deducted from deposit for OEM lens repair; remaining deposit returned.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await openDispute(rental.id, {
        initiator_id: currentUser.id,
        claim_type: claimType,
        description,
        deduction_requested: deductionRequested
      });
      onDisputeUpdated();
    } catch (err: any) {
      alert('Error creating dispute: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveDispute = async () => {
    setIsResolving(true);
    try {
      await resolveDispute(rental.id, {
        deductionApproved,
        resolutionNotes
      });
      confetti({ particleCount: 70, spread: 60 });
      onDisputeUpdated();
      onClose();
    } catch (err: any) {
      alert('Error resolving dispute: ' + err.message);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">RENTO Dispute Locker</h3>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                  Fair Arbitration
                </span>
              </div>
              <p className="text-xs text-slate-400">{rental.product_title} • Escrow Deposit: ₹{rental.deposit_amount.toLocaleString()}</p>
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
          
          {/* Dispute Status / Case Details */}
          {existingDispute ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white uppercase tracking-wider">Active Case Details</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${existingDispute.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {existingDispute.status}
                  </span>
                </div>
                <div className="text-slate-300"><strong>Claim Type:</strong> {existingDispute.claim_type}</div>
                <div className="text-slate-300 mt-1"><strong>Description:</strong> {existingDispute.description}</div>
                <div className="text-rose-400 font-semibold mt-1">
                  <strong>Compensation Claimed:</strong> ₹{existingDispute.deduction_requested.toLocaleString()}
                </div>
              </div>

              {/* AI Damage Assessment Box */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <Gavel className="w-4 h-4 text-purple-400" />
                  <span>AI Arbitration & Depreciation Analysis</span>
                </div>
                <p className="text-slate-300">
                  {existingDispute.ai_damage_assessment || 'AI analyzed pre-dispatch condition against post-return photos. Front element scratch depreciation valued at ₹1,200.'}
                </p>
              </div>

              {/* Mutual Settlement Controls */}
              {existingDispute.status !== 'RESOLVED' ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Mutual Settlement & Deposit Distribution
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Agreed Deduction to Owner (₹)
                    </label>
                    <input
                      type="number"
                      max={rental.deposit_amount}
                      value={deductionApproved}
                      onChange={(e) => setDeductionApproved(Number(e.target.value))}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                    <span>Remaining to Refund Renter:</span>
                    <strong className="text-emerald-400 font-bold">
                      ₹{Math.max(0, rental.deposit_amount - deductionApproved).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Resolution Summary</label>
                    <textarea
                      rows={2}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-white"
                    />
                  </div>

                  <button
                    onClick={handleResolveDispute}
                    disabled={isResolving}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isResolving ? 'Executing...' : 'Settle Case & Release Escrow Deposit'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-400 text-center font-bold">
                  ✅ Dispute has been fully resolved and deposit settled.
                </div>
              )}

            </div>
          ) : (
            /* Open New Dispute Form */
            <form onSubmit={handleCreateDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Claim Reason</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white"
                >
                  <option value="DAMAGE">Physical Damage / Scratches</option>
                  <option value="MISSING_ACCESSORY">Missing Accessory / Cables</option>
                  <option value="LATE_RETURN">Late Return Penalty</option>
                  <option value="DEFECTIVE_PRODUCT">Product Defective Upon Arrival</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Claim Details</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Compensation Claimed from Deposit (Max ₹{rental.deposit_amount})
                </label>
                <input
                  type="number"
                  max={rental.deposit_amount}
                  value={deductionRequested}
                  onChange={(e) => setDeductionRequested(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isSubmitting ? 'Opening Dispute...' : 'File Dispute into Dispute Locker'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
