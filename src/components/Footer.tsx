import React from 'react';
import { ShieldCheck, Truck, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100/70 border-t border-slate-200 mt-16 pt-12 pb-8 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 4-Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Escrow Badge */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">RENTO</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                Verified
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              India's leading high-velocity rental & leasing super-app. Rent cameras, furniture, AV gear, vehicles, and electronics with instant doorstep delivery across NCR, Bengaluru, Hyderabad, and Mumbai.
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Escrow Protection</span>
            </div>
          </div>

          {/* Col 2: Top Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">TOP CATEGORIES</h4>
            <ul className="space-y-2 text-[11.5px] text-slate-500">
              <li><a href="#cameras" className="hover:text-slate-900 transition">DSLR & Cinema Camera Kits</a></li>
              <li><a href="#projectors" className="hover:text-slate-900 transition">4K Projectors & Sound Systems</a></li>
              <li><a href="#furniture" className="hover:text-slate-900 transition">Office Desks & Ergonomic Combos</a></li>
              <li><a href="#laptops" className="hover:text-slate-900 transition">MacBooks & High-End Workstations</a></li>
              <li><a href="#vehicles" className="hover:text-slate-900 transition">Commercial & Passenger Vans</a></li>
            </ul>
          </div>

          {/* Col 3: Trust & Escrow */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">TRUST & ESCROW</h4>
            
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>RBI Compliant Escrow</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Rental deposits and tenure payment are preserved in non-interest escrow vaults until asset handover and verification inspection.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium pt-1">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Logistics by Porter Fleet Network</span>
            </div>
          </div>

          {/* Col 4: Help & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">HELP & SUPPORT</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Support helpline active 7 days a week: 9:00 AM - 9:00 PM IST
            </p>

            <div className="space-y-1.5 text-[11px] font-semibold text-slate-800 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>1800-419-RENT (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono text-slate-600">support@rento.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <a href="#terms" className="hover:text-slate-600 transition">Terms & Conditions</a>
            <a href="#escrow" className="hover:text-slate-600 transition">Escrow Security Policy</a>
            <a href="#kyc" className="hover:text-slate-600 transition">KYC Guidelines</a>
            <a href="#damage" className="hover:text-slate-600 transition">Damage Protection Plan</a>
          </div>

          <div>
            © 2026 RENTO Marketplace Private Limited. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
