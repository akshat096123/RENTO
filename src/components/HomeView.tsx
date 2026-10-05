import React, { useState } from 'react';
import { Product } from '../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  Radio,
  Clock,
  Mic,
  DollarSign
} from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onPostRequestPrompt: (prompt: string) => void;
  onNavigateToPostAd: () => void;
  onNavigateToCategory: (categoryName: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onPostRequestPrompt,
  onNavigateToPostAd,
  onNavigateToCategory
}) => {
  const [heroPrompt, setHeroPrompt] = useState('');

  const curatedCategories = [
    { name: 'Projectors & AV', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150&auto=format&fit=crop&q=80' },
    { name: 'Cameras & Cine', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80' },
    { name: '6b1K Combos', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150&auto=format&fit=crop&q=80' },
    { name: 'Living Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80' },
    { name: 'Appliances', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=150&auto=format&fit=crop&q=80' },
    { name: 'Vehicles & Vans', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sound & Lights', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Workstations', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80' },
    { name: 'Karaoke & Event', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=80' },
    { name: 'Steal Deals', isDeal: true }
  ];

  const popularSearches = [
    'Sony FX3 Cinema Kit',
    '4K Laser Projector',
    'Double Bottle Suction',
    'Mahindra Marazzo van',
    'L-Shape Velvet Sofa'
  ];

  // Specific featured items matching Image 1
  const trendingItems = [
    {
      id: 'item_van',
      title: 'Mahindra Marazzo Car for Daily...',
      category: 'Vehicles & Fleet',
      tag: 'Self-Drive / Chauffeured',
      rating: 4.9,
      location: 'Gurugram & South Delhi (Instant Pick)',
      price: '₹3,000',
      period: '/ Day',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'item_medical',
      title: 'Double Bottle Suction Machine',
      category: 'Medical & Home Care',
      tag: 'Sanitized & Certified',
      rating: 5.0,
      location: 'Free Delivery in Noida / Ghaziabad',
      price: '₹1,500',
      period: '/ Month',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'item_sofa',
      title: 'Emerald Green Cushioned Sofa',
      category: 'Premium Furniture',
      tag: 'Pre-relocation',
      rating: 4.8,
      location: 'Deep Sanitized • Delhi NCR',
      price: '₹3,000',
      period: '/ Day',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'item_projector',
      title: 'Projector on Rent in Delhi NCR',
      category: 'Audio / Visual Gear',
      tag: 'Includes 100" Screen',
      rating: 4.9,
      location: '3200 Lumens • Connaught Place, NCR',
      price: '₹1,200',
      period: '/ Day',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'item_karaoke',
      title: 'Karaoke Machine in Delhi NCR',
      category: 'Party & Events',
      tag: '50k+ Hindi & Eng Tracks',
      rating: 4.7,
      location: 'Includes 2 Cordless Mics • Plug & Play',
      price: '₹1,500',
      period: '/ Day',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'item_pa',
      title: 'PA System on Rent in Delhi NCR',
      category: 'Live Sound Gear',
      tag: 'Technician Optional',
      rating: 4.9,
      location: '2000W RMS • Covers up to 400 guests',
      price: '₹2,500',
      period: '/ Day',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'item_ringlight',
      title: 'Digitek LED Ring Light for Daily...',
      category: 'Content Creation',
      tag: 'Ready in 60 Mins',
      rating: 4.6,
      location: 'Includes Remote + Tripod Stand',
      price: '₹200',
      period: '/ Day',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const getProductForTrendingItem = (itemId: string, fallbackData: any): Product => {
    const found = products.find(p => p.id === itemId);
    if (found) return found;
    return {
      id: itemId,
      owner_id: 'usr_aarav',
      title: fallbackData.title,
      brand: 'Verified Gear',
      model: fallbackData.category,
      category: fallbackData.category,
      description: `${fallbackData.title} available for instant rental in ${fallbackData.location}. Tested and verified by RENTO with refundable escrow deposit.`,
      specs: JSON.stringify({ Details: fallbackData.tag, Location: fallbackData.location }),
      daily_price: parseInt(fallbackData.price.replace(/[^\d]/g, ''), 10) || 1500,
      deposit: 4000,
      condition_score: 98,
      condition_notes: 'Inspected and certified in top operating condition.',
      images: JSON.stringify([fallbackData.image]),
      serial_number: `SN-${itemId.toUpperCase()}`,
      authenticity_status: 'LOW_RISK',
      authenticity_notes: 'Item verified with owner.',
      location: fallbackData.location,
      is_available: 1,
      owner_name: 'Aarav Sharma',
      owner_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      owner_rating: 4.95
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER WITH PHONE MOCKUP (Exact Match to Image 1)                 */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-r from-[#d9531e] via-[#ea580c] to-[#c2410c] text-white p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Smartphone Mockup showing RENTO LIVE AI */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[280px] sm:w-[310px] bg-slate-950 p-3.5 rounded-[40px] shadow-2xl border-4 border-slate-900 relative">
              {/* Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3" />

              {/* Screen Content */}
              <div className="bg-[#0b1329] rounded-[28px] p-4 text-slate-100 space-y-3 border border-slate-800/80 font-sans">
                
                {/* Screen Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-tight">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>RENTO LIVE AI</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    ● LIVE BIDS
                  </span>
                </div>

                {/* Request Card */}
                <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-amber-400">NEW REQUEST #8492</span>
                    <span>2m ago</span>
                  </div>
                  <div className="font-extrabold text-sm text-white">Sony FX3 + 16-35mm GM Kit</div>
                  <div className="text-[11px] text-slate-400">Dwarka Sector 12 • 5 Days Rental</div>
                </div>

                {/* Incoming Supplier Bids */}
                <div className="space-y-2">
                  <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-[11px]">LensCraft Studio</div>
                      <div className="text-[10px] text-slate-400">1.8 km away • ⭐ 4.9</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                      ₹2,800/d
                    </span>
                  </div>

                  <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-[11px]">Delhi AV Gear Hub</div>
                      <div className="text-[10px] text-slate-400">4.2 km away • ⭐ 4.8</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-extrabold text-xs">
                      ₹3,000/d
                    </span>
                  </div>
                </div>

                {/* Phone CTA Button */}
                <button
                  onClick={() => onNavigateToPostAd()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md transition hover:opacity-95"
                >
                  Accept Lowest Bid (Escrow Protected)
                </button>

              </div>
            </div>
          </div>

          {/* Right: Headline, Subtext, Search Box & Popular Pills */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[11px] font-bold tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>DELHI NCR'S 1ST AI DEMAND-DRIVEN SUPERMARKET</span>
            </div>

            {/* Huge Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-tight">
              Can't find it listed?<br />
              Just request it. Verified owners bid in minutes.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-orange-100/90 max-w-xl font-normal leading-relaxed">
              From 4K laser projectors and luxury weddings sofas to cinema lenses and commercial vans — broadcast what you need or pick from 2,500+ verified items ready for instant Porter drop.
            </p>

            {/* Request / Search Box */}
            <div className="pt-2">
              <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl">
                <div className="flex items-center gap-2.5 flex-1 px-3 py-2 w-full">
                  <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                  <input
                    type="text"
                    value={heroPrompt}
                    onChange={(e) => setHeroPrompt(e.target.value)}
                    placeholder="Looking for 4K projector and 120-inch screen for IPL match..."
                    className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => onPostRequestPrompt(heroPrompt || '4K projector and 120-inch screen')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
                >
                  <span>Post Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Popular Searches Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-orange-200">Popular Searches:</span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onPostRequestPrompt(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-medium transition"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RENT BY CATEGORY (Curated Inventories)                                */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase font-bold text-blue-600 tracking-wider">
              CURATED INVENTORIES
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Rent by Category
            </h2>
          </div>

          <button 
            onClick={() => onNavigateToCategory('All Equipment')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>Explore All 24 Hubs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 10 Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-3">
          {curatedCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onNavigateToCategory(cat.name)}
              className="bg-white rounded-2xl p-2.5 border border-slate-200 hover:border-orange-400 hover:shadow-md transition cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              {cat.isDeal ? (
                <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-2 group-hover:scale-105 transition">
                  <Flame className="w-7 h-7 fill-rose-500" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 mb-2 group-hover:scale-105 transition">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
              )}
              <span className={`text-[11px] font-bold line-clamp-1 ${cat.isDeal ? 'text-rose-600' : 'text-slate-800 group-hover:text-orange-600'}`}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TRENDING RENTAL PRODUCTS IN DELHI NCR (Grid with Owner Monetization)   */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Trending Rental Products in Delhi NCR
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                420+ Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant booking, refundable escrow deposit, verified owner inspection
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Mahindra Marazzo */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trendingItems[0].image} alt={trendingItems[0].title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold">
                  {trendingItems[0].tag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-white/90 text-amber-500 text-[10px] font-bold flex items-center gap-0.5 shadow">
                  <Star className="w-3 h-3 fill-amber-400" /> {trendingItems[0].rating}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase font-bold text-blue-600">{trendingItems[0].category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{trendingItems[0].title}</h3>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{trendingItems[0].location}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-slate-900">{trendingItems[0].price}</span>
                <span className="text-xs text-slate-500">{trendingItems[0].period}</span>
              </div>
              <button 
                onClick={() => onSelectProduct(getProductForTrendingItem(trendingItems[0].id, trendingItems[0]))}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Card 2: Medical Suction */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trendingItems[1].image} alt={trendingItems[1].title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                  {trendingItems[1].tag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-white/90 text-amber-500 text-[10px] font-bold flex items-center gap-0.5 shadow">
                  <Star className="w-3 h-3 fill-amber-400" /> {trendingItems[1].rating}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase font-bold text-blue-600">{trendingItems[1].category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{trendingItems[1].title}</h3>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{trendingItems[1].location}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-slate-900">{trendingItems[1].price}</span>
                <span className="text-xs text-slate-500">{trendingItems[1].period}</span>
              </div>
              <button 
                onClick={() => onSelectProduct(getProductForTrendingItem(trendingItems[1].id, trendingItems[1]))}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Card 3: Sofa */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trendingItems[2].image} alt={trendingItems[2].title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                  {trendingItems[2].tag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-white/90 text-amber-500 text-[10px] font-bold flex items-center gap-0.5 shadow">
                  <Star className="w-3 h-3 fill-amber-400" /> {trendingItems[2].rating}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase font-bold text-blue-600">{trendingItems[2].category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{trendingItems[2].title}</h3>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{trendingItems[2].location}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-slate-900">{trendingItems[2].price}</span>
                <span className="text-xs text-slate-500">{trendingItems[2].period}</span>
              </div>
              <button 
                onClick={() => onSelectProduct(getProductForTrendingItem(trendingItems[2].id, trendingItems[2]))}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Owner Monetization Card (Deep Blue) */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-extrabold text-sky-200 tracking-wider">
                <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                <span>OWNER MONETIZATION</span>
              </div>
              <h3 className="text-lg font-black mt-2 leading-snug">
                Got Idle Equipment at Home or Office?
              </h3>
              <p className="text-xs text-sky-100 mt-2 leading-relaxed">
                Delhi NCR renters are searching for cameras, projectors, sound gear & commercial vans right now. List free and start earning.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <div className="bg-sky-950/40 border border-sky-400/30 rounded-xl p-2.5 text-center text-xs">
                <span className="text-sky-200 block text-[10px]">Average Lender Earnings</span>
                <span className="text-base font-black text-amber-300">₹28,500/mo</span>
              </div>

              <button
                onClick={onNavigateToPostAd}
                className="w-full py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs shadow-md transition"
              >
                List Your Gear + Earn Revenue
              </button>
            </div>
          </div>

          {/* Card 4: Projector */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trendingItems[3].image} alt={trendingItems[3].title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold">
                  {trendingItems[3].tag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-white/90 text-amber-500 text-[10px] font-bold flex items-center gap-0.5 shadow">
                  <Star className="w-3 h-3 fill-amber-400" /> {trendingItems[3].rating}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase font-bold text-blue-600">{trendingItems[3].category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{trendingItems[3].title}</h3>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{trendingItems[3].location}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-slate-900">{trendingItems[3].price}</span>
                <span className="text-xs text-slate-500">{trendingItems[3].period}</span>
              </div>
              <button 
                onClick={() => onSelectProduct(getProductForTrendingItem(trendingItems[3].id, trendingItems[3]))}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Card 5: Karaoke */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trendingItems[4].image} alt={trendingItems[4].title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold">
                  {trendingItems[4].tag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-white/90 text-amber-500 text-[10px] font-bold flex items-center gap-0.5 shadow">
                  <Star className="w-3 h-3 fill-amber-400" /> {trendingItems[4].rating}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase font-bold text-blue-600">{trendingItems[4].category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{trendingItems[4].title}</h3>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{trendingItems[4].location}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-slate-900">{trendingItems[4].price}</span>
                <span className="text-xs text-slate-500">{trendingItems[4].period}</span>
              </div>
              <button 
                onClick={() => onSelectProduct(getProductForTrendingItem(trendingItems[4].id, trendingItems[4]))}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Card 6: PA System */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trendingItems[5].image} alt={trendingItems[5].title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                  {trendingItems[5].tag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-white/90 text-amber-500 text-[10px] font-bold flex items-center gap-0.5 shadow">
                  <Star className="w-3 h-3 fill-amber-400" /> {trendingItems[5].rating}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase font-bold text-blue-600">{trendingItems[5].category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{trendingItems[5].title}</h3>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{trendingItems[5].location}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-slate-900">{trendingItems[5].price}</span>
                <span className="text-xs text-slate-500">{trendingItems[5].period}</span>
              </div>
              <button 
                onClick={() => onSelectProduct(getProductForTrendingItem(trendingItems[5].id, trendingItems[5]))}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Card 7: Ring Light */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={trendingItems[6].image} alt={trendingItems[6].title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                  {trendingItems[6].tag}
                </div>
                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-white/90 text-amber-500 text-[10px] font-bold flex items-center gap-0.5 shadow">
                  <Star className="w-3 h-3 fill-amber-400" /> {trendingItems[6].rating}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase font-bold text-blue-600">{trendingItems[6].category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{trendingItems[6].title}</h3>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{trendingItems[6].location}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-extrabold text-slate-900">{trendingItems[6].price}</span>
                <span className="text-xs text-slate-500">{trendingItems[6].period}</span>
              </div>
              <button 
                onClick={() => onSelectProduct(getProductForTrendingItem(trendingItems[6].id, trendingItems[6]))}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Rent Now
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CAN'T FIND WHAT YOU NEED? WE CREATE THE SUPPLY (Exact match to Image 1)*/}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-blue-50/60 border border-blue-100 p-6 sm:p-10 text-center space-y-8">
        
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>POWERED BY NEURAL MATCHMAKER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Can't find what you need? We create the supply.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
            Ordinary rental stores only show static inventory. RENTO activates verified local owners, rental houses, and vendors across your city to fulfill any custom equipment requirement.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Card 01 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-extrabold text-xs flex items-center justify-center mb-3">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Post in Plain Language</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Describe what you need, your dates, and budget. No long forms or complex catalog navigation.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" />
              <span>Voice requests supported</span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-extrabold text-xs flex items-center justify-center mb-3">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Verified Owners Bid</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Nearby verified owners review your requirement and submit competing quotes with equipment specs within minutes.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-semibold text-orange-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Avg response: 3.4 minutes</span>
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-extrabold text-xs flex items-center justify-center mb-3">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Safe Escrow & Porter Dispatch</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Money stays locked safely in escrow until you inspect and test the gear. Porter fleet pickup and returns.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-semibold text-purple-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Damage Protected</span>
            </div>
          </div>

        </div>

        {/* Live Delhi NCR Activity Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-blue-200/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Delhi NCR Activity: 842 custom equipment orders matched and fulfilled in last 48 hours</span>
          </div>

          <button
            onClick={onNavigateToPostAd}
            className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs shadow-md transition whitespace-nowrap"
          >
            Broadcast a Custom Gear Need
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. TRUST PILLARS GRID (4 Clean Cards)                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Porter Express Network</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Same-day GPS tracked doorstep pickup and drop across Delhi NCR, Bengaluru & Mumbai.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">RBI Escrow Vault</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Security deposits stay in regulated safe custody. Released instantly on rental completion.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">AI Condition Check</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Timestamped video inspection before handoff ensures no disputes on return condition.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Aadhaar + GST Verified</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Every equipment lender and renter is KYC-verified with real ratings and reviews.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
