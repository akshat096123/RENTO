import React, { useState, useEffect } from 'react';
import {
  User,
  Product,
  RentalRequest,
  RequestOffer,
  Rental,
  DemandStat
} from './types';
import {
  fetchUsers,
  fetchProducts,
  fetchRequests,
  fetchRequest,
  fetchRentals,
  fetchRental,
  fetchDemandInsights,
  submitOffer,
  acceptOffer,
  extendRental
} from './api';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { PostAdDemandView } from './components/PostAdDemandView';
import { CategoryDetailView } from './components/CategoryDetailView';
import { DualDashboards } from './components/DualDashboards';
import { Footer } from './components/Footer';

// Interactive Modals
import { ProductDetailModal } from './components/ProductDetailModal';
import { PostRequestModal } from './components/PostRequestModal';
import { OfferComparisonModal } from './components/OfferComparisonModal';
import { DigitalAgreementModal } from './components/DigitalAgreementModal';
import { LogisticsTrackerModal } from './components/LogisticsTrackerModal';
import { ReturnInspectionModal } from './components/ReturnInspectionModal';
import { DisputeLockerModal } from './components/DisputeLockerModal';
import { RentoAIAssistant } from './components/RentoAIAssistant';
import { AuthModal } from './components/AuthModal';
import confetti from 'canvas-confetti';

