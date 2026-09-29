import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';

export default function TourCard({ tour }) {
  const { currency } = useAppContext();

  // Simple mock converter just for UI representation
  const priceDisplay = currency === 'UZS' 
    ? `${tour.priceUZS.toLocaleString('uz-UZ')} so'm` 
    : `$${Math.round(tour.priceUZS / 12500)}`;

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-200 mb-3">
        <img 
          src={tour.image} 
          alt={tour.title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-neutral-900 shadow-sm flex items-center gap-1">
          <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
          {tour.rating}
        </div>
      </div>
      
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900 line-clamp-1">{tour.title}</h3>
          <div className="flex items-center gap-1 text-sm text-neutral-500 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{tour.location}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="block font-semibold text-neutral-900">{priceDisplay}</span>
          <span className="text-xs text-neutral-500">odam boshiga</span>
        </div>
      </div>
      
      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 w-fit px-2 py-1 rounded-md">
        <Clock className="h-3.5 w-3.5" />
        {tour.duration}
      </div>
    </div>
  );
}
