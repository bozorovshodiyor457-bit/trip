import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Plus, Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatDateRange(start, end) {
  if (!start && !end) return 'Sanani tanlang';
  const formatSingle = (str) => {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };
  if (start && end) {
    return `${formatSingle(start)} - ${formatSingle(end)}`;
  }
  return formatSingle(start || end);
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [activeInput, setActiveInput] = useState(null); // 'location', 'date', 'guests'
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  const searchBarRef = useRef(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setActiveInput(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.stopPropagation();
    setIsMobileModalOpen(false);
    setActiveInput(null);

    const params = new URLSearchParams();
    if (location.trim()) params.append('search', location.trim());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (adults) params.append('adults', adults);
    if (children) params.append('children', children);

    navigate(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setLocation('');
    setStartDate('');
    setEndDate('');
    setAdults(2);
    setChildren(0);
  };

  const formattedDates = formatDateRange(startDate, endDate);

  return (
    <>
    {/* Mobile Fake Search Button */}
    <div className="sm:hidden px-4 mb-4" onClick={() => setIsMobileModalOpen(true)}>
      <div className="flex items-center gap-3 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 shadow-sm cursor-pointer">
        <Search className="h-5 w-5 text-neutral-900 dark:text-white shrink-0" />
        <div className="flex flex-col items-start overflow-hidden">
          <span className="text-sm font-semibold text-neutral-900 dark:text-white truncate w-full text-left">
            {location || 'Qayerga bormoqchisiz?'}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate w-full text-left">
            {formattedDates} • {adults + children} sayohatchi
          </span>
        </div>
      </div>
    </div>

    {/* Mobile Search Modal (Bottom Sheet) */}
    {isMobileModalOpen && (
      <div className="fixed inset-0 z-50 flex items-end sm:hidden bg-black/50 backdrop-blur-xs">
        <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-t-3xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-lg font-bold text-neutral-900 dark:text-white">Sayohat qidiruvi</span>
            <button 
              onClick={() => setIsMobileModalOpen(false)} 
              className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* 1. Qayerga? (No static city pills) */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Qayerga?</span>
              </h3>
              <div className="relative border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 flex items-center bg-neutral-50 dark:bg-neutral-900">
                <Search className="h-4 w-4 text-neutral-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  className="w-full bg-transparent outline-none text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
                  placeholder="Shahar yoki mehmonxona kiriting"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
                {location && (
                  <button onClick={() => setLocation('')} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Qachon? (Interactive Date Picker) */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Qachon?</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Boshlanish sanasi</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Tugash sanasi</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                Tanlangan sana: {formattedDates}
              </p>
            </div>

            {/* 3. Kimlar? (Guests) */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Sayohatchilar</span>
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Kattalar</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">13 yosh va undan katta</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 disabled:opacity-30">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-neutral-900 dark:text-white">{adults}</span>
                  <button onClick={() => setAdults(adults + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-700">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Bolalar</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">2-12 yosh</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 disabled:opacity-30">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-neutral-900 dark:text-white">{children}</span>
                  <button onClick={() => setChildren(children + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
            <button onClick={handleClear} className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 underline px-2">
              Tozalash
            </button>
            <button 
              onClick={handleSearchSubmit} 
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-emerald-700 active:scale-[0.99] transition-all"
            >
              <Search className="h-5 w-5" />
              <span>Qidirish</span>
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Desktop Search Bar */}
    <div className="hidden sm:block relative mx-auto max-w-4xl w-full px-2 sm:px-0" ref={searchBarRef}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-3xl sm:rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl transition-shadow sm:divide-x divide-y sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700 w-full overflow-hidden sm:overflow-visible relative">
        
        {/* Where to? */}
        <div 
          className={`relative flex-1 px-6 py-4 sm:py-3 cursor-pointer transition-colors ${activeInput === 'location' ? 'bg-neutral-100 dark:bg-neutral-700 sm:rounded-l-full' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:rounded-l-full'}`}
          onClick={() => setActiveInput('location')}
        >
          <label className="block text-[11px] font-bold text-neutral-900 dark:text-white cursor-pointer">Qayerga?</label>
          <input 
            type="text" 
            placeholder="Shahar yoki mehmonxona" 
            className="w-full bg-transparent text-sm text-neutral-600 dark:text-neutral-300 outline-none placeholder-neutral-400 dark:placeholder-neutral-500 truncate cursor-pointer"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* When? (Interactive Date Picker) */}
        <div 
          className={`relative flex-1 px-6 py-4 sm:py-3 cursor-pointer transition-colors ${activeInput === 'date' ? 'bg-neutral-100 dark:bg-neutral-700' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
          onClick={() => setActiveInput('date')}
        >
          <label className="block text-[11px] font-bold text-neutral-900 dark:text-white cursor-pointer">Qachon?</label>
          <span className="block text-sm text-neutral-600 dark:text-neutral-300 truncate">
            {formattedDates}
          </span>

          {activeInput === 'date' && (
            <div className="absolute left-0 top-full mt-4 w-80 rounded-2xl bg-white dark:bg-neutral-800 p-4 shadow-xl border border-neutral-100 dark:border-neutral-700 z-50 cursor-default" onClick={e => e.stopPropagation()}>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-3">Safar sanalarini tanlang</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Boshlanish sanasi</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Tugash sanasi</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sayohatchilar */}
        <div 
          className={`relative flex-1 pl-6 pr-2 py-2 cursor-pointer transition-colors flex flex-row items-center justify-between ${activeInput === 'guests' ? 'bg-neutral-100 dark:bg-neutral-700 sm:rounded-r-full' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:rounded-r-full'}`}
          onClick={() => setActiveInput('guests')}
        >
          <div className="py-2 sm:py-0">
            <label className="block text-[11px] font-bold text-neutral-900 dark:text-white cursor-pointer">Sayohatchilar</label>
            <span className="block text-sm text-neutral-600 dark:text-neutral-300 truncate">
              {adults + children > 0 ? `${adults + children} sayohatchi` : 'Sayohatchilar soni'}
            </span>
          </div>

          <button 
            type="button"
            onClick={handleSearchSubmit} 
            className="ml-2 flex h-12 items-center gap-2 rounded-full bg-emerald-600 px-5 text-white font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors flex-shrink-0"
          >
             <Search className="h-4 w-4" />
             <span className="hidden lg:inline">Qidirish</span>
          </button>

          {activeInput === 'guests' && (
            <div className="absolute right-0 top-full mt-4 w-80 rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-xl border border-neutral-100 dark:border-neutral-700 z-50 cursor-default" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-700">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Kattalar</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">13 yosh va undan katta</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white disabled:opacity-30">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center text-sm font-medium text-neutral-900 dark:text-white">{adults}</span>
                  <button onClick={() => setAdults(adults + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Bolalar</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">2-12 yosh</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white disabled:opacity-30">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center text-sm font-medium text-neutral-900 dark:text-white">{children}</span>
                  <button onClick={() => setChildren(children + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
