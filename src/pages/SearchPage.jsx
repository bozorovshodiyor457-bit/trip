import React, { useState, useMemo, useEffect } from 'react';
import { Map, List, SlidersHorizontal, ChevronDown, Check, Star, ShieldCheck, MapPin, Clock, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { useTranslation } from '../utils/i18n';
import tourService from '../services/tourService';

// Fallback Mock Tours for Search Page if API is empty
const MOCK_TOURS = [
  {
    id: 1,
    title: "Samarqand Buyuk Ipak Yo'li",
    location: "Samarqand",
    image: "https://picsum.photos/seed/tour5/800/600",
    rating: 4.9,
    priceUZS: 450000,
    durationStr: "2 kun",
    durationType: "multi_day",
    format: "group",
    organizerType: "operator",
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
    image: "https://picsum.photos/seed/tour6/800/600",
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
    image: "https://picsum.photos/seed/tour7/800/600",
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
    image: "https://picsum.photos/seed/tour8/800/600",
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
  }
];

export default function SearchPage() {
  const { language } = useAppContext();
  const t = useTranslation(language);
  const locationObj = useLocation();
  const [showMap, setShowMap] = useState(false);
  const [hoveredTourId, setHoveredTourId] = useState(null);
  const [apiTours, setApiTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse URL Search Query Parameters
  const searchParams = useMemo(() => new URLSearchParams(locationObj.search), [locationObj.search]);
  const searchKeyword = searchParams.get('search') || '';
  const startDateParam = searchParams.get('startDate') || '';
  const endDateParam = searchParams.get('endDate') || '';
  const adultsParam = searchParams.get('adults') || '';
  const childrenParam = searchParams.get('children') || '';

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

  useEffect(() => {
    let isMounted = true;
    async function fetchSearchTours() {
      try {
        setIsLoading(true);
        const queryParams = { 
          sort: sortBy,
          ...(searchKeyword ? { search: searchKeyword } : {}),
          ...(startDateParam ? { startDate: startDateParam } : {}),
          ...(endDateParam ? { endDate: endDateParam } : {}),
          ...(adultsParam ? { adults: adultsParam } : {}),
          ...(childrenParam ? { children: childrenParam } : {})
        };
        console.log("API Request: GET /api/b2c/tours (Search)", queryParams);
        const res = showMap ? await tourService.getToursMap(queryParams) : await tourService.getTours(queryParams);
        console.log("API Response: GET /api/b2c/tours (Search)", res);
        
        if (isMounted) {
          const list = res?.tours || res?.data || (Array.isArray(res) ? res : []);
          setApiTours(list.length > 0 ? list : MOCK_TOURS);
        }
      } catch (err) {
        console.warn('SearchPage tour fetch error, using fallback:', err);
        if (isMounted) setApiTours(MOCK_TOURS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchSearchTours();
    return () => { isMounted = false; };
  }, [sortBy, showMap, searchKeyword, startDateParam, endDateParam, adultsParam, childrenParam]);

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
    const source = (apiTours && apiTours.length > 0) ? apiTours : MOCK_TOURS;
    let result = source.filter(tour => {
      if (searchKeyword) {
        const q = searchKeyword.toLowerCase();
        const titleMatch = (tour.title || '').toLowerCase().includes(q);
        const locMatch = (tour.location || tour.city || '').toLowerCase().includes(q);
        if (!titleMatch && !locMatch) return false;
      }
      if (filters.format.length && tour.format && !filters.format.includes(tour.format)) return false;
      if (filters.organizerType.length && tour.organizerType && !filters.organizerType.includes(tour.organizerType)) return false;
      if (filters.durationType.length && tour.durationType && !filters.durationType.includes(tour.durationType)) return false;
      
      const price = tour.priceUZS || tour.price || 0;
      const minP = parseFloat(filters.minPrice);
      const maxP = parseFloat(filters.maxPrice);
      if (!isNaN(minP) && price < minP) return false;
      if (!isNaN(maxP) && price > maxP) return false;

      const rat = tour.rating || 5;
      if (filters.rating && rat < filters.rating) return false;
      if (filters.freeCancellation && !tour.freeCancellation) return false;
      if (filters.transferIncluded && !tour.transferIncluded) return false;
      
      return true;
    });

    result.sort((a, b) => {
      const priceA = a.priceUZS || a.price || 0;
      const priceB = b.priceUZS || b.price || 0;
      const popA = a.popularity || 80;
      const popB = b.popularity || 80;
      const ratA = a.rating || 5;
      const ratB = b.rating || 5;

      if (sortBy === 'popularity') return popB - popA;
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return ratB - ratA;
      return 0;
    });

    return result;
  }, [apiTours, filters, sortBy]);

  const displayPrice = (priceUZS) => {
    return `${(priceUZS || 0).toLocaleString('uz-UZ')} so'm`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {t('toursFound', { count: filteredTours.length })}
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort Dropdown mock */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pl-4 pr-10 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500"
            >
              <option value="popularity">{t('sortByPop')}</option>
              <option value="price_asc">{t('sortPriceAsc')}</option>
              <option value="price_desc">{t('sortPriceDesc')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
          </div>

          <button 
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            {showMap ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
            {showMap ? t('list') : t('map')}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters')}
            </h3>
            
            {/* Format */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 py-4 mt-2">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">{t('format')}</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.format.includes('group')}
                    onChange={() => handleCheckboxChange('format', 'group')} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('groupTour')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.format.includes('individual')}
                    onChange={() => handleCheckboxChange('format', 'individual')} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('individualTour')}</span>
                </label>
              </div>
            </div>

            {/* Organizer Type */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 py-4">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">{t('organizer')}</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.organizerType.includes('guide')}
                    onChange={() => handleCheckboxChange('organizerType', 'guide')} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('guide')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.organizerType.includes('operator')}
                    onChange={() => handleCheckboxChange('organizerType', 'operator')} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('operator')}</span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 py-4">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">{t('priceUzs')} (UZS)</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minPrice}
                  onChange={e => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-900 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500" 
                />
                <span className="text-neutral-400 dark:text-neutral-500">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice}
                  onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:border-neutral-900 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500" 
                />
              </div>
            </div>

            {/* Duration */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 py-4">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">{t('duration')}</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.durationType.includes('hours')}
                    onChange={() => handleCheckboxChange('durationType', 'hours')} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('hours')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.durationType.includes('1_day')}
                    onChange={() => handleCheckboxChange('durationType', '1_day')} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('oneDay')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.durationType.includes('multi_day')}
                    onChange={() => handleCheckboxChange('durationType', 'multi_day')} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('multiDay')}</span>
                </label>
              </div>
            </div>

            {/* Rating */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 py-4">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">{t('rating')}</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="rating" className="accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.rating === 4.5}
                    onChange={() => setFilters({...filters, rating: 4.5})} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white flex items-center gap-1">4.5+ {t('excellent')} <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"/></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="rating" className="accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.rating === 4.0}
                    onChange={() => setFilters({...filters, rating: 4.0})} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white flex items-center gap-1">4.0+ {t('good')} <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"/></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="rating" className="accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.rating === null}
                    onChange={() => setFilters({...filters, rating: null})} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('all')}</span>
                </label>
              </div>
            </div>

            {/* Extra Options */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 py-4">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-3">{t('extra')}</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.freeCancellation}
                    onChange={(e) => setFilters({...filters, freeCancellation: e.target.checked})} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('freeCancel')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-900 accent-neutral-900 dark:accent-neutral-500 w-4 h-4 cursor-pointer"
                    checked={filters.transferIncluded}
                    onChange={(e) => setFilters({...filters, transferIncluded: e.target.checked})} />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">{t('transferInc')}</span>
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
              <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-800 border-dashed">
                <p className="text-neutral-500 dark:text-neutral-400">{t('nothingFound')}</p>
                <button 
                  onClick={() => setFilters({format: [], organizerType: [], minPrice: '', maxPrice: '', durationType: [], rating: null, freeCancellation: false, transferIncluded: false})}
                  className="mt-4 text-sm font-medium text-neutral-900 dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  {t('clearFilters')}
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${showMap ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {filteredTours.map(tour => (
                  <div 
                    key={tour.id} 
                    className="group cursor-pointer flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow overflow-hidden"
                    onMouseEnter={() => setHoveredTourId(tour.id)}
                    onMouseLeave={() => setHoveredTourId(null)}
                  >
                    <div className="relative aspect-[4/3] w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <img src={tour.image} alt={tour.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-neutral-900 dark:text-white shadow-sm flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {tour.rating}
                      </div>

                      {/* Bottom Badges */}
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <div className="rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                          {tour.format === 'group' ? t('groupTour') : t('individualTour')}
                        </div>
                        {tour.organizerType === 'operator' ? (
                           <div className="rounded-full bg-blue-50/90 dark:bg-blue-900/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide border border-blue-200 dark:border-blue-800">
                             {t('operator')}
                           </div>
                        ) : (
                           <div className="rounded-full bg-orange-50/90 dark:bg-orange-900/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide border border-orange-200 dark:border-orange-800">
                             {t('guide')}
                           </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-neutral-900 dark:text-white leading-tight">{tour.title}</h3>
                        {tour.isVerified && (
                          <div title="Tasdiqlangan tashkilotchi" className="mt-0.5">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{tour.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 w-fit px-2 py-1 rounded-md mb-4">
                        <Clock className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                        {tour.durationStr}
                      </div>

                      <div className="mt-auto flex items-end justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-0.5">{t('pricePerPerson')}</span>
                          <span className="text-lg font-bold text-neutral-900 dark:text-white leading-none">{displayPrice(tour.priceUZS)}</span>
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
            <div className="hidden lg:block w-1/2 h-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 overflow-hidden relative sticky top-24 shadow-inner">
              {/* Fake Map Background */}
              <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/6/41/24.png')] bg-cover bg-center opacity-40 mix-blend-multiply dark:mix-blend-screen dark:opacity-30" style={{ backgroundSize: '200%' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-neutral-400 dark:text-neutral-500 font-medium text-lg uppercase tracking-widest bg-white/70 dark:bg-neutral-900/70 px-4 py-2 rounded-lg backdrop-blur-sm">{t('interactiveMap')}</span>
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
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 scale-110 z-10' 
                        : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900'}
                    `}>
                      {displayPrice(tour.priceUZS)}
                    </div>
                    {/* Pin tail */}
                    <div className={`w-3 h-3 rotate-45 -mt-1.5 ${isHovered ? 'bg-neutral-900 dark:bg-white' : 'bg-white dark:bg-neutral-900 group-hover:bg-neutral-900 dark:group-hover:bg-white'}`}></div>
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
