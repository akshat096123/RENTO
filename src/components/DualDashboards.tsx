import React, { useState } from 'react';
import { User, Rental, RentalRequest, Product, DemandStat } from '../types';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Package,
  PlusCircle,
  IndianRupee,
  CheckCircle2,
  Calendar,
  AlertCircle,
  LayoutDashboard,
  Store
} from 'lucide-react';

interface DualDashboardsProps {
  viewMode: 'dashboard' | 'owner_studio' | 'logistics_portal';
  currentUser: User;
  rentals: Rental[];
  requests: RentalRequest[];
  products: Product[];
  demandStats: DemandStat[];
  onOpenLogistics: (rental: Rental) => void;
  onOpenAgreement: (rental: Rental) => void;
  onOpenReturn: (rental: Rental) => void;
  onOpenDispute: (rental: Rental) => void;
  onOpenAddProduct: () => void;
  onOpenPostRequest: () => void;
  onViewOffers: (requestId: string) => void;
  onExtendRental: (rental: Rental) => void;
}

export const DualDashboards: React.FC<DualDashboardsProps> = ({
  viewMode: initialViewMode,
  currentUser,
  rentals,
  requests,
  products,
  demandStats,
  onOpenLogistics,
  onOpenAgreement,
  onOpenReturn,
  onOpenDispute,
  onOpenAddProduct,
  onOpenPostRequest,
  onViewOffers,
  onExtendRental
}) => {
  const [activeTab, setActiveTab] = useState<'renter' | 'owner' | 'logistics'>(() => {
    if (initialViewMode === 'owner_studio') return 'owner';
    if (initialViewMode === 'logistics_portal') return 'logistics';
    return 'renter';
  });

  const renterRentals = rentals.filter(r => r.renter_id === currentUser.id);
  const ownerRentals = rentals.filter(r => r.owner_id === currentUser.id);
  const activeRentals = (activeTab === 'owner' ? ownerRentals : renterRentals).filter(r => r.rental_status !== 'COMPLETED');
  const pastRentals = (activeTab === 'owner' ? ownerRentals : renterRentals).filter(r => r.rental_status === 'COMPLETED');
  const ownerProducts = products.filter(p => p.owner_id === currentUser.id);

  const totalEarnings = ownerRentals.reduce((sum, r) => sum + r.rental_total, 0);
  const totalRenterSpend = renterRentals.reduce((sum, r) => sum + r.rental_total, 0);

  /**
   * ---------------------------------------------------------------------
   * 1. RENTER HUB
   * ---------------------------------------------------------------------
   */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Tab Bar: Allows full switching between Renter Hub, Owner Studio, Porter Portal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-extrabold text-orange-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Active Persona: {currentUser.name} ({currentUser.role})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Rentals, Escrow & Fulfillment Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active rentals, Porter courier deliveries, buffered escrow deposits, and owner gear earnings.
          </p>
        </div>

        {/* 3 Main Switchable Sub-Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('renter')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'renter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
            <span>My Bookings ({renterRentals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('owner')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'owner' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Store className="w-3.5 h-3.5 text-orange-600" />
            <span>Lender Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'logistics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Porter Logistics</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. RENTER HUB VIEW                                                    */}
      {/* ===================================================================== */}
      {activeTab === 'renter' && (
        <div className="space-y-8">
          
          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Active Bookings & Transits</h2>
              <p className="text-xs text-slate-500">Security deposits are held in buffered escrow until verified return</p>
            </div>

            <button
              onClick={onOpenPostRequest}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Request</span>
            </button>
          </div>

          {/* Active Rentals Grid */}
          {activeRentals.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-xs text-slate-500 text-xs space-y-3">
              <Package className="w-10 h-10 mx-auto text-slate-400 stroke-1" />
              <div className="font-bold text-slate-800 text-sm">No Active Rentals Yet</div>
              <p className="max-w-md mx-auto text-slate-500">
                You haven't booked any gear yet. Explore the marketplace or rent equipment with 1-click escrow protection!
              </p>
              <button
                onClick={onOpenPostRequest}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Post Gear Requirement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeRentals.map(rental => {
                let images: string[] = [];
                try {
                  images = JSON.parse(rental.product_images || '[]');
                } catch {
                  images = ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'];
                }

                return (
                  <div
                    key={rental.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={images[0]}
                        alt={rental.product_title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${rental.payment_status === 'BUFFERED' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            Escrow: {rental.payment_status}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            Status: {rental.rental_status}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                          {rental.product_title}
                        </h4>

                        <div className="text-xs text-slate-500 mt-1">
                          Owner: <strong className="text-slate-800">{rental.owner_name}</strong> • {rental.rental_days} Days ({rental.start_date} → {rental.end_date})
                        </div>
                      </div>
                    </div>

                    {/* Escrow Protected Ledger Summary */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 font-medium">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Escrow Buffered:</span>
                        <strong className="text-emerald-700 text-sm font-extrabold">₹{rental.total_amount.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Security Deposit (Refundable):</span>
                        <span className="text-blue-700 font-bold">₹{rental.deposit_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Porter Courier Handover OTP:</span>
                        <span className="font-mono text-emerald-800 font-black bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded">
                          {rental.handover_otp}
                        </span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onOpenLogistics(rental)}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Porter Delivery</span>
                      </button>

                      <button
                        onClick={() => onOpenAgreement(rental)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 border border-slate-200"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Agreement</span>
                      </button>

                      <button
                        onClick={() => onExtendRental(rental)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200"
                      >
                        + Extend
                      </button>

                      <button
                        onClick={() => onOpenReturn(rental)}
                        className="py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Return & Refund</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* My Posted Demand Requests */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
                My Posted Demand Requests ({requests.filter(r => r.renter_id === currentUser.id).length})
              </h3>
            </div>

            <div className="space-y-3">
              {requests.filter(r => r.renter_id === currentUser.id).map(req => (
                <div key={req.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="font-extrabold text-slate-900">"{req.raw_prompt}"</div>
                    <div className="text-slate-500 mt-0.5">
                      Target: ₹{req.budget_daily}/day • {req.duration_days} Days • Status: <span className="text-emerald-600 font-bold">{req.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewOffers(req.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition flex items-center gap-1"
                  >
                    <span>Offers ({req.offer_count || 0})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. OWNER STUDIO VIEW                                                  */}
      {/* ===================================================================== */}
      {activeTab === 'owner' && (
        <div className="space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Inventory & Lender Revenue</h2>
              <p className="text-xs text-slate-500">Manage your idle gear, view incoming demand, and track earned payouts</p>
            </div>

            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Gear with AI Scan</span>
            </button>
          </div>

          {/* AI Demand Prediction Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>AI Regional Demand Predictor: High-Velocity Rental Categories</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {demandStats.map(stat => (
                <div key={stat.category} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-slate-600 font-bold">{stat.category}</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    +{stat.trend_growth_percent}%
                    <span className="text-[10px] text-emerald-600 font-bold ml-1">Surge</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Avg: ₹{stat.avg_budget}/day</div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner's Listed Inventory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
              <span>My Listed Products ({ownerProducts.length})</span>
              <span className="text-emerald-700 font-extrabold">Total Revenue: ₹{totalEarnings.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownerProducts.map(p => (
                <div key={p.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={JSON.parse(p.images || '[]')[0] || ''}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="font-extrabold text-slate-900 truncate">{p.title}</div>
                    <div className="text-emerald-600 font-bold mt-0.5">₹{p.daily_price}/day</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      AI Condition: {p.condition_score}/100 • SN: {p.serial_number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Demand Opportunities */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Customer Demand Requests Near You
            </div>

            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                        {req.category}
                      </span>
                      <span className="font-extrabold text-slate-900">"{req.raw_prompt}"</span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      Customer Budget: <strong className="text-emerald-700">₹{req.budget_daily}/day</strong> • Duration: {req.duration_days} Days ({req.location})
                    </div>
                  </div>

                  <button
                    onClick={() => onViewOffers(req.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition whitespace-nowrap shadow-xs"
                  >
                    Send Equipment Offer
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. PORTER LOGISTICS & VERIFICATION PORTAL                             */}
      {/* ===================================================================== */}
      {activeTab === 'logistics' && (
        <div className="space-y-8">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Porter Partner Express • Driver: Charlie Kumar (DL 1C AA 4492)</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Logistics Handover, Transit & OTP Verification</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate 9-stage courier pickup, GPS transit simulation, and secure OTP equipment handovers.
            </p>
          </div>

          <div className="space-y-4">
            {rentals.map(rental => (
              <div key={rental.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase">
                      Order: {rental.id}
                    </span>
                    <span className="text-xs text-slate-500">Courier Payout: ₹{rental.delivery_fee}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">{rental.product_title}</h4>
                  <div className="text-xs text-slate-500 mt-1">
                    Pickup from <strong className="text-slate-800">{rental.owner_name}</strong> → Deliver to <strong className="text-slate-800">{rental.renter_name}</strong>
                  </div>
                </div>

                <button
                  onClick={() => onOpenLogistics(rental)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 self-start md:self-auto"
                >
                  <Truck className="w-4 h-4" />
                  <span>Open Driver Simulation Screen</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
