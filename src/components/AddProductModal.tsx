import React, { useState } from 'react';
import { User, Product } from '../types';
import { createProduct } from '../api';
import { X, Sparkles, ShieldCheck, Upload, Tag, IndianRupee, MapPin, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddProductModalProps {
  currentUser: User;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  currentUser,
  onClose,
  onProductCreated
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cameras');
  const [dailyPrice, setDailyPrice] = useState(1800);
  const [deposit, setDeposit] = useState(5000);
  const [location, setLocation] = useState('Delhi NCR');
  const [description, setDescription] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80');
  const [isScanningAI, setIsScanningAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<any>(null);

  const handleSimulateAIScan = (itemTitle: string) => {
    setIsScanningAI(true);
    setTimeout(() => {
      let detectedCat = 'Cameras';
      let brand = 'Sony';
      let model = 'Alpha 7 IV';
      let sweetPrice = 1800;
      let sweetDeposit = 5000;
      let condScore = 95;

      const lower = itemTitle.toLowerCase();
      if (lower.includes('drone') || lower.includes('dji')) {
        detectedCat = 'Drones';
        brand = 'DJI';
        model = 'Mini 4 Pro Fly More';
        sweetPrice = 2200;
        sweetDeposit = 6000;
      } else if (lower.includes('macbook') || lower.includes('apple') || lower.includes('laptop')) {
        detectedCat = 'Laptops';
        brand = 'Apple';
        model = 'MacBook Pro 16" M3 Max';
        sweetPrice = 2400;
        sweetDeposit = 10000;
      } else if (lower.includes('projector')) {
        detectedCat = 'Projectors';
        brand = 'Epson';
        model = 'Home Cinema 4010 4K';
        sweetPrice = 1600;
        sweetDeposit = 4500;
      } else if (lower.includes('speaker') || lower.includes('jbl') || lower.includes('audio')) {
        detectedCat = 'Audio';
        brand = 'JBL';
        model = 'PartyBox 310';
        sweetPrice = 1200;
        sweetDeposit = 3000;
      }

      setCategory(detectedCat);
      setDailyPrice(sweetPrice);
      setDeposit(sweetDeposit);
      if (!serialNumber) {
        setSerialNumber(`SN-${brand.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`);
      }
      if (!description) {
        setDescription(`Verified ${brand} ${model} in ${condScore}/100 certified condition. Ideal for professional creative use.`);
      }

      setAiScanResult({
        brand,
        model,
        category: detectedCat,
        conditionScore: condScore,
        authenticityStatus: 'LOW_RISK',
        recommendedPriceRange: {
          min: sweetPrice - 300,
          max: sweetPrice + 400,
          sweetSpot: sweetPrice,
          deposit: sweetDeposit
        }
      });
      setIsScanningAI(false);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await createProduct({
        owner_id: currentUser.id,
        title,
        brand: aiScanResult?.brand || 'Brand',
        model: aiScanResult?.model || title,
        category,
        description,
        daily_price: dailyPrice,
        deposit,
        location,
        serial_number: serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        images: JSON.stringify([imageUrl])
      });
      confetti({ particleCount: 70, spread: 60 });
      onProductCreated(res.product);
      onClose();
    } catch (err: any) {
      alert('Error creating listing: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">List Gear with AI Vision & Pricing</h3>
              <p className="text-xs text-slate-400">AI automatically recognizes your gear and recommends market pricing.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title with AI scan button */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Product Title or Model Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.length > 4 && !aiScanResult) {
                    handleSimulateAIScan(e.target.value);
                  }
                }}
                placeholder="E.g., Sony Alpha 7 IV or DJI Mini 4 Pro Drone"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleSimulateAIScan(title || 'Sony Camera')}
                className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-bold border border-slate-700 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isScanningAI ? 'Scanning...' : 'AI Scan'}</span>
              </button>
            </div>
          </div>

          {/* AI Scan Feedback Box */}
          {aiScanResult && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> AI Recognition Complete
                </span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20">
                  Certified: {aiScanResult.conditionScore}/100
                </span>
              </div>
              <div>Brand: <strong className="text-white">{aiScanResult.brand}</strong> • Category: <strong className="text-white">{aiScanResult.category}</strong></div>
              <div className="text-cyan-300">
                Recommended Price: <strong>₹{aiScanResult.recommendedPriceRange.min} – ₹{aiScanResult.recommendedPriceRange.max}/day</strong> (Sweet spot: ₹{aiScanResult.recommendedPriceRange.sweetSpot})
              </div>
            </div>
          )}

          {/* Category & Pricing Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="Cameras">Cameras</option>
                <option value="Drones">Drones</option>
                <option value="Laptops">Laptops</option>
                <option value="Projectors">Projectors</option>
                <option value="Audio">Audio</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Rental (₹)</label>
              <input
                type="number"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Security Deposit (₹)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Package details, what's included..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Listing Product...' : 'Publish Gear to Marketplace'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
