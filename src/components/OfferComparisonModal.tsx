import React from 'react';
import { RentalRequest, RequestOffer, User } from '../types';
import { X, Sparkles, ShieldCheck, CheckCircle2, Star, ArrowRight, IndianRupee, Package } from 'lucide-react';

interface OfferComparisonModalProps {
  request: RentalRequest;
  offers: RequestOffer[];
  currentUser: User;
  onClose: () => void;
  onAcceptOffer: (offer: RequestOffer) => void;
}

export const OfferComparisonModal: React.FC<OfferComparisonModalProps> = ({
  request,
  offers,
  currentUser,
  onClose,
  onAcceptOffer
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                AI Match Evaluator
              </span>
              <span className="text-xs text-slate-400">{offers.length} Offers Received</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Offers for: "{request.raw_prompt}"
            </h3>
            <p className="text-xs text-slate-400">
              Your Budget: ₹{request.budget_daily}/day • {request.duration_days} Days • {request.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offers List */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {offers.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800">
              <p className="text-sm font-semibold text-slate-300">No offers received yet.</p>
              <p className="text-xs text-slate-400 mt-1">Local suppliers have been notified and will submit offers shortly.</p>
            </div>
          ) : (
            offers.map((offer, index) => {
              let images: string[] = [];
              try {
                images = JSON.parse(offer.product_images || '[]');
              } catch {
                images = ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'];
              }

              let accessories: string[] = [];
              try {
                accessories = JSON.parse(offer.accessories || '[]');
              } catch {
                accessories = [];
              }

              let suitabilityReasons: string[] = [];
              try {
                suitabilityReasons = JSON.parse(offer.ai_suitability_reasons || '[]');
              } catch {
                suitabilityReasons = [];
              }

              const isTopPick = index === 0 && offer.ai_suitability_score >= 90;
              const rentalTotal = offer.offered_price * request.duration_days;
              const deliveryFee = 350;
              const platformFee = Math.round(rentalTotal * 0.10);
              const totalEscrow = rentalTotal + offer.deposit + deliveryFee + platformFee;

              return (
                <div
                  key={offer.id}
                  className={`p-6 rounded-2xl border transition ${isTopPick ? 'bg-slate-900/90 border-emerald-500/40 shadow-xl shadow-emerald-500/5' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    
                    {/* Left: Product & Owner Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={images[0]}
                        alt={offer.product_title}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-slate-800"
                      />
                      <div>
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          {isTopPick && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Top AI Recommendation
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Match: {offer.ai_suitability_score}%
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            Condition: {offer.condition_score || 95}/100
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-white leading-snug">
                          {offer.product_title}
                        </h4>

                        {/* Owner card */}
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                          <img
                            src={offer.owner_avatar}
                            alt={offer.owner_name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-white">{offer.owner_name}</span>
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {offer.owner_rating || 4.9}
                          </span>
                          <span className="text-slate-500">• Verified Owner</span>
                        </div>

                        {/* Supplier Note */}
                        {offer.notes && (
                          <p className="mt-2 text-xs text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                            "{offer.notes}"
                          </p>
                        )}

                        {/* Accessories */}
                        {accessories.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-400 font-medium">Included:</span>
                            {accessories.map((acc, aIdx) => (
                              <span key={aIdx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {acc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & Accept CTA */}
                    <div className="lg:w-64 shrink-0 flex flex-col justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-white">
                            ₹{offer.offered_price.toLocaleString()}
                            <span className="text-xs font-normal text-slate-400">/day</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Deposit: ₹{offer.deposit.toLocaleString()} (Refundable)
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-400">
                          <div className="flex justify-between">
                            <span>Rental ({request.duration_days} days)</span>
                            <span className="text-white font-medium">₹{rentalTotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Porter Delivery</span>
                            <span className="text-white font-medium">₹{deliveryFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform Fee</span>
                            <span className="text-white font-medium">₹{platformFee}</span>
                          </div>
                          <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                            <span>Total Escrow</span>
                            <span className="text-emerald-400">₹{totalEscrow.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAcceptOffer(offer)}
                        className="mt-4 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Accept & Buffer Escrow</span>
                      </button>
                    </div>

                  </div>

                  {/* AI Suitability Pros Breakdown */}
                  {suitabilityReasons.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-cyan-300">
                        <span className="font-bold text-white">Why AI Recommended this Offer: </span>
                        {suitabilityReasons.join(' • ')}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
