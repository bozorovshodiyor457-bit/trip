import React, { useState, useEffect } from 'react';
import { Heart, Share, Star, MapPin, Clock, Copy, Send, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import interactionService from '../services/interactionService';

const INITIAL_FAVORITES = [
  {
    id: 1,
    title: "Afsonaviy Samarqand bo'ylab sayohat",
    location: "Samarqand",
    image: "https://picsum.photos/seed/tour18/800/600",
    rating: 4.9,
    priceUZS: 450000,
    duration: "2 kun",
    alert: "price_drop" // price_drop, new_dates
  },
  {
    id: 3,
    title: "Ichan Qal'a - Ochiq osmon ostidagi muzey",
    location: "Xiva",
    image: "https://picsum.photos/seed/tour19/800/600",
    rating: 4.9,
    priceUZS: 650000,
    duration: "3 kun",
    alert: "new_dates"
  },
];

export default function FavoritesPage() {
  const { currency } = useAppContext();
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadFavorites() {
      try {
        setIsLoading(true);
        const res = await interactionService.getFavorites();
        if (isMounted) {
          const list = res?.favorites || res?.data || (Array.isArray(res) ? res : []);
          setFavorites(list.length > 0 ? list : INITIAL_FAVORITES);
        }
      } catch (err) {
        console.warn('Favorites API error fallback:', err);
        if (isMounted) setFavorites(INITIAL_FAVORITES);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFavorites();
    return () => { isMounted = false; };
  }, []);

  const handleRemove = async (id) => {
    setFavorites(prev => prev.filter(t => (t._id || t.id) !== id));
    try {
      await interactionService.toggleFavorite(id);
    } catch (err) {
      console.warn('Remove favorite API error:', err);
    }
  };

  const handleShare = (tour) => {
    setShareUrl(`https://visitca.trip/tours/${tour.id}`);
    setShareModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Havola nusxalandi!');
  };

  const displayPrice = (priceUZS) => {
    return currency === 'UZS' 
      ? `${(priceUZS || 0).toLocaleString('uz-UZ')} so'm` 
      : `$${Math.round((priceUZS || 0) / 12500)}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 mb-6">
          <Heart className="h-10 w-10 text-neutral-300" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Sizda hali saqlangan turlar yo'q</h2>
        <p className="text-neutral-500 mb-8">
          Sayohatlar qidirishda yurakcha belgisini bosib, ularni sevimlilarga qo'shing. Shunda ularni yo'qotib qo'ymaysiz.
        </p>
        <button className="rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-800 transition-colors">
          Turlarni qidirish
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Sevimlilar</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map(tour => (
          <div key={tour.id} className="group flex flex-col rounded-xl border border-neutral-200 bg-white hover:shadow-lg transition-shadow overflow-hidden relative">
            <div className="relative aspect-[4/3] w-full bg-neutral-200 overflow-hidden">
              <img src={tour.image} alt={tour.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              
              <div className="absolute top-3 right-3 flex gap-2">
                 <button 
                   onClick={() => handleShare(tour)}
                   className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-neutral-700 shadow-sm hover:bg-white transition-colors"
                 >
                    <Share className="h-4 w-4" />
                 </button>
                 <button 
                   onClick={() => handleRemove(tour.id)}
                   className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
                 >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                 </button>
              </div>

              {tour.alert === 'price_drop' && (
                <div className="absolute bottom-3 left-3 rounded-md bg-emerald-500/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-white shadow-sm">
                  Narx pasaydi
                </div>
              )}
              {tour.alert === 'new_dates' && (
                <div className="absolute bottom-3 left-3 rounded-md bg-blue-500/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-white shadow-sm">
                  Yangi sanalar
                </div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 mb-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {tour.rating}
              </div>
              <h3 className="font-semibold text-neutral-900 leading-tight mb-2 line-clamp-2">{tour.title}</h3>
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-3">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{tour.location}</span>
              </div>
              <div className="mt-auto flex items-end justify-between border-t border-neutral-100 pt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-0.5">Narxi</span>
                  <span className="text-lg font-bold text-neutral-900 leading-none">{displayPrice(tour.priceUZS)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                  <Clock className="h-3.5 w-3.5 text-neutral-400" />
                  {tour.duration}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Turni ulashish</h3>
            
            <div className="flex items-center gap-2 mb-6 p-2 bg-neutral-100 rounded-lg border border-neutral-200">
              <input type="text" readOnly value={shareUrl} className="bg-transparent text-sm text-neutral-600 outline-none w-full" />
              <button onClick={copyToClipboard} className="p-1.5 bg-white rounded-md shadow-sm border border-neutral-200 hover:bg-neutral-50">
                <Copy className="h-4 w-4 text-neutral-700" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0088cc] text-white px-4 py-2.5 font-semibold text-sm hover:bg-[#0077b3] transition-colors">
                 <Send className="h-4 w-4" /> Telegram
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white px-4 py-2.5 font-semibold text-sm hover:bg-[#20b858] transition-colors">
                 <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
