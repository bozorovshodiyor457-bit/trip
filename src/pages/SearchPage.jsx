import React, { useState, useMemo } from 'react';
import { Map, List, SlidersHorizontal, ChevronDown, Check, Star, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';

// Mock Tours for Search Page
const MOCK_TOURS = [
  {
    id: 1,
    title: "Samarqand Buyuk Ipak Yo'li",
    location: "Samarqand",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    rating: 4.9,
    priceUZS: 450000,
    durationStr: "2 kun",
    durationType: "multi_day", // hours, 1_day, multi_day
    format: "group", // group, individual
    organizerType: "operator", // guide, operator
    isVerified: true,
    languages: ["UZ", "RU"],
    freeCancellation: true,
    transferIncluded: true,
    lat: 39.654, lng: 66.975,
    popularity: 95
  },
  {
    id: 2,
    title: "Eski Buxoro ko'chalari bo'ylab yurish",
    location: "Buxoro",
    image: "https://images.unsplash.com/photo-1584639906659-450f681a8c51?w=800&q=80",
    rating: 4.8,
    priceUZS: 150000,
    durationStr: "3 soat",
    durationType: "hours",
    format: "individual",
    organizerType: "guide",
    isVerified: true,
    languages: ["UZ", "EN"],
    freeCancellation: false,
    transferIncluded: false,
    lat: 39.774, lng: 64.413,
    popularity: 88
  },
  {
    id: 3,
    title: "Ichan Qal'a arxitekturasi",
    location: "Xiva",
    image: "https://images.unsplash.com/photo-1627993077749-f0275815ea7f?w=800&q=80",
    rating: 4.4,
    priceUZS: 250000,
    durationStr: "1 kun",
    durationType: "1_day",
    format: "group",
    organizerType: "operator",
    isVerified: false,
    languages: ["UZ", "RU", "EN"],
    freeCancellation: true,
    transferIncluded: true,
    lat: 41.378, lng: 60.363,
    popularity: 75
  },
  {
    id: 4,
    title: "Zomin tog'lari tabiati",
    location: "Zomin",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    rating: 4.7,
    priceUZS: 320000,
    durationStr: "1 kun",
    durationType: "1_day",
    format: "group",
    organizerType: "operator",
    isVerified: true,
    languages: ["UZ", "RU"],
    freeCancellation: true,
    transferIncluded: true,
    lat: 39.96, lng: 68.39,
    popularity: 82
  },
  {
    id: 5,
    title: "Toshkent City va eski shahar",
    location: "Toshkent",
    image: "https://images.unsplash.com/photo-1551524164-687a5acf3905?w=800&q=80",
    rating: 4.1,
    priceUZS: 120000,
    durationStr: "4 soat",
    durationType: "hours",
    format: "individual",
    organizerType: "guide",
    isVerified: true,
    languages: ["UZ", "EN"],
    freeCancellation: false,
    transferIncluded: false,
    lat: 41.311, lng: 69.24,
    popularity: 60
  }
];

export default function SearchPage() {
  const { currency } = useAppContext();
  const [showMap, setShowMap] = useState(false);
  const [hoveredTourId, setHoveredTourId] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    format: [], // 'group', 'individual'
    organizerType: [], // 'guide', 'operator'
    minPrice: '',
    maxPrice: '',
    durationType: [], // 'hours', '1_day', 'multi_day'
    rating: null, // 4.0, 4.5
    freeCancellation: false,
    transferIncluded: false,
  });

  const [sortBy, setSortBy] = useState('popularity'); // popularity, price_asc, price_desc, rating

  // Handle Filter Changes
  const handleCheckboxChange = (filterKey, value) => {
    setFilters(prev => {
      const currentList = prev[filterKey];
      if (currentList.includes(value)) {
        return { ...prev, [filterKey]: currentList.filter(item => item !== value) };
      }
      return { ...prev, [filterKey]: [...currentList, value] };
    });
  };

  // Filter & Sort Logic
  const filteredTours = useMemo(() => {
    let result = MOCK_TOURS.filter(tour => {
      if (filters.format.length && !filters.format.includes(tour.format)) return false;
      if (filters.organizerType.length && !filters.organizerType.includes(tour.organizerType)) return false;
      if (filters.durationType.length && !filters.durationType.includes(tour.durationType)) return false;
      
      const minP = parseFloat(filters.minPrice);
      const maxP = parseFloat(filters.maxPrice);
      if (!isNaN(minP) && tour.priceUZS < minP) return false;
      if (!isNaN(maxP) && tour.priceUZS > maxP) return false;

      if (filters.rating && tour.rating < filters.rating) return false;
      if (filters.freeCancellation && !tour.freeCancellation) return false;
      if (filters.transferIncluded && !tour.transferIncluded) return false;
      
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'price_asc') return a.priceUZS - b.priceUZS;
      if (sortBy === 'price_desc') return b.priceUZS - a.priceUZS;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [filters, sortBy]);

  const displayPrice = (priceUZS) => {
    return currency === 'UZS' 
      ? `${priceUZS.toLocaleString('uz-UZ')} so'm` 
      : `$${Math.round(priceUZS / 12500)}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-900">
          O'zbekiston bo'ylab {filteredTours.length} ta tur topildi
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort Dropdown mock */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-lg border border-neutral-300 bg-white py-2 pl-4 pr-10 text-sm font-medium text-neutral-700 shadow-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            >
              <option value="popularity">Mashhurlik bo'yicha</option>
              <option value="price_asc">Narx (Arzonroq)</option>
              <option value="price_desc">Narx (Qimmatroq)</option>
              <option value="rating">Reyting bo'yicha</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
          </div>

          <button 
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 transition-colors"
          >
            {showMap ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
            {showMap ? 'Ro\'yxat' : 'Xarita'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrlar
            </h3>
            
            {/* Format */}
            <div className="border-t border-neutral-200 py-4 mt-2">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Format</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.format.includes('group')}
                    onChange={() => handleCheckboxChange('format', 'group')} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Guruhli tur</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.format.includes('individual')}
                    onChange={() => handleCheckboxChange('format', 'individual')} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Individual tur</span>
                </label>
              </div>
            </div>

            {/* Organizer Type */}
            <div className="border-t border-neutral-200 py-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Tashkilotchi</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.organizerType.includes('guide')}
                    onChange={() => handleCheckboxChange('organizerType', 'guide')} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Yakka tartibdagi Gid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.organizerType.includes('operator')}
                    onChange={() => handleCheckboxChange('organizerType', 'operator')} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Turoperator</span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-neutral-200 py-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Narx (UZS)</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minPrice}
                  onChange={e => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" 
                />
                <span className="text-neutral-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice}
                  onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" 
                />
              </div>
            </div>

            {/* Duration */}
            <div className="border-t border-neutral-200 py-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Davomiyligi</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.durationType.includes('hours')}
                    onChange={() => handleCheckboxChange('durationType', 'hours')} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Ekskursiya (bir necha soat)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.durationType.includes('1_day')}
                    onChange={() => handleCheckboxChange('durationType', '1_day')} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">1 kunlik</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.durationType.includes('multi_day')}
                    onChange={() => handleCheckboxChange('durationType', 'multi_day')} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Ko'p kunlik</span>
                </label>
              </div>
            </div>

            {/* Rating */}
            <div className="border-t border-neutral-200 py-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Reyting</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="rating" className="accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.rating === 4.5}
                    onChange={() => setFilters({...filters, rating: 4.5})} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 flex items-center gap-1">4.5+ A'lo <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"/></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="rating" className="accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.rating === 4.0}
                    onChange={() => setFilters({...filters, rating: 4.0})} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 flex items-center gap-1">4.0+ Yaxshi <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"/></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="rating" className="accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.rating === null}
                    onChange={() => setFilters({...filters, rating: null})} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Barchasi</span>
                </label>
              </div>
            </div>

            {/* Extra Options */}
            <div className="border-t border-neutral-200 py-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">Qo'shimcha</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.freeCancellation}
                    onChange={(e) => setFilters({...filters, freeCancellation: e.target.checked})} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Bepul bekor qilish</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 w-4 h-4 cursor-pointer"
                    checked={filters.transferIncluded}
                    onChange={(e) => setFilters({...filters, transferIncluded: e.target.checked})} />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Transfer / Yashash kiritilgan</span>
                </label>
              </div>
            </div>
            
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={`flex-1 ${showMap ? 'flex gap-6 h-[calc(100vh-200px)] min-h-[600px]' : ''}`}>
          
          {/* Tour Grid */}
          <div className={`${showMap ? 'w-1/2 overflow-y-auto pr-2 no-scrollbar' : 'w-full'}`}>
            {filteredTours.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
                <p className="text-neutral-500">Hech narsa topilmadi. Filtrni o'zgartirib ko'ring.</p>
                <button 
                  onClick={() => setFilters({format: [], organizerType: [], minPrice: '', maxPrice: '', durationType: [], rating: null, freeCancellation: false, transferIncluded: false})}
                  className="mt-4 text-sm font-medium text-neutral-900 underline hover:text-neutral-700"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${showMap ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {filteredTours.map(tour => (
                  <div 
                    key={tour.id} 
                    className="group cursor-pointer flex flex-col rounded-xl border border-neutral-200 bg-white hover:shadow-lg transition-shadow overflow-hidden"
                    onMouseEnter={() => setHoveredTourId(tour.id)}
                    onMouseLeave={() => setHoveredTourId(null)}
                  >
                    <div className="relative aspect-[4/3] w-full bg-neutral-200 overflow-hidden">
                      <img src={tour.image} alt={tour.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-neutral-900 shadow-sm flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {tour.rating}
                      </div>

                      {/* Bottom Badges */}
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <div className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-neutral-800 uppercase tracking-wide">
                          {tour.format === 'group' ? 'Guruhli' : 'Individual'}
                        </div>
                        {tour.organizerType === 'operator' ? (
                           <div className="rounded-full bg-blue-50/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-blue-700 uppercase tracking-wide border border-blue-200">
                             Turoperator
                           </div>
                        ) : (
                           <div className="rounded-full bg-orange-50/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-orange-700 uppercase tracking-wide border border-orange-200">
                             Gid
                           </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-neutral-900 leading-tight">{tour.title}</h3>
                        {tour.isVerified && (
                          <div title="Tasdiqlangan tashkilotchi" className="mt-0.5">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{tour.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 w-fit px-2 py-1 rounded-md mb-4">
                        <Clock className="h-3.5 w-3.5 text-neutral-500" />
                        {tour.durationStr}
                      </div>

                      <div className="mt-auto flex items-end justify-between border-t border-neutral-100 pt-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-0.5">Narxi (kishi boshiga)</span>
                          <span className="text-lg font-bold text-neutral-900 leading-none">{displayPrice(tour.priceUZS)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map Mockup Panel */}
          {showMap && (
            <div className="hidden lg:block w-1/2 h-full rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden relative sticky top-24 shadow-inner">
              {/* Fake Map Background */}
              <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/6/41/24.png')] bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundSize: '200%' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-neutral-400 font-medium text-lg uppercase tracking-widest bg-white/70 px-4 py-2 rounded-lg backdrop-blur-sm">Interaktiv Xarita</span>
              </div>
              
              {/* Map Pins */}
              {filteredTours.map(tour => {
                // simple math to scatter them visually for mockup
                const top = 100 - ((tour.lat - 39) / (42 - 39) * 80) + '%';
                const left = ((tour.lng - 60) / (70 - 60) * 80) + 10 + '%';
                const isHovered = hoveredTourId === tour.id;

                return (
                  <div 
                    key={tour.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                    style={{ top, left }}
                  >
                    <div className={`
                      px-3 py-1.5 rounded-full font-bold text-sm shadow-md transition-all
                      ${isHovered 
                        ? 'bg-neutral-900 text-white scale-110 z-10' 
                        : 'bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white'}
                    `}>
                      {displayPrice(tour.priceUZS)}
                    </div>
                    {/* Pin tail */}
                    <div className={`w-3 h-3 rotate-45 -mt-1.5 ${isHovered ? 'bg-neutral-900' : 'bg-white group-hover:bg-neutral-900'}`}></div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
