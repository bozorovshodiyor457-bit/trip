import React, { useState, useEffect } from 'react';
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
import CustomTourPage from './pages/CustomTourPage';
import SupportPage from './pages/SupportPage';
import ProfilePage from './pages/ProfilePage';
import SeoDestinationPage from './pages/SeoDestinationPage';
import PartnersPage from './pages/PartnersPage';
import BookingStatusPage from './pages/BookingStatusPage';
import tourService from './services/tourService';
import { 
  Landmark, 
  Utensils, 
  Flame, 
  Users,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';

// Home Page Collections Filter Tabs
const COLLECTIONS = [
  { id: 'popular', title: "Mashhur yo'nalishlar" },
  { id: 'upcoming', title: "Yaqin kunlardagi safarlar" },
  { id: 'seasonal', title: "Mavsumiy turlar (Kuz)" },
  { id: 'discounts', title: "Aksiyalar va chegirmalar" },
];

function AppContent() {
  const { language } = useAppContext();
  const t = useTranslation(language);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState('popular');
  const [tours, setTours] = useState([]);
  const [isToursLoading, setIsToursLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadTours() {
      try {
        setIsToursLoading(true);
        console.log("API Request: GET /api/b2c/tours (Clean GET request)");
        const res = await tourService.getTours();
        console.log("API Response: GET /api/b2c/tours", res);
        
        if (isMounted) {
          const list = res?.tours || res?.data?.tours || res?.data || (Array.isArray(res) ? res : []);
          setTours(list);
        }
      } catch (err) {
        console.error('API Error: GET /api/b2c/tours failed:', err);
        if (isMounted) setTours([]);
      } finally {
        if (isMounted) setIsToursLoading(false);
      }
    }
    loadTours();
    return () => { isMounted = false; };
  }, []);

  const displayTours = (tours || []).filter(tour => {
    if (activeCollection === 'popular') return true;
    if (activeCollection === 'upcoming') return true;
    if (activeCollection === 'seasonal') return true;
    if (activeCollection === 'discounts') return tour.discount || tour.isDiscounted || true;
    return true;
  });

  const categories = [
    { 
      id: 'extreme', 
      title: "Olov Sarguzashtlar", 
      desc: "Eksklyuziv, qizg'in tog' va cho'l ekspeditsiyalari", 
      icon: Flame, 
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" 
    },
    { 
      id: 'upcoming', 
      title: "Tezkor jamoa", 
      desc: "Tez yig'iladigan va yaqin kunlardagi guruhli safarlar", 
      icon: Users, 
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
    },
    { 
      id: 'historical', 
      title: "Tarixiy shaharlar", 
      desc: "Samarqand, Buxoro, Xiva bo'ylab madaniy turlar", 
      icon: Landmark, 
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" 
    },
    { 
      id: 'gastronomic', 
      title: "Gastronomik turlar", 
      desc: "Milliy taomlar va mahorat darslari", 
      icon: Utensils, 
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Header 
        onLoginClick={() => setIsAuthModalOpen(true)} 
      />
      
      <main className="flex-1 pb-28 md:pb-0">
        <Routes>
          <Route path="/" element={
          <>
            {/* 1. Hero Section - Vibrant Uzbekistan Landscape */}
            <section className="relative min-h-[500px] sm:min-h-[560px] flex items-center justify-center px-4 pt-16 pb-20 sm:px-6 lg:px-8 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1920&q=85" 
                  alt="Registan Samarkand Uzbekistan" 
                  className="h-full w-full object-cover object-center transform scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/65 via-neutral-950/45 to-neutral-950/85" />
              </div>

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
                
                <div className="w-full">
                  <SearchBar />
                </div>
              </div>
            </section>

            {/* 2. Categories Section (Clean Uzbek titles & descriptions) */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Sayohat toifalari
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Qiziqishingizga mos toifani tanlang
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

            {/* 3. Popular Tours Section (Filterable Collections) */}
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
                  {COLLECTIONS.map(collection => (
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
              {isToursLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="animate-pulse rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 h-80 flex flex-col justify-between">
                      <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                      <div className="space-y-2 mt-4">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                      </div>
                      <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mt-4" />
                    </div>
                  ))}
                </div>
              ) : displayTours.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-700">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                    Hozircha faol turlar topilmadi
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
                    Yaqin orada yangi yo'nalishlar va qiziqarli safarlar qo'shiladi.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayTours.map((tour) => (
                    <div key={tour._id || tour.id} onClick={() => navigate(`/tour/${tour._id || tour.id}`)}>
                      <TourCard tour={tour} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
          } />
          
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tour/:id" element={<TourDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/custom-tour" element={<CustomTourPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/seo/:city" element={<SeoDestinationPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/status" element={<BookingStatusPage />} />
          <Route path="/booking-success" element={<BookingStatusPage />} />
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

