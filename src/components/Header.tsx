import React, { useState } from 'react';
import { User } from '../types';
import { Search, MapPin, Mic, Plus, ChevronDown, Check, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  onPostAdClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onCategoryClick: (categoryName: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  onSwitchUser,
  activeNavTab,
  setActiveNavTab,
  onPostAdClick,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onCategoryClick,
  onLogout
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('New Delhi / NCR');
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  const subCategories = [
    'Projectors & AV',
    'Cameras & Lenses',
    'Furniture & Combos',
    'Appliances',
    'Vehicles & Transport',
    'Laptops & Computing',
    'Sound & Lights',
    'Event Equipment'
  ];

  const cities = [
    'New Delhi / NCR',
    'Bengaluru',
    'Mumbai / MMR',
    'Hyderabad',
    'Pune',
    'Chennai'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Deliver-To */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Logo */}
            <div 
              onClick={() => setActiveNavTab('home')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shadow-xs">
                <span className="text-white font-black text-lg tracking-tighter">R</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">RENTO</span>
            </div>

            {/* Deliver To Pill */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <div className="leading-tight">
                  <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">DELIVER TO</div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    {selectedCity}
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              </button>

              {isLocationOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsLocationOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit(searchQuery);
              }}
              className="relative flex items-center"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try - 21 seater van, Sony A7 IV, projector, sofa"
                className="w-full pl-9 pr-10 py-2 rounded-full bg-slate-100/90 border border-slate-200 focus:border-orange-500 focus:bg-white focus:outline-none text-xs text-slate-800 placeholder-slate-400 transition"
              />
              <button 
                type="button"
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Navigation & CTA */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-700">
              <button 
                onClick={() => setActiveNavTab('home')}
                className={`hover:text-orange-600 transition ${activeNavTab === 'home' ? 'text-orange-600' : ''}`}
              >
                Products
              </button>
              <button 
                onClick={() => setActiveNavTab('sound_lights')}
                className={`hover:text-orange-600 transition ${activeNavTab === 'sound_lights' ? 'text-orange-600' : ''}`}
              >
                Services
              </button>
              <button 
                onClick={() => setActiveNavTab('rentals')}
                className={`hover:text-orange-600 transition ${activeNavTab === 'rentals' ? 'text-orange-600' : ''}`}
              >
                Rent
              </button>
              <button 
                onClick={() => setActiveNavTab('home')}
                className="hover:text-orange-600 transition text-slate-500"
              >
                Buy
              </button>
            </nav>

            {/* Post Ad Button (Orange) */}
            <button
              onClick={onPostAdClick}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs hover:shadow transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Post Ad</span>
            </button>

            {/* User Profile / Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-orange-400 transition"
                title={`Active: ${currentUser.name} (${currentUser.role})`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                />
              </button>

              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-3.5 py-1 border-b border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona / Test Role</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 capitalize">{currentUser.role} • {currentUser.city}</div>
                  </div>
                  <div className="mt-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left flex items-center gap-2.5 text-xs hover:bg-slate-50 transition ${u.id === currentUser.id ? 'bg-orange-50/70 text-orange-600 font-semibold' : 'text-slate-700'}`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate">
                          <span className="font-semibold">{u.name}</span>
                          <span className="text-[10px] text-slate-400 ml-1">({u.role})</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsPersonaOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition rounded-b-xl"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch Demo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Subcategory Navigation Row */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 scrollbar-none text-[11.5px] font-medium text-slate-600">
            {subCategories.map((cat) => {
              const isSelected = (cat === 'Sound & Lights' && activeNavTab === 'sound_lights');
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryClick(cat)}
                  className={`whitespace-nowrap transition hover:text-slate-900 ${isSelected ? 'text-blue-600 font-bold px-2 py-0.5 rounded bg-blue-50' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </header>
  );
};
