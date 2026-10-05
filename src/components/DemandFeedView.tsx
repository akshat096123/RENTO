import React, { useState } from 'react';
import { RentalRequest, Product, User } from '../types';
import { Sparkles, MapPin, Calendar, IndianRupee, Send, ArrowRight, CheckCircle2, PlusCircle } from 'lucide-react';

interface DemandFeedViewProps {
  requests: RentalRequest[];
  products: Product[];
  currentUser: User;
  onSendOffer: (requestId: string, productId: string, price: number, deposit: number, accessories: string[], notes: string) => void;
  onViewOffers: (requestId: string) => void;
  onOpenPostRequest: () => void;
}

export const DemandFeedView: React.FC<DemandFeedViewProps> = ({
  requests,
  products,
  currentUser,
  onSendOffer,
  onViewOffers,
  onOpenPostRequest
}) => {
  const [selectedRequestForOffer, setSelectedRequestForOffer] = useState<RentalRequest | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [offerPrice, setOfferPrice] = useState<number>(1800);
  const [offerDeposit, setOfferDeposit] = useState<number>(5000);
  const [accessoriesText, setAccessoriesText] = useState('Extra Battery, Dual Charger, Protective Case');
  const [offerNotes, setOfferNotes] = useState('Available with doorstep delivery.');

  const handleOpenOfferModal = (req: RentalRequest) => {
    setSelectedRequestForOffer(req);
    // Auto select first product matching category or first product
    const matching = products.find(p => p.category.toLowerCase() === req.category.toLowerCase()) || products[0];
    if (matching) {
      setSelectedProductId(matching.id);
      setOfferPrice(matching.daily_price);
      setOfferDeposit(matching.deposit);
    }
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForOffer || !selectedProductId) return;

    const accessories = accessoriesText.split(',').map(s => s.trim()).filter(Boolean);
    onSendOffer(
      selectedRequestForOffer.id,
      selectedProductId,
      offerPrice,
      offerDeposit,
      accessories,
      offerNotes
    );
    setSelectedRequestForOffer(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Live Demand Radar</span>
          </div>
          <h2 className="text-2xl font-black text-white">Demand Creates Supply: Live Requests</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            When users cannot find gear in existing catalogs, they post custom requests. Owners can review customer requirements, send custom equipment offers, and let AI score suitability!
          </p>
        </div>

        <button
          onClick={onOpenPostRequest}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Request</span>
        </button>
      </div>

      {/* Requests Feed Grid */}
      <div className="mt-8 space-y-4">
        {requests.map((req) => {
          let aiData: any = {};
          try {
            aiData = JSON.parse(req.ai_structured_data || '{}');
          } catch {
            aiData = {};
          }

          const isOwnerOfRequest = req.renter_id === currentUser.id;

          return (
            <div
              key={req.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* User & Request info */}
                <div className="flex items-start gap-4">
                  <img
                    src={req.renter_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                    alt={req.renter_name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{req.renter_name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">({req.renter_rating || 4.9} ⭐ Renter)</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        {req.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold">
                        Status: {req.status}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white mt-1.5 leading-snug">
                      "{req.raw_prompt}"
                    </h3>

                    {/* AI structured summary */}
                    {aiData.intentSummary && (
                      <div className="mt-2 text-xs text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 p-2.5 rounded-xl flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>AI Summary: {aiData.intentSummary}</span>
                      </div>
                    )}

                    {/* Metadata tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                        Budget: <strong className="text-emerald-400">₹{req.budget_daily}/day</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        Duration: <strong className="text-slate-200">{req.duration_days} Days</strong> ({req.start_date} → {req.end_date})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        Location: <strong className="text-slate-200">{req.location}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">
                    Offers Received: <strong className="text-emerald-400 font-bold">{req.offer_count || 0}</strong>
                  </div>

                  {isOwnerOfRequest ? (
                    <button
                      onClick={() => onViewOffers(req.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <span>Review Offers with AI ({req.offer_count || 0})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleOpenOfferModal(req)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Offer as Supplier</span>
                      </button>

                      {Number(req.offer_count || 0) > 0 && (
                        <button
                          onClick={() => onViewOffers(req.id)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
                        >
                          View Offers
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Send Offer Modal */}
      {selectedRequestForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Send Offer for "{selectedRequestForOffer.category}"</span>
                </h3>
                <p className="text-xs text-slate-400">Renter Target: ₹{selectedRequestForOffer.budget_daily}/day ({selectedRequestForOffer.duration_days} Days)</p>
              </div>
              <button
                onClick={() => setSelectedRequestForOffer(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOffer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Your Listed Gear</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) {
                      setOfferPrice(prod.daily_price);
                      setOfferDeposit(prod.deposit);
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} — ₹{p.daily_price}/day (Deposit: ₹{p.deposit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Offered Daily Rate (₹)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={offerDeposit}
                    onChange={(e) => setOfferDeposit(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Included Accessories / Perks</label>
                <input
                  type="text"
                  value={accessoriesText}
                  onChange={(e) => setAccessoriesText(e.target.value)}
                  placeholder="Extra batteries, charger, memory card, cables..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Note to Customer</label>
                <textarea
                  rows={2}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  placeholder="Why this equipment is ideal for their event..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Offer (Triggers AI Suitability Scoring)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
