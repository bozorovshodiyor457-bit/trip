import React, { useState, useEffect } from 'react';
import { ChevronRight, Smartphone, X, Star, MapPin, Clock, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import TourCard from '../components/TourCard';
import tourService from '../services/tourService';

const SEO_FAQS = [
  {
    q: "Samarqandga sayohat qilish uchun eng yaxshi vaqt qachon?",
    a: "Bahor (Aprel - May) va Kuz (Sentyabr - Oktyabr) oylari havo mo'tadil bo'lganligi uchun eng qulay vaqt hisoblanadi."
  },
  {
    q: "Samarqandda qancha vaqt qolish tavsiya etiladi?",
    a: "Asosiy obidalarni ko'rish uchun 2 kun yetarli, ammo shahar ruhiyatini to'liq his qilish uchun kamida 3-4 kun qolishni tavsiya qilamiz."
  },
  {
    q: "O'zbekistondagi eng mashhur turistik maskanlar nima?",
    a: "Registon maydoni, Go'ri Amir maqbarasi, Shohi Zinda va Bibixonim masjidi turistlar tomonidan eng ko'p ziyorat qilinadigan obidalar ro'yxatiga kiradi."
  }
];

export default function SeoDestinationPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await tourService.getTours({ search: 'Samarqand' });
        if (isMounted) {
          const list = res?.tours || res?.data || (Array.isArray(res) ? res : []);
          setTours(list);
        }
      } catch (err) {
        if (isMounted) setTours([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleOpenApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      window.open("https://play.google.com/store/apps/details?id=uz.purecube.visitca", "_blank");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.open("https://apps.apple.com/uz/app/visitca-uz/id6738866179", "_blank");
    } else {
      window.open("https://play.google.com/store/apps/details?id=uz.purecube.visitca", "_blank");
    }
  };

  return (
    <div className="font-sans min-h-screen bg-white">
      
      {/* Smart App Banner */}
      {showBanner && (
        <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between shadow-md relative z-50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg flex-shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Visitca App</p>
              <p className="text-xs text-neutral-300">Yanada qulayroq qidiruv va band qilish</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleOpenApp} className="text-xs font-bold bg-white text-neutral-900 px-4 py-1.5 rounded-full hover:bg-neutral-100 transition-colors">
              Ochish
            </button>
            <button onClick={() => setShowBanner(false)} className="text-neutral-400 hover:text-white transition-colors p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-8">
          <a href="#" className="hover:text-emerald-600 transition-colors">Bosh sahifa</a>
          <ChevronRight className="h-3 w-3" />
          <a href="#" className="hover:text-emerald-600 transition-colors">Turlar</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-neutral-900">Samarqand</span>
        </nav>

        {/* SEO Header & Intro */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-6 tracking-tight">
            Samarqand turlari va ekskursiyalari
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Markaziy Osiyoning qadimiy gavhari bo'lgan Samarqandga xush kelibsiz! Registonning muhtasham maydonlari, Shohi Zindaning betakror mozaikalari va Ulug'bek yaratgan osmon ilmi bilan yaqindan tanishing. Mahalliy gidlar bilan eng yaxshi marshrutlarni tanlang.
          </p>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {['Guruhli turlar', 'Individual ekskursiyalar', 'Ziyorat turizmi', 'Gastronomik turlar', '1 kunlik'].map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-200 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Samarqanddagi mashhur turlar</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : tours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200 mb-16">
            <Sparkles className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Hozircha faol turlar topilmadi</h3>
            <p className="text-sm text-neutral-500 max-w-md">Yaqin orada yangi yo'nalishlar qo'shiladi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {tours.map((tour) => (
              <TourCard key={tour._id || tour.id} tour={tour} />
            ))}
          </div>
        )}

        {/* SEO FAQ Section */}
        <div className="max-w-3xl mx-auto border-t border-neutral-200 pt-16 pb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Samarqand bo'yicha ko'p beriladigan savollar</h2>
          <div className="space-y-4">
            {SEO_FAQS.map((faq, idx) => (
              <div key={idx} className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="font-semibold text-neutral-900 pr-4">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-5 w-5 text-neutral-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-neutral-400 flex-shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-neutral-600 bg-white leading-relaxed text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
