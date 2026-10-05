import React from 'react';
import { Rental, RentalAgreement } from '../types';
import { X, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface DigitalAgreementModalProps {
  rental: Rental;
  agreement: RentalAgreement;
  onClose: () => void;
}

export const DigitalAgreementModal: React.FC<DigitalAgreementModalProps> = ({
  rental,
  agreement,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Digital Rental Agreement</h3>
              <p className="text-xs text-slate-400 font-mono">Contract ID: {agreement.id} • {rental.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Text Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto font-sans text-xs text-slate-300">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-300">
            {agreement.terms_text}
          </div>

          {/* Cryptographic Verification */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Cryptographic Tamper-Proof Hash</div>
                <div className="text-[10px] text-slate-400 font-mono">{agreement.contract_hash}</div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20">
              Verified
            </span>
          </div>

          {/* Signature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Renter Digital Signature</div>
              <div className="text-xs font-bold text-white mt-0.5">{rental.renter_name}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Signed & Authenticated
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Owner Digital Signature</div>
              <div className="text-xs font-bold text-white mt-0.5">{rental.owner_name}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Signed & Authenticated
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Governed under Indian Information Technology Act (2000)</span>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Contract</span>
          </button>
        </div>

      </div>
    </div>
  );
};
