import React, { useState } from 'react';
import { Rental, LogisticsOrder, User } from '../types';
import { progressLogistics, verifyLogisticsOtp } from '../api';
import { X, Truck, ShieldCheck, Phone, MapPin, CheckCircle2, ArrowRight, KeyRound, Clock, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogisticsTrackerModalProps {
  rental: Rental;
  logistics: LogisticsOrder;
  currentUser: User;
  onClose: () => void;
  onRefreshRental: () => void;
}

export const LogisticsTrackerModal: React.FC<LogisticsTrackerModalProps> = ({
  rental,
  logistics,
  currentUser,
  onClose,
  onRefreshRental
}) => {
  const [currentLogistics, setCurrentLogistics] = useState<LogisticsOrder>(logistics);
  const [otpInput, setOtpInput] = useState('');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const stages = currentLogistics.stages || [
    { id: 'REQUESTED', label: 'Delivery Requested', desc: 'Booking created in Porter express network' },
    { id: 'DRIVER_ASSIGNED', label: 'Driver Assigned', desc: 'Verified driver and vehicle dispatched' },
    { id: 'ARRIVING_PICKUP', label: 'Arriving at Pickup', desc: 'En route to owner location' },
    { id: 'PICKED_UP', label: 'Product Picked Up', desc: 'Pickup condition verified (96/100)' },
    { id: 'IN_TRANSIT', label: 'In Transit', desc: 'Safely on route via express carrier' },
    { id: 'NEAR_DESTINATION', label: 'Near Destination', desc: 'Driver is within 1.5 km of dropoff' },
    { id: 'DELIVERED', label: 'Delivered', desc: 'Driver at doorstep awaiting OTP verification' },
    { id: 'OTP_CONFIRMED', label: 'OTP Confirmed', desc: 'Handover verified by renter' },
    { id: 'COMPLETED', label: 'Delivery Completed', desc: 'Escrow released to owner, rental begins' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === currentLogistics.status);

  const handleAdvanceStep = async () => {
    setIsAdvancing(true);
    setErrorMessage('');
    try {
      const updated = await progressLogistics(rental.id);
      setCurrentLogistics(updated);
      onRefreshRental();
      if (updated.status === 'COMPLETED' || updated.status === 'OTP_CONFIRMED') {
        confetti({ particleCount: 70, spread: 60 });
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) return;
    setIsVerifying(true);
    setErrorMessage('');
    try {
      const res = await verifyLogisticsOtp(rental.id, otpInput);
      setSuccessMessage(res.message);
      confetti({ particleCount: 100, spread: 70 });
      // Re-fetch
      const updated = await progressLogistics(rental.id, 'COMPLETED');
      setCurrentLogistics(updated);
      onRefreshRental();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Live Porter Logistics Tracking</h3>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                  Partner Express
                </span>
              </div>
              <p className="text-xs text-slate-400">Tracking ID: {currentLogistics.id} • Item: {rental.product_title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Driver Card & Route */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Driver details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                  alt={currentLogistics.driver_name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <div className="text-xs font-bold text-white">{currentLogistics.driver_name}</div>
                  <div className="text-[11px] text-slate-400">{currentLogistics.driver_vehicle}</div>
                  <div className="text-[10px] font-mono text-indigo-400 font-semibold">{currentLogistics.driver_vehicle_num}</div>
                </div>
              </div>

              <a
                href={`tel:${currentLogistics.driver_phone}`}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Live ETA Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Arrival</span>
                <div className="text-2xl font-black text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  {currentLogistics.estimated_mins > 0 ? `${currentLogistics.estimated_mins} mins` : 'Arrived at Dropoff'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Handover OTP</span>
                <div className="text-lg font-mono font-black text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {currentLogistics.otp_code}
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Simulated Map Graphic */}
          <div className="relative h-44 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
            {/* Background grid styling */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="truncate max-w-[200px]">{currentLogistics.pickup_address}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-medium text-right">
                <span className="truncate max-w-[200px]">{currentLogistics.drop_address}</span>
                <MapPin className="w-4 h-4 text-rose-400" />
              </div>
            </div>

            {/* Animated Vehicle progress line */}
            <div className="relative z-10 my-4">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${Math.max(10, ((currentStageIndex + 1) / stages.length) * 100)}%` }}
                />
              </div>

              {/* Vehicle icon marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 p-1.5 rounded-full bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/50"
                style={{ left: `${Math.max(5, Math.min(95, ((currentStageIndex + 1) / stages.length) * 100))}%` }}
              >
                <Truck className="w-4 h-4" />
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Pickup Condition: 96/100 Certified</span>
              <span className="text-indigo-400 font-semibold">Live GPS Simulation • Active Courier Feed</span>
            </div>
          </div>

          {/* 9-Stage Progress Timeline */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Delivery Milestones (9-Stage Protocol)
            </div>
            <div className="space-y-2">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={stage.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${isCurrent ? 'bg-indigo-950/40 border-indigo-500/50 text-white font-semibold' : isPassed ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-950/20 border-slate-800/40 text-slate-600'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                        {idx + 1}
                      </div>
                      <span>{stage.label}</span>
                    </div>

                    <span className="text-[11px] text-slate-400 hidden sm:inline">{stage.desc}</span>

                    {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* OTP Verification & Simulation controls */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Step Simulator button */}
            <button
              onClick={handleAdvanceStep}
              disabled={isAdvancing || currentStageIndex >= stages.length - 1}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{isAdvancing ? 'Updating...' : 'Simulate Next Movement Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* OTP Handover Form */}
            <form onSubmit={handleVerifyOtp} className="w-full sm:w-auto flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 4-digit OTP"
                className="w-32 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-center text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isVerifying || !otpInput.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50 whitespace-nowrap"
              >
                {isVerifying ? 'Verifying...' : 'Verify Handover OTP'}
              </button>
            </form>

          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
