import React, { useState } from 'react';
import { Product, User } from '../types';
import { X, ShieldCheck, Sparkles, MapPin, Star, Calendar, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  currentUser: User;
  onClose: () => void;
  onBookNow: (product: Product, days: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currentUser,
  onClose,
  onBookNow
}) => {
  const [rentalDays, setRentalDays] = useState(3);

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'];
  }

  let specs: Record<string, string> = {};
  try {
    specs = JSON.parse(product.specs);
  } catch {
    specs = {};
  }

  const rentalTotal = product.daily_price * rentalDays;
  const deliveryFee = 350;
  const platformFee = Math.round(rentalTotal * 0.10);
  const totalAmount = rentalTotal + product.deposit + deliveryFee + platformFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-950 border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image & AI Condition Badges */}
          <div className="p-6 bg-slate-950/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                <img
                  src={images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/90 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    AI Condition: {product.condition_score}/100
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950/90 text-cyan-400 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Authenticity: {product.authenticity_status}
                  </span>
                </div>
              </div>

              {/* AI Condition Notes */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RENTO Vision Inspection Report</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {product.condition_notes || 'All mechanical buttons responsive, glass surface clean, zero sensor dust.'}
                </p>
                <div className="mt-2 text-[11px] text-cyan-400 font-medium">
                  {product.authenticity_notes || 'Serial number verified with official database.'}
                </div>
              </div>

              {/* Owner Info Card */}
              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={product.owner_avatar}
                    alt={product.owner_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      {product.owner_name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-amber-400 font-bold flex items-center gap-0.5 justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.owner_rating || 4.9}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Verified Supplier</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Doorstep delivery available via Porter Partner Express</span>
            </div>
          </div>

          {/* Right Column: Specs & Escrow Booking Calculation */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                {product.category} • {product.brand}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {product.title}
              </h2>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications pills */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Specifications</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">{key}</span>
                      <span className="text-white font-medium truncate block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration selector */}
              <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Select Rental Duration
                  </span>
                  <span className="text-xs font-black text-emerald-400">{rentalDays} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 7].map((days) => (
                    <button
                      key={days}
                      onClick={() => setRentalDays(days)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${rentalDays === days ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'}`}
                    >
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escrow Fee Breakdown */}
              <div className="mt-4 space-y-1.5 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Rental Fee ({rentalDays} × ₹{product.daily_price})</span>
                  <span className="text-white font-medium">₹{rentalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Security Deposit (100% Refundable)</span>
                  <span className="text-cyan-400 font-semibold">₹{product.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Porter Delivery Express</span>
                  <span className="text-white font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>RENTO Protection & Commission (10%)</span>
                  <span className="text-white font-medium">₹{platformFee}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Escrow Buffer</span>
                  <span className="text-emerald-400 text-base">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Protected in Escrow: Rental fee is released to owner only after you verify delivery OTP.</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <button
                onClick={() => onBookNow(product, rentalDays)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Digital Agreement & Escrow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
