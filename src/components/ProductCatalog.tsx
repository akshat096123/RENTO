import React, { useState } from 'react';
import { Product } from '../types';
import { ShieldCheck, Sparkles, MapPin, Star, PlusCircle, CheckCircle2 } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onPostRequest: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onPostRequest,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch
}) => {
  const categories = ['All', 'Cameras', 'Drones', 'Laptops', 'Projectors', 'Audio'];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Pills & Active Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${selectedCategory === cat ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Filtered by: <strong className="text-white">"{searchQuery}"</strong></span>
            <button onClick={onClearSearch} className="text-emerald-400 hover:underline font-medium">Clear</button>
          </div>
        )}
      </div>

      {/* Demand First Banner on Search: "Can't find what you need? POST A REQUEST" */}
      <div className="my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Can’t find what you need or want a specific bundle?
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Demand Creates Supply</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Don’t settle for unavailable gear. Post a custom rental request with your dates and budget. RENTO AI instantly matches and notifies registered local owners who can supply it!
            </p>
          </div>
        </div>

        <button
          onClick={onPostRequest}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Request</span>
        </button>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-lg font-medium text-slate-300">No listed products match this exact search.</p>
          <p className="text-xs text-slate-400 mt-1">This is where RENTO excels! Post your request and suppliers will bid to provide it.</p>
          <button
            onClick={onPostRequest}
            className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Rental Request</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            let images: string[] = [];
            try {
              images = JSON.parse(product.images);
            } catch {
              images = ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'];
            }

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-500/5 transition cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      Condition: {product.condition_score}/100
                    </span>

                    <span className="px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      Authentic
                    </span>
                  </div>

                  {/* Location badge on bottom */}
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{product.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                      <span>{product.brand}</span>
                      <span className="text-emerald-400 font-semibold">{product.category}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                      {product.title}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-white">
                        ₹{product.daily_price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400">/day</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Deposit: ₹{product.deposit.toLocaleString()} (Escrow)
                      </div>
                    </div>

                    {/* Owner Mini Avatar */}
                    <div className="flex items-center gap-2">
                      <img
                        src={product.owner_avatar}
                        alt={product.owner_name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div className="text-right">
                        <div className="text-[11px] font-semibold text-white truncate max-w-[90px]">
                          {product.owner_name?.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-amber-400 flex items-center gap-0.5 justify-end">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.owner_rating || 5.0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
