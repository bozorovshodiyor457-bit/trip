import React, { useState } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import SearchBar from './components/SearchBar';
import TourCard from './components/TourCard';
import SearchPage from './pages/SearchPage';
import TourDetailsPage from './pages/TourDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import MyTripsPage from './pages/MyTripsPage';
import ChatPage from './pages/ChatPage';
import CustomTourPage from './pages/CustomTourPage';
import SupportPage from './pages/SupportPage';
import ProfilePage from './pages/ProfilePage';
import SeoDestinationPage from './pages/SeoDestinationPage';
import PartnersPage from './pages/PartnersPage';

// Mock Data for Home Page Collections
const MOCK_COLLECTIONS = [
  { id: 'popular', title: "Mashhur yo'nalishlar" },
  { id: 'upcoming', title: "Yaqin kunlardagi safarlar" },
  { id: 'seasonal', title: "Mavsumiy turlar (Kuz)" },
  { id: 'discounts', title: "Aksiyalar va chegirmalar" },
];

const MOCK_TOURS = [
  {
    id: 1,
    title: "Afsonaviy Samarqand bo'ylab sayohat",
    location: "Samarqand, O'zbekiston",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    rating: 4.9,
    priceUZS: 450000,
    duration: "2 kun",
    collectionId: 'popular'
  },
  {
    id: 2,
    title: "Eski Buxoro ko'chalari",
    location: "Buxoro, O'zbekiston",
    image: "https://images.unsplash.com/photo-1584639906659-450f681a8c51?w=800&q=80",
    rating: 4.8,
    priceUZS: 520000,
    duration: "3 kun",
    collectionId: 'popular'
  },
  {
    id: 3,
    title: "Ichan Qal'a - Ochiq osmon ostidagi muzey",
    location: "Xiva, Xorazm",
    image: "https://images.unsplash.com/photo-1627993077749-f0275815ea7f?w=800&q=80",
    rating: 4.9,
    priceUZS: 650000,
    duration: "3 kun",
    collectionId: 'popular'
  },
  {
    id: 4,
    title: "Zomin tog'lari bo'ylab kemping",
    location: "Zomin, Jizzax",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    rating: 4.7,
    priceUZS: 320000,
    duration: "1 kun",
    collectionId: 'upcoming'
  },
];

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState('popular');
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'search' | 'details' | 'favorites' | 'checkout' | 'mytrips' | 'chat' | 'custom' | 'support' | 'profile' | 'seo' | 'partners'

  const filteredTours = MOCK_TOURS.filter(t => t.collectionId === activeCollection) || [];
  const displayTours = filteredTours.length > 0 ? filteredTours : MOCK_TOURS;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onLogoClick={() => setCurrentView('home')}
        onNavClick={(route) => setCurrentView(route)}
      />
      
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative px-4 pt-20 pb-28 sm:px-6 lg:px-8 bg-neutral-50/50">
              <div className="mx-auto max-w-7xl text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl mb-6">
                  O'zbekiston kashf etilishini kutmoqda
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-neutral-500 mb-12">
                  Visitca Trip — O'zbekiston bo'ylab eng yaxshi turlar, mehmonxonalar va sarguzashtlarni topish va band qilish uchun ishonchli hamrohingiz.
                </p>
                
                {/* When Search is clicked in SearchBar, we can mock navigation */}
                <div onClick={() => setCurrentView('search')}>
                  <SearchBar />
                </div>
                
                <p className="mt-6 text-sm text-neutral-400">
                  (Qidiruv paneliga bosib "C-03: Qidiruv" ga, Pastdagi istalgan turga bosib "C-05: Tur tafsilotlari" ga o'ting)
                </p>
              </div>
            </section>

            {/* Collections Section */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
                {MOCK_COLLECTIONS.map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => setActiveCollection(collection.id)}
                    className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                      activeCollection === collection.id 
                        ? 'bg-neutral-900 text-white shadow-md' 
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {collection.title}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayTours.map((tour) => (
                  <div key={tour.id} onClick={() => setCurrentView('details')}>
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        
        {currentView === 'search' && <SearchPage />}
        {currentView === 'details' && <TourDetailsPage onBookClick={() => setCurrentView('checkout')} />}
        {currentView === 'favorites' && <FavoritesPage />}
        {currentView === 'checkout' && <CheckoutPage onBack={() => setCurrentView('details')} />}
        {currentView === 'mytrips' && <MyTripsPage />}
        {currentView === 'chat' && <ChatPage />}
        {currentView === 'custom' && <CustomTourPage />}
        {currentView === 'support' && <SupportPage />}
        {currentView === 'profile' && <ProfilePage />}
        {currentView === 'seo' && <SeoDestinationPage />}
        {currentView === 'partners' && <PartnersPage />}
      </main>

      {/* Footer Placeholder */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <embed src="/Visitca_Trip_logo_final.pdf#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf" className="h-6 w-6 pointer-events-none" />
            <span className="text-lg font-bold tracking-tight text-neutral-900">Visitca Trip</span>
          </div>
          <p className="text-sm text-neutral-500 max-w-md mb-6">
            O'zbekistonning boy tarixi, madaniyati va go'zal tabiatini biz bilan birga kashf eting.
          </p>
          <p className="text-xs text-neutral-400">&copy; 2026 Visitca Trip. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default AppContent;
