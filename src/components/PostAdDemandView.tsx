import React, { useState } from 'react';
import { User, Product } from '../types';
import { createProduct, createRequest } from '../api';
import {
  ArrowLeft,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  Truck,
  Building,
  Radio,
  Clock,
  Layers,
  IndianRupee,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostAdDemandViewProps {
  currentUser: User;
  onBackToMarketplace: () => void;
  onProductCreated: (product: Product) => void;
  onRequestCreated: (request: any) => void;
}

export const PostAdDemandView: React.FC<PostAdDemandViewProps> = ({
  currentUser,
  onBackToMarketplace,
  onProductCreated,
  onRequestCreated
}) => {
  const [activeTab, setActiveTab] = useState<'rent_out' | 'need_rent'>('rent_out');

  // Form State
  const [cityHub, setCityHub] = useState('Delhi NCR (Gurugram, Noida, Delhi)');
  const [localArea, setLocalArea] = useState('DLF Cyber City, Sector 24 (122002)');
  const [selectedSuperCategory, setSelectedSuperCategory] = useState('Cameras & Cine');

  const [title, setTitle] = useState('Sony Alpha A7 IV Mirrorless Cine Kit (28-70mm)');
  const [dailyPrice, setDailyPrice] = useState(2000);
  const [monthlyPrice, setMonthlyPrice] = useState(28000);
  const [deposit, setDeposit] = useState(10000);

  const [description, setDescription] = useState(
    'Includes: Sony A7 IV Body (33MP Full-Frame, 4K 60p 10-bit 4:2:2), 28-70mm Sony FE lens, 2x Original Sony NP-FZ100 Batteries, 128GB V90 Tough SD Card, Dual Bay USB-C Charger, and Pelican 1510 waterproof carry case. Perfect for corporate shoots, wedding cinematography, or documentary work. Sanitized and tested before handover.'
  );

  const [doorstepDelivery, setDoorstepDelivery] = useState(true);
  const [selfPickup, setSelfPickup] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Asset thumbnails
  const [thumbnails, setThumbnails] = useState([
    { id: '1', title: 'Grade A+', badgeColor: 'bg-emerald-500', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80' },
    { id: '2', title: '28-70mm G Kit', badgeColor: 'bg-blue-600', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&auto=format&fit=crop&q=80' },
    { id: '3', title: 'Batteries Kit', badgeColor: 'bg-purple-600', img: 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=300&auto=format&fit=crop&q=80' }
  ]);

  const superCategories = [
    'Cameras & Cine',
    'Projectors & AV',
    'Vans & Vehicles',
    'Office & Furniture'
  ];

  const popularKeywords = [
    '+ 2 Extra Batteries',
    '+ Same Day Delivery',
    '+ Flight Case',
    '+ Zero Deposit KYC'
  ];

  const handlePolishWithAI = () => {
    setDescription(
      `[AI Certified Spec] ${title} in Grade A+ operational state.\n• Sensor: 33MP Exmor R CMOS, 4K 60p 10-bit 4:2:2 recording\n• Optics: 28-70mm f/3.5-5.6 OSS fast autofocus lens\n• Power: 2x 2280mAh OEM batteries + dual charger\n• Storage: Sony Tough V90 128GB high-bitrate card\n• Enclosure: Pelican 1510 military hardcase. Sanitized & calibrated before Porter dispatch.`
    );
    confetti({ particleCount: 50, spread: 50 });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'rent_out') {
        const res = await createProduct({
          owner_id: currentUser.id,
          title,
          category: selectedSuperCategory.split(' ')[0],
          brand: 'Sony',
          model: 'A7 IV Kit',
          description,
          daily_price: dailyPrice,
          deposit,
          location: localArea,
          serial_number: `SN-SONY-${Math.floor(100000 + Math.random() * 900000)}`,
          images: JSON.stringify(thumbnails.map(t => t.img))
        });
        confetti({ particleCount: 90, spread: 70 });
        alert('Listing published successfully across Delhi NCR! Real-time inquiries will notify your dashboard.');
        onProductCreated(res.product);
      } else {
        const res = await createRequest({
          renter_id: currentUser.id,
          raw_prompt: title,
          category: selectedSuperCategory.split(' ')[0],
          budget_daily: dailyPrice,
          duration_days: 3,
          location: localArea
        });
        confetti({ particleCount: 90, spread: 70 });
        alert('Urgent rental requirement broadcasted across Delhi NCR! Local suppliers are submitting quotes.');
        onRequestCreated(res.request);
      }
      onBackToMarketplace();
    } catch (err: any) {
      alert('Error publishing: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Breadcrumb & Live Hub Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <button
          onClick={onBackToMarketplace}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Marketplace / Post Ad & AI Demand Intake</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Live NCR Demand Hub
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold text-[10px]">
            <Zap className="w-3 h-3 text-blue-600" />
            Instant KYC Verified Listing
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-2">
          <Zap className="w-3 h-3 text-orange-600" />
          DUAL MATCHING ENGINE
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Post an Ad or Broadcast an Urgent Rental Requirement
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          List idle cameras, projectors, vehicles, or work setups to earn daily yields, or alert our network of verified suppliers in Delhi NCR for 1-hour fast dispatch.
        </p>
      </div>

      {/* 2 Segmented Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-slate-200/80 rounded-2xl max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('rent_out')}
          className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'rent_out' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <span>📦 I Want to Rent Out</span>
          <span className="text-[10px] font-normal text-slate-500 hidden sm:inline">(Owner / Rental Fleet Supplier)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('need_rent')}
          className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'need_rent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <span>📢 I Need to Rent (Urgent)</span>
          <span className="text-[10px] font-normal text-slate-500 hidden sm:inline">(Borrower / Production Crew Demand)</span>
        </button>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Steps 1 to 5 (8 Cols) */}
        <form onSubmit={handlePublish} className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Location & Category Taxonomy */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-extrabold text-[11px] flex items-center justify-center">1</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Location & Category Taxonomy</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Step 1 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City Hub</label>
                <div className="relative">
                  <select
                    value={cityHub}
                    onChange={(e) => setCityHub(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 appearance-none font-medium"
                  >
                    <option value="Delhi NCR (Gurugram, Noida, Delhi)">Delhi NCR (Gurugram, Noida, Delhi)</option>
                    <option value="Bengaluru Urban">Bengaluru Urban</option>
                    <option value="Mumbai Metropolitan Region">Mumbai Metropolitan Region</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Local Area & Pincode</label>
                <input
                  type="text"
                  value={localArea}
                  onChange={(e) => setLocalArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Listing Super-Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {superCategories.map((sc) => {
                  const isSelected = selectedSuperCategory === sc;
                  return (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setSelectedSuperCategory(sc)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                    >
                      <span>{sc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 2: Listing Title & Search Keywords */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-extrabold text-[11px] flex items-center justify-center">2</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Listing Title & Search Keywords</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Step 2 of 5</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-slate-700">Product Brand, Model or Bundle Name</label>
                <span className="text-[11px] text-slate-400">{title.length}/80 characters</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                POPULAR KEYWORDS IN NEW DELHI
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => setTitle(prev => `${prev} ${kw}`)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-700 hover:bg-blue-100 text-[11px] font-medium transition"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: Photos & AI Asset Vision */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-extrabold text-[11px] flex items-center justify-center">3</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Photos & AI Asset Vision</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Step 3 of 5</span>
            </div>

            {/* AI Auto-Detect Box */}
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3 text-xs text-orange-900">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">AI Auto-Detect & Instant Tagging</div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Upload an asset photo. Our optical system scans model badges, inspects exterior cosmetic grading (Grade A/B), and pre-populates warranty specs & rate suggestions automatically.
                </p>
              </div>
            </div>

            {/* Drag & drop box */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Drag & drop asset photos or browse device</div>
                <div className="text-[10px] text-slate-400 mt-0.5">High-resolution JPEG, PNG, or HEIC (Up to 15MB each)</div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold shadow-xs"
                >
                  Select Files
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Capture Live</span>
                </button>
              </div>
            </div>

            {/* Thumbnails preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {thumbnails.map((thumb) => (
                <div key={thumb.id} className="relative rounded-xl overflow-hidden aspect-[4/3] border border-slate-200 group bg-slate-100">
                  <img src={thumb.img} alt={thumb.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold">
                    {thumb.title}
                  </div>
                  <button
                    type="button"
                    onClick={() => setThumbnails(prev => prev.filter(t => t.id !== thumb.id))}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 text-slate-600 hover:text-rose-600 text-xs shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs cursor-pointer hover:bg-slate-50 transition p-2">
                <Upload className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">+ Add More</span>
              </div>
            </div>
          </div>

          {/* STEP 4: Rental Pricing & Security Escrow */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-extrabold text-[11px] flex items-center justify-center">4</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rental Pricing & Security Escrow</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Step 4 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-600">Daily Rate (₹)</label>
                <div className="flex items-center gap-1 text-lg font-black text-slate-900 mt-1">
                  <span>₹</span>
                  <input
                    type="number"
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Average NCR: ₹1,900 / day</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-600">Monthly Rate (₹)</label>
                <div className="flex items-center gap-1 text-lg font-black text-slate-900 mt-1">
                  <span>₹</span>
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Save 52% on long tenure</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-600">Refundable Escrow Deposit</label>
                <div className="flex items-center gap-1 text-lg font-black text-slate-900 mt-1">
                  <span>₹</span>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">On usable Aadhaar DigiLocker KYC</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Deposits are safeguarded in an RBI-regulated, non-interest escrow vault. Owners receive payouts automatically every 24 hours of active tenure.</span>
            </div>
          </div>

          {/* STEP 5: Description & Verification Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-extrabold text-[11px] flex items-center justify-center">5</span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Description & Verification Details</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Step 5 of 5</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Technical Highlights & Inclusions</label>
                <button
                  type="button"
                  onClick={handlePolishWithAI}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Polish Description</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-normal leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Fulfillment & Delivery Modes</label>
              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doorstepDelivery}
                    onChange={(e) => setDoorstepDelivery(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Doorstep Porter Delivery</div>
                    <div className="text-[11px] text-slate-500">Instant 2-wheeler or Tata Ace dispatch with asset inspection at recipient pin.</div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selfPickup}
                    onChange={(e) => setSelfPickup(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Self-Pickup Hub</div>
                    <div className="text-[11px] text-slate-500">Renter collects directly from your verified DLF Cyber City address.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Broadcast CTA */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-slate-900">Ready to broadcast across NCR?</h4>
                <p className="text-xs text-slate-500 mt-0.5">Zero listing fee • 100% Escrow backed • Verified reviewers only</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs sm:text-sm shadow-md transition whitespace-nowrap disabled:opacity-50"
              >
                {isSubmitting ? 'Broadcasting...' : 'Publish Listing & Connect to Renters'}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1-Minute Live Review
              </span>
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Lead Alerts
              </span>
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ₹50,000 Free Damage Cover
              </span>
            </div>
          </div>

        </form>

        {/* Right Column: Live Analytics & Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Live Rental Demand */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>🔥 Live Rental Demand</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold">
                High Activity
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">142</span>
                <span className="text-xs font-semibold text-slate-500">Delhi NCR renters</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Actively searched for Cine Kits and 4K cameras in Gurugram, South Delhi & Noida in the last 72 hours.
              </p>
            </div>

            {/* Sparkline simulation */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">7-Day Inquiry Volume</span>
                <span className="text-emerald-600 font-bold">+28% vs last week</span>
              </div>
              <div className="h-6 flex items-end gap-1.5 pt-2">
                <div className="flex-1 bg-blue-300 h-2 rounded-t" />
                <div className="flex-1 bg-blue-400 h-3 rounded-t" />
                <div className="flex-1 bg-blue-400 h-3.5 rounded-t" />
                <div className="flex-1 bg-blue-500 h-4.5 rounded-t" />
                <div className="flex-1 bg-blue-500 h-4 rounded-t" />
                <div className="flex-1 bg-blue-600 h-5.5 rounded-t" />
                <div className="flex-1 bg-orange-500 h-6 rounded-t" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Avg match time: 42 mins</span>
              <span className="font-semibold text-slate-700">94% Fulfillment</span>
            </div>
          </div>

          {/* Card 2: Recommended Pricing */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>💡 Recommended Pricing</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
              <div className="text-[10px] uppercase font-bold text-blue-600">Optimal Daily Window</div>
              <div className="text-xl font-black text-slate-900">₹1,800 – ₹2,200</div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Based on 38 verified rental bookings of Sony A7 IV in New Delhi over the past 30 days.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Expected Monthly Earnings</span>
                <span className="font-extrabold text-slate-900">₹36,000 / month</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Calculated at an estimated 18 rental days per month with standard 48-hour turnarounds.
              </p>
            </div>
          </div>

          {/* Card 3: RENTO Shield Protection */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RENTO Shield Protection</span>
            </div>

            <div className="space-y-2.5 text-[11px] text-slate-600">
              <div>
                <strong className="text-slate-900 block font-semibold">Aadhaar & DigiLocker KYC</strong>
                <span>Every renter must undergo instant government ID verification prior to booking approval.</span>
              </div>
              <div>
                <strong className="text-slate-900 block font-semibold">360° Handover Video Scan</strong>
                <span>Our driver logs high-res photo timestamps of gear condition at delivery and return pickup.</span>
              </div>
              <div>
                <strong className="text-slate-900 block font-semibold">Escrow Deposit Buffer</strong>
                <span>Instant damage claim arbitration handled by RENTO in under 24 hours.</span>
              </div>
            </div>

            <button
              type="button"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
            >
              <span>Read Owner Protection Policy</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </div>

          {/* Card 4: Free Assisted Listing */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Free Assisted Listing</div>
                <div className="text-[10px] text-slate-500">Send pics on WhatsApp: +91 98110-RENTO</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('WhatsApp concierge connected at +91 98110-RENTO')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 shadow-xs"
            >
              Chat
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
