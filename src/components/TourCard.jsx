import React, { useState } from 'react';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import { useTranslation } from '../utils/i18n';

export default function TourCard({ tour = {} }) {
  const { language, favorites, toggleFavorite } = useAppContext();
  const t = useTranslation(language);
  const [isHovered, setIsHovered] = useState(false);

  const tourId = tour._id || tour.id;
  const isFav = favorites?.some(f => (f._id || f.id) === tourId);

  // Extract city name (e.g., "Samarqand" from "Samarqand, O'zbekiston")
  const cityName = tour.city || (tour.location ? tour.location.split(',')[0] : "O'zbekiston");

  // Format price strictly in UZS (so'm)
  const priceVal = tour.priceUZS || tour.price || 450000;
  const formattedPrice = `${Number(priceVal).toLocaleString('uz-UZ')} so'm`;

  // Format duration representation
  const durationText = tour.durationDetails || tour.duration || tour.durationStr || "2 kun / 1 kecha";
  const imageSrc = tour.image || tour.images?.[0] || "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80";

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with aspect-[4/3] */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img 
          src={imageSrc} 
          alt={tour.title || "Tour image"} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay for Top Badges readability */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Top Left: Transparent City Tag */}
        <div className="absolute top-3 left-3 z-20 bg-black/50 backdrop-blur-md border border-white/20 text-white font-medium text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[100px]">{cityName}</span>
        </div>

        {/* Top Right: Rating + Favorite Heart */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-neutral-900 dark:text-white shadow-sm flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span>{tour.rating || 4.9}</span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (toggleFavorite) toggleFavorite(tour);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-200 hover:text-red-500 dark:hover:text-red-500 shadow-sm transition-transform active:scale-90"
            title="Sevimlilarga qo'shish"
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-base text-neutral-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug min-h-[2.75rem]">
            {tour.title || "Sayohat turi"}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            <Clock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span>{durationText}</span>
          </div>
        </div>

        {/* Pricing Row */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-baseline justify-between">
          <div>
            <span className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">
              {formattedPrice}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal ml-1">
              / kishi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

