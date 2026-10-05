import React, { useState } from 'react';
import { Product } from '../types';
import {
  MapPin,
  Sparkles,
  Zap,
  Star,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Headphones,
  Sliders,
  ChevronDown,
  ArrowRight,
  Tv,
  Mic,
  Volume2,
  Sun,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CategoryDetailViewProps {
  onSelectProduct: (p: any) => void;
  onRequestCustomQuote: () => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  onSelectProduct,
  onRequestCustomQuote
}) => {
  const [activeFilter, setActiveFilter] = useState('All Equipment');
  const [guestCount, setGuestCount] = useState<'50-100' | '100-300' | '500+'>('100-300');
  const [venueStyle, setVenueStyle] = useState<'Indoor Banquet' | 'Open Lawn / Farm'>('Indoor Banquet');

  const subFilters = [
    { name: 'All Equipment (48 Units)', id: 'All Equipment', icon: Sliders },
    { name: 'Projectors (14 Rigs)', id: 'Projectors', icon: Tv },
    { name: 'Karaoke Sets (8 Kits)', id: 'Karaoke Sets', icon: Mic },
    { name: 'PA Speakers (11 Rigs)', id: 'PA Speakers', icon: Volume2 },
    { name: 'PAR & Beams (9 Rigs)', id: 'PAR & Beams', icon: Sun },
    { name: 'Boardroom Mics (4 Sets)', id: 'Boardroom Mics', icon: Headphones },
    { name: 'LED Video Walls (2 Modular)', id: 'LED Video Walls', icon: Video }
  ];

  const avProducts = [
    {
      id: 'av_proj',
      title: 'Commercial 4K Cinema Projector',
      category: 'PROJECTORS & SCREENS',
      badge: '4K UHD CINEMA',
      subtext: '3200 ANSI Lumens, HDR10 compliant. Includes 10m high-speed HDMI 2.1 cable and collapsible 120-inch floor pull-up...',
      chips: ['3200 Lumens', 'HDMI & Screen', 'Tripod Mount'],
      price: '₹1,200',
      period: '/ day',
      rating: 4.9,
      reviews: 28,
      locationTag: 'Near Noida & Gurugram',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'av_karaoke',
      title: 'Dual Tower Karaoke Party Rig',
      category: 'PARTY KARAOKE SETS',
      badge: 'PARTY FAVORITE',
      subtext: '800W RMS party tower with bluetooth, echo controls, 2 UHF wireless microphones, and pre-loaded Hindi/English karaoke...',
      chips: ['2 Wireless Mics', '10k Tracks', 'Bass Boost'],
      price: '₹1,500',
      period: '/ day',
      rating: 4.8,
      reviews: 64,
      locationTag: 'Plug & Play',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'av_pa',
      title: 'Concert Active PA Speaker System',
      category: 'PA SPEAKER SYSTEMS',
      badge: 'STAGE PRO GRADE',
      subtext: '2000W Peak bi-amplified output (dual 15" tops), Yamaha MG10XU mixing console, auxiliary cabling, and heavy-duty...',
      chips: ['2000W Peak', 'Yamaha Mixer', 'For 250+ Guests'],
      price: '₹2,500',
      period: '/ day',
      rating: 5.0,
      reviews: 92,
      locationTag: 'Technician Included',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'av_lights',
      title: 'Stage Mood Lighting & DMX Rig',
      category: 'STAGE BEAMS & LIGHTS',
      badge: 'STAGE LIGHTING',
      subtext: '8x 54-LED RGBW PAR cans with T-stands, 1 motorized Sharpy moving headlight, sound-activated strobe presets, and...',
      chips: ['8x RGB Cans', 'Moving Head Beam', 'Sound Reactive'],
      price: '₹3,200',
      period: '/ day',
      rating: 4.7,
      reviews: 45,
      locationTag: 'DMX Controller Incl.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'av_mic',
      title: 'Corporate Gooseneck Mic System',
      category: 'BOARDROOM AUDIO',
      badge: 'CORPORATE READY',
      subtext: '6 delegate push-to-talk condenser stations, 1 chairman priority unit, anti-feedback digital matrix processor, and XLR...',
      chips: ['6 Delegate Stations', 'Chairman Override', 'DSP Processor'],
      price: '₹2,000',
      period: '/ day',
      rating: 4.9,
      reviews: 29,
      locationTag: 'Zero Echo DSP',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'av_ledwall',
      title: 'Outdoor High-Def LED Display Wall',
      category: 'VIDEO WALLS',
      badge: 'MEGA DISPLAY',
      subtext: 'P2.9 ultra-fine pixel pitch, 10x8 ft modular aluminum truss frame, Novastar video switcher, and daylight-readable 4500...',
      chips: ['P2.9 Fine Pitch', '4500 Nits Outdoor', 'Novastar Control'],
      price: '₹7,500',
      period: '/ day',
      rating: 5.0,
      reviews: 18,
      locationTag: 'Riggers Included',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Dynamic calculation for event size estimator
  const recommendedPrice = guestCount === '50-100'
    ? '₹2,499/d'
    : guestCount === '100-300'
    ? '₹3,999/d'
    : '₹8,499/d';

  const recommendedCombo = guestCount === '50-100'
    ? 'Compact PA + 2 Cordless Mics + 1080p Screen'
    : guestCount === '100-300'
    ? 'Dual PA + 4 RGB PAR + 4K Cinema Cast'
    : 'Quad Concert Arrays + 8 DMX Sharpy + Truss Rig';

  const handleApplyCombo = () => {
    confetti({ particleCount: 70, spread: 60 });
    alert(`Applied Recommended Package: "${recommendedCombo}" at ${recommendedPrice} with Porter setup.`);
  };

  const filteredProducts = activeFilter === 'All Equipment'
    ? avProducts
    : avProducts.filter(p => {
        const f = activeFilter.toLowerCase();
        const cat = p.category.toLowerCase();
        const title = p.title.toLowerCase();
        if (f.includes('projector')) return cat.includes('projector') || title.includes('projector');
        if (f.includes('karaoke')) return cat.includes('karaoke') || title.includes('karaoke');
        if (f.includes('pa speaker') || f.includes('speaker')) return cat.includes('pa') || title.includes('pa') || title.includes('speaker');
        if (f.includes('par') || f.includes('beam') || f.includes('light')) return cat.includes('light') || cat.includes('beam') || title.includes('lighting') || title.includes('light');
        if (f.includes('mic')) return cat.includes('boardroom') || cat.includes('audio') || title.includes('mic');
        if (f.includes('video') || f.includes('wall') || f.includes('led')) return cat.includes('video') || title.includes('led') || title.includes('wall');
        return true;
      });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Top Banner & Header (Exact match to Image 3) */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>SERVING DELHI NCR (NOIDA, GURUGRAM, CENTRAL, SOUTH & WEST DELHI)</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Stage Sound, Event Lights & Audiovisual Rentals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1.5 leading-relaxed">
              Browse pro audio rigs, PA systems, stage beam lights, party karaoke boxes, and high lumen projectors available across Delhi NCR with on-site technician and Porter dispatch.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">AVERAGE NCR DISPATCH</div>
              <div className="text-xs font-extrabold text-slate-900">Within 2 Hours</div>
              <div className="text-[10px] text-emerald-600 font-medium">Technician & Sound Check Included</div>
            </div>
          </div>
        </div>
      </div>

      {/* AV Equipment Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">AV EQUIPMENT CATEGORIES</span>
          <button className="text-blue-600 font-bold hover:underline">Explore All 46 Units ➔</button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {subFilters.map((sub) => {
            const isSelected = activeFilter === sub.id;
            const Icon = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveFilter(sub.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${isSelected ? 'bg-slate-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-bar Filter & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span>Available For Rent In:</span>
          <button className="font-bold text-slate-900 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
            Delhi NCR (Same Day) <ChevronDown className="w-3 h-3" />
          </button>
          <span className="text-slate-400 hidden sm:inline">• Free delivery & acoustic technician setup on orders &gt; ₹3,000</span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-slate-400">SORT:</span>
          <button className="font-bold text-slate-800 flex items-center gap-1">
            Popular for Events & Weddings <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Products Grid (Filtered Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                  {prod.badge}
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-medium backdrop-blur">
                  {prod.locationTag}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span>{prod.category}</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{prod.rating}</span>
                    <span className="text-slate-400">({prod.reviews})</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{prod.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{prod.subtext}</p>

                {/* Specs Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prod.chips.map((chip, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Daily Rental Rate</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-extrabold text-slate-900">{prod.price}</span>
                  <span className="text-xs text-slate-500">{prod.period}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectProduct(prod)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <span>Rent Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* Interactive Event Size Estimator Box (Exact match to Image 3)             */}
      {/* ========================================================================= */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Info */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">EVENT SIZE ESTIMATOR</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Not sure what wattage or projector lumens you need?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your guest count and venue type. RENTO's automated audio-visual algorithm configures the optimal sound reinforcement and beam lumens instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Acoustics Check
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Porter Van Transport
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Sound Engineer
              </span>
            </div>
          </div>

          {/* Right Interactive Controls */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
            
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">EXPECTED ATTENDANCE</span>
              <div className="grid grid-cols-3 gap-2">
                {(['50-100', '100-300', '500+'] as const).map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGuestCount(count)}
                    className={`py-1.5 rounded-lg font-bold text-xs transition ${guestCount === count ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {count === '500+' ? '500+ Fest' : count}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">VENUE STYLE</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Indoor Banquet', 'Open Lawn / Farm'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setVenueStyle(style)}
                    className={`py-1.5 rounded-lg font-bold text-xs transition ${venueStyle === style ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Recommended Package</span>
                <span className="font-extrabold text-slate-900 text-xs">{recommendedCombo}</span>
              </div>
              <span className="text-base font-black text-slate-900">{recommendedPrice}</span>
            </div>

            <button
              onClick={handleApplyCombo}
              className="w-full py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>Apply Recommended Combo</span>
              <Zap className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>

      {/* Bespoke Staging Quote Dark Banner */}
      <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-extrabold text-blue-400 tracking-wider">
            BESPOKE STAGING & TOURING CONSOLES
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Need custom staging or lighting specifications for your wedding, college fest, or concert?
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Post a custom AV requirement and get competitive bids from verified Delhi NCR sound engineers within 15 minutes. Includes line arrays, DMX truss towers, smoke hazers, and power generators.
          </p>
        </div>

        <button
          onClick={onRequestCustomQuote}
          className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs sm:text-sm shadow-md transition whitespace-nowrap shrink-0"
        >
          Request Custom Staging Quote
        </button>
      </div>

      {/* 3 Pillars Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Doorstep Setup & Porter Logistics</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Direct dispatch in dedicated closed-body Porter vans. Safe loading, doorstep unpacking, and post-event retrieval.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">RBI-Compliant Security Escrow</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Zero cash handling. Security deposits held in zero-interest legal escrow and released within 24 hours of post-event pickup.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Audio Technician on Standby</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Certified stage sound engineers assist with wire routing, wireless mic channel sync, mixer equalization, and soundcheck.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