export function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rento_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [demandStats, setDemandStats] = useState<DemandStat[]>([]);

  // Navigation View State
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'post_ad' | 'sound_lights' | 'rentals'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isPostRequestModalOpen, setIsPostRequestModalOpen] = useState(false);
  const [postRequestInitialPrompt, setPostRequestInitialPrompt] = useState('');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const [activeRequestForComparison, setActiveRequestForComparison] = useState<RentalRequest | null>(null);
  const [offersForComparison, setOffersForComparison] = useState<RequestOffer[]>([]);

  const [selectedRentalForLogistics, setSelectedRentalForLogistics] = useState<any>(null);
  const [selectedRentalForAgreement, setSelectedRentalForAgreement] = useState<any>(null);
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState<Rental | null>(null);
  const [selectedRentalForDispute, setSelectedRentalForDispute] = useState<any>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [uList, pList, rList, rentList, dInsights] = await Promise.all([
        fetchUsers(),
        fetchProducts(),
        fetchRequests(),
        fetchRentals(),
        fetchDemandInsights()
      ]);

      setUsers(uList);
      // Refresh current user data if logged in
      if (currentUser && uList.length > 0) {
        const refreshed = uList.find(u => u.id === currentUser.id);
        if (refreshed) {
          setCurrentUser(refreshed);
          localStorage.setItem('rento_user', JSON.stringify(refreshed));
        }
      }
      setProducts(pList);
      setRequests(rList);
      setRentals(rentList);
      setDemandStats(dInsights.topCategories);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rento_user');
    setCurrentUser(null);
  };

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    setActiveNavTab('home');
    fetchProducts('All', query).then(setProducts).catch(console.error);
  };

  const handleCategoryNavClick = (categoryName: string) => {
    if (
      categoryName.includes('Sound') ||
      categoryName.includes('Audio') ||
      categoryName.includes('AV') ||
      categoryName.includes('Projector') ||
      categoryName.includes('Event') ||
      categoryName.includes('Karaoke')
    ) {
      setActiveNavTab('sound_lights');
    } else {
      setActiveNavTab('home');
      fetchProducts(categoryName).then(setProducts).catch(console.error);
    }
  };

  const handleHeroPromptPost = (promptText: string) => {
    setPostRequestInitialPrompt(promptText);
    setIsPostRequestModalOpen(true);
  };

  const handleCatalogBookNow = async (product: Product, days: number) => {
    setSelectedProductForDetail(null);
    try {
      const reqRes = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          renter_id: currentUser?.id || 'usr_alice',
          raw_prompt: `Book ${product.title} for ${days} days`,
          category: product.category,
          budget_daily: product.daily_price,
          duration_days: days,
          location: currentUser?.city || 'Delhi NCR'
        })
      }).then(r => r.json());

      const offRes = await submitOffer(reqRes.request.id, {
        owner_id: product.owner_id,
        product_id: product.id,
        offered_price: product.daily_price,
        deposit: product.deposit,
        accessories: ['Standard Kit', 'Charger', 'Protective Case'],
        notes: 'Instant verified rental booking.'
      });

      await acceptOffer(offRes.offer.id);
      confetti({ particleCount: 100, spread: 70 });
      await loadAllData();
      setActiveNavTab('rentals');
    } catch (err: any) {
      alert('Error completing booking: ' + err.message);
    }
  };

  const handleOpenLogistics = async (rental: Rental) => {
    try {
      const full = await fetchRental(rental.id);
      setSelectedRentalForLogistics(full);
    } catch (err: any) {
      alert('Error loading logistics: ' + err.message);
    }
  };

  const handleOpenAgreement = async (rental: Rental) => {
    try {
      const full = await fetchRental(rental.id);
      setSelectedRentalForAgreement(full);
    } catch (err: any) {
      alert('Error loading agreement: ' + err.message);
    }
  };

  const handleOpenDispute = async (rental: Rental) => {
    try {
      const full = await fetchRental(rental.id);
      setSelectedRentalForDispute(full);
    } catch (err: any) {
      alert('Error loading dispute: ' + err.message);
    }
  };

  const handleExtendRental = async (rental: Rental) => {
    const daysStr = prompt('How many additional days would you like to extend? (e.g. 1 or 2)', '1');
    if (!daysStr) return;
    const days = parseInt(daysStr, 10);
    if (isNaN(days) || days <= 0) return;

    try {
      const res = await extendRental(rental.id, days);
      confetti({ particleCount: 60, spread: 50 });
      alert(res.message);
      loadAllData();
    } catch (err: any) {
      alert('Error extending rental: ' + err.message);
    }
  };

  const handleViewOffers = async (requestId: string) => {
    try {
      const data = await fetchRequest(requestId);
      setActiveRequestForComparison(data.request);
      setOffersForComparison(data.offers);
    } catch (err: any) {
      alert('Error loading offers: ' + err.message);
    }
  };

  const handleAcceptOffer = async (offer: RequestOffer) => {
    try {
      await acceptOffer(offer.id);
      confetti({ particleCount: 100, spread: 70 });
      setActiveRequestForComparison(null);
      await loadAllData();
      setActiveNavTab('rentals');
    } catch (err: any) {
      alert('Error accepting offer: ' + err.message);
    }
  };

  if (!currentUser) {
    return (
      <AuthModal
        users={users}
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          localStorage.setItem('rento_user', JSON.stringify(u));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Global Header */}
      <Header
        currentUser={currentUser}
        users={users}
        onSwitchUser={(u) => {
          setCurrentUser(u);
          localStorage.setItem('rento_user', JSON.stringify(u));
        }}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        onPostAdClick={() => setActiveNavTab('post_ad')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onCategoryClick={handleCategoryNavClick}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE (Matches Image 1) */}
        {activeNavTab === 'home' && (
          <HomeView
            products={products}
            onSelectProduct={(p) => setSelectedProductForDetail(p)}
            onPostRequestPrompt={handleHeroPromptPost}
            onNavigateToPostAd={() => setActiveNavTab('post_ad')}
            onNavigateToCategory={handleCategoryNavClick}
          />
        )}

        {/* VIEW 2: POST AD & DEMAND INTAKE (Matches Image 2) */}
        {activeNavTab === 'post_ad' && (
          <PostAdDemandView
            currentUser={currentUser}
            onBackToMarketplace={() => setActiveNavTab('home')}
            onProductCreated={(prod) => {
              setProducts(prev => [prod, ...prev]);
              setActiveNavTab('home');
            }}
            onRequestCreated={(req) => {
              setRequests(prev => [req, ...prev]);
              setActiveNavTab('rentals');
            }}
          />
        )}

        {/* VIEW 3: SOUND & LIGHTS / AV RENTALS (Matches Image 3) */}
        {activeNavTab === 'sound_lights' && (
          <CategoryDetailView
            onSelectProduct={(prod) => {
              // Map to standard product modal
              const mapped: Product = {
                id: prod.id,
                owner_id: 'usr_bob',
                title: prod.title,
                brand: 'Professional',
                model: prod.badge,
                category: 'Sound & Lights',
                description: prod.subtext,
                specs: JSON.stringify({ Inclusions: prod.chips.join(', ') }),
                daily_price: parseInt(prod.price.replace(/[^\d]/g, ''), 10) || 1500,
                deposit: 4000,
                condition_score: 96,
                condition_notes: 'Tested and calibrated with sound technician check.',
                images: JSON.stringify([prod.image]),
                serial_number: `SN-AV-${Math.floor(100000 + Math.random() * 900000)}`,
                authenticity_status: 'LOW_RISK',
                authenticity_notes: 'Commercial AV unit verified.',
                location: 'Delhi NCR',
                is_available: 1,
                owner_name: 'Bob Mehta (Pro Cine Gear)',
                owner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                owner_rating: 4.95
              };
              setSelectedProductForDetail(mapped);
            }}
            onRequestCustomQuote={() => handleHeroPromptPost('Custom staging, line arrays and DMX truss rig for college event')}
          />
        )}

        {/* VIEW 4: ACTIVE RENTALS, ESCROW & PORTER LOGISTICS */}
        {activeNavTab === 'rentals' && (
          <DualDashboards
            viewMode={currentUser.role === 'owner' ? 'owner_studio' : currentUser.role === 'both' ? 'logistics_portal' : 'dashboard'}
            currentUser={currentUser}
            rentals={rentals}
            requests={requests}
            products={products}
            demandStats={demandStats}
            onOpenLogistics={handleOpenLogistics}
            onOpenAgreement={handleOpenAgreement}
            onOpenReturn={(r) => setSelectedRentalForReturn(r)}
            onOpenDispute={handleOpenDispute}
            onOpenAddProduct={() => setActiveNavTab('post_ad')}
            onOpenPostRequest={() => handleHeroPromptPost('')}
            onViewOffers={handleViewOffers}
            onExtendRental={handleExtendRental}
          />
        )}

      </main>

      {/* Global Footer (Matches Image 1, 2, 3) */}
      <Footer />

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          className="p-3.5 rounded-full bg-slate-900 text-white shadow-2xl hover:bg-slate-800 transition flex items-center gap-2 border border-slate-700"
          title="RENTO AI Assistant"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold">Ask RENTO AI</span>
        </button>
      </div>

      <RentoAIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      {/* Interactive Modals */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          currentUser={currentUser}
          onClose={() => setSelectedProductForDetail(null)}
          onBookNow={handleCatalogBookNow}
        />
      )}

      {isPostRequestModalOpen && (
        <PostRequestModal
          currentUser={currentUser}
          initialPrompt={postRequestInitialPrompt}
          onClose={() => setIsPostRequestModalOpen(false)}
          onRequestCreated={(req) => {
            setRequests(prev => [req, ...prev]);
            setActiveNavTab('rentals');
          }}
        />
      )}

      {activeRequestForComparison && (
        <OfferComparisonModal
          request={activeRequestForComparison}
          offers={offersForComparison}
          currentUser={currentUser}
          onClose={() => setActiveRequestForComparison(null)}
          onAcceptOffer={handleAcceptOffer}
        />
      )}

      {selectedRentalForAgreement && (
        <DigitalAgreementModal
          rental={selectedRentalForAgreement.rental}
          agreement={selectedRentalForAgreement.agreement}
          onClose={() => setSelectedRentalForAgreement(null)}
        />
      )}

      {selectedRentalForLogistics && (
        <LogisticsTrackerModal
          rental={selectedRentalForLogistics.rental}
          logistics={selectedRentalForLogistics.logistics}
          currentUser={currentUser}
          onClose={() => setSelectedRentalForLogistics(null)}
          onRefreshRental={loadAllData}
        />
      )}

      {selectedRentalForReturn && (
        <ReturnInspectionModal
          rental={selectedRentalForReturn}
          currentUser={currentUser}
          onClose={() => setSelectedRentalForReturn(null)}
          onReturnCompleted={loadAllData}
          onOpenDispute={handleOpenDispute}
        />
      )}

      {selectedRentalForDispute && (
        <DisputeLockerModal
          rental={selectedRentalForDispute.rental}
          dispute={selectedRentalForDispute.dispute}
          currentUser={currentUser}
          onClose={() => setSelectedRentalForDispute(null)}
          onDisputeUpdated={loadAllData}
        />
      )}

    </div>
  );
}
