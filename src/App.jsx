import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { useAppContext } from './context/AppProvider';
import { useTranslation } from './utils/i18n';
import SearchBar from './components/SearchBar';
import BottomNav from './components/BottomNav';
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
import { 
  Mountain, 
  Landmark, 
  Utensils, 
  Flame, 
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  CalendarCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

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
    city: "Samarqand",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    priceUZS: 450000,
    duration: "2 kun",
    durationDetails: "2 kun / 1 kecha",
    collectionId: 'popular'
  },
  {
    id: 2,
    title: "Eski Buxoro ko'chalari va minorasi",
    location: "Buxoro, O'zbekiston",
    city: "Buxoro",
    image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    priceUZS: 520000,
    duration: "3 kun",
    durationDetails: "3 kun / 2 kecha",
    collectionId: 'popular'
  },
  {
    id: 3,
    title: "Ichan Qal'a - Ochiq osmon ostidagi muzey",
    location: "Xiva, Xorazm",
    city: "Xiva",
    image: "https://images.unsplash.com/photo-1609848529241-10c0e7d781b0?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    priceUZS: 650000,
    duration: "3 kun",
    durationDetails: "3 kun / 2 kecha",
    collectionId: 'popular'
  },
  {
    id: 4,
    title: "Zomin tog'lari bo'ylab kemping sarguzashti",
    location: "Zomin, Jizzax",
    city: "Zomin",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    priceUZS: 320000,
    duration: "1 kun",
    durationDetails: "1 kun / 0 kecha",
    collectionId: 'upcoming'
  },
  {
    id: 5,
    title: "Chorvoq va Chimyon tog' kurort safari",
    location: "Toshkent viloyati",
    city: "Chimyon",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    rating: 4.85,
    priceUZS: 280000,
    duration: "1 kun",
    durationDetails: "1 kun / 0 kecha",
    collectionId: 'seasonal'
  },
  {
    id: 6,
    title: "Toshkent va Samarqand Gastronomik Gastrol",
    location: "Toshkent - Samarqand",
    city: "Toshkent",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    priceUZS: 490000,
    duration: "2 kun",
    durationDetails: "2 kun / 1 kecha",
    collectionId: 'discounts'
  }
];

function AppContent() {
  const { language } = useAppContext();
  const t = useTranslation(language);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState('popular');
  const navigate = useNavigate();

  const filteredTours = MOCK_TOURS.filter(tour => tour.collectionId === activeCollection) || [];
  const displayTours = filteredTours.length > 0 ? filteredTours : MOCK_TOURS;

  const categories = [
    { 
      id: 'mountain', 
      title: t('catMountain') || "Tog' safari", 
      desc: t('catMountainDesc') || "Zomin, Chimyon va Chorvoq", 
      icon: Mountain, 
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
    },
    { 
      id: 'historical', 
      title: t('catHistorical') || "Tarixiy shaharlar", 
      desc: t('catHistoricalDesc') || "Samarqand, Buxoro, Xiva", 
      icon: Landmark, 
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" 
    },
    { 
      id: 'gastronomic', 
      title: t('catGastronomic') || "Gastronomik", 
      desc: t('catGastronomicDesc') || "Milliy taomlar va osh festivallari", 
      icon: Utensils, 
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" 
    },
    { 
      id: 'extreme', 
      title: t('catExtreme') || "Ekstremal", 
      desc: t('catExtremeDesc') || "Kvadrotsikl va kemping", 
      icon: Flame, 
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" 
    },
  ];

  const trustElements = [
    {
      icon: ShieldCheck,
      title: t('trustGuides') || "Rasmiy gidlar",
      desc: t('trustGuidesDesc') || "Sertifikatlangan va tajribali ekspertlar"
    },
    {
      icon: CreditCard,
      title: t('trustPayment') || "100% Xavfsiz to'lov",
      desc: t('trustPaymentDesc') || "Click, Payme va barcha xalqaro kartalar"
    },
    {
      icon: Headphones,
      title: t('trustSupport') || "24/7 Qo'llab-quvvatlash",
      desc: t('trustSupportDesc') || "Sayohat davomida doimiy yordam"
    },
    {
      icon: CalendarCheck,
      title: t('trustGuaranteed') || "Kafolatlangan chiqishlar",
      desc: t('trustGuaranteedDesc') || "Guruh holatidan qat'i nazar safar tayyor"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Header 
        onLoginClick={() => setIsAuthModalOpen(true)} 
      />
      
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={
          <>
            {/* 1. Hero Section - Vibrant Uzbekistan Landscape */}
            <section className="relative min-h-[500px] sm:min-h-[560px] flex items-center justify-center px-4 pt-16 pb-20 sm:px-6 lg:px-8 overflow-hidden">
              {/* Background Scenery Image with Gradient Overlays */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1920&q=85" 
                  alt="Registan Samarkand Uzbekistan" 
                  className="h-full w-full object-cover object-center transform scale-105 transition-transform duration-1000"
                />
                {/* Light/Dark Overlay for text readability without being too dark */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/65 via-neutral-950/45 to-neutral-950/85" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 mx-auto max-w-5xl text-center w-full">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>O'zbekiston Milliy Turizm Platformasi</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-5 drop-shadow-md leading-tight">
                  {t('heroTitle') || "O'zbekiston bo'ylab unutilmas sayohatlar"}
                </h1>

                <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-100/90 mb-10 font-normal leading-relaxed drop-shadow">
                  {t('heroDesc') || "O'zbekistonning boy tarixi, noyob madaniyati va betakror tabiatini professional gidlar va qulay turlar bilan kashf eting."}
                </p>
                
                {/* Centralized SearchBar */}
                <div className="w-full">
                  <SearchBar />
                </div>
              </div>
            </section>

            {/* 2. Categories Section (Minimalist Cards & Hover Effects) */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {t('categoriesTitle') || "Sayohat yo'nalishlari"}
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Qiziqishingizga mos keluvchi tur toifasini tanlang
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((cat) => {
                  const IconComp = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => navigate(`/search?category=${cat.id}`)}
                      className="group relative flex items-center gap-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-emerald-500/50"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}>
                        <IconComp className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                          {cat.desc}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Popular Tours Section (Whitespace py-12/py-16) */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {t('popular') || "Mashhur yo'nalishlar"}
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Sayohatchilarimiz tomonidan eng yuqori baholangan turlar
                  </p>
                </div>

                {/* Collection Filter Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                  {MOCK_COLLECTIONS.map(collection => (
                    <button
                      key={collection.id}
                      onClick={() => setActiveCollection(collection.id)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
                        activeCollection === collection.id 
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {collection.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tour Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayTours.map((tour) => (
                  <div key={tour.id} onClick={() => navigate(`/tour/${tour.id}`)}>
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Trust Elements Section */}
            <section className="bg-neutral-50 dark:bg-neutral-800/40 border-y border-neutral-200/60 dark:border-neutral-800 py-12 sm:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {trustElements.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-12 pb-24 md:pb-12 mt-auto transition-colors">
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
      
      <BottomNav />
    </div>
  );
}

export default AppContent;

