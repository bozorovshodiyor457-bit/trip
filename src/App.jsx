import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { useAppContext } from './context/AppProvider';
import { useTranslation } from './utils/i18n';
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
import BookingStatusPage from './pages/BookingStatusPage';

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
  const { language } = useAppContext();
  const t = useTranslation(language);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState('popular');
  const navigate = useNavigate();

  const filteredTours = MOCK_TOURS.filter(t => t.collectionId === activeCollection) || [];
  const displayTours = filteredTours.length > 0 ? filteredTours : MOCK_TOURS;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Header 
        onLoginClick={() => setIsAuthModalOpen(true)} 
      />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
          <>
            {/* Hero Section */}
            <section className="relative px-4 pt-20 pb-28 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="mx-auto max-w-7xl text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl mb-6">
                  {t('heroTitle')}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-neutral-500 dark:text-neutral-400 mb-12">
                  {t('heroDesc')}
                </p>
                
                <div onClick={() => navigate('/search')}>
                  <SearchBar />
                </div>
                
                <p className="mt-6 text-sm text-neutral-400">
                  {t('searchHint')}
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
                  <div key={tour.id} onClick={() => navigate('/tour/1')}>
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            </section>
          </>
          } />
          
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tour/:id" element={<TourDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/custom-tour" element={<CustomTourPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/seo/:city" element={<SeoDestinationPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/status" element={<BookingStatusPage />} />
        </Routes>
      </main>

      {/* Footer Placeholder */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 py-12 mt-auto transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <img src="/triplogo.jpg" alt="Visitca Trip Logo" className="h-8 w-8 object-contain rounded-md" />
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Visitca Trip</span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-6">
            {t('footerText')}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">{t('footerRights')}</p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default AppContent;
