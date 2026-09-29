import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Plus, Minus } from 'lucide-react';

export default function SearchBar() {
  const [activeInput, setActiveInput] = useState(null); // 'location', 'date', 'guests'
  const [location, setLocation] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  const searchBarRef = useRef(null);

  const destinations = ['Samarqand', 'Buxoro', 'Xiva', 'Zomin', 'Toshkent', 'Farg\'ona'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setActiveInput(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mx-auto max-w-4xl" ref={searchBarRef}>
      <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl transition-shadow">
        
        {/* Where to? */}
        <div 
          className={`relative flex-1 rounded-full px-6 py-3 cursor-pointer transition-colors ${activeInput === 'location' ? 'bg-neutral-100 dark:bg-neutral-700 shadow-inner' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
          onClick={() => setActiveInput('location')}
        >
          <label className="block text-[11px] font-bold text-neutral-900 dark:text-white cursor-pointer">Qayerga?</label>
          <input 
            type="text" 
            placeholder="Shahar yoki mehmonxona" 
            className="w-full bg-transparent text-sm text-neutral-600 dark:text-neutral-300 outline-none placeholder-neutral-400 dark:placeholder-neutral-500 truncate cursor-pointer"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            readOnly
          />
          {activeInput === 'location' && (
            <div className="absolute left-0 top-full mt-4 w-80 rounded-2xl bg-white dark:bg-neutral-800 p-4 shadow-xl border border-neutral-100 dark:border-neutral-700 z-50">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-3 px-2">Mashhur yo'nalishlar</h4>
              <ul className="space-y-1">
                {destinations.map((dest) => (
                  <li key={dest}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(dest);
                        setActiveInput('date');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700">
                        <MapPin className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{dest}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700"></div>

        {/* When? */}
        <div 
          className={`relative flex-1 rounded-full px-6 py-3 cursor-pointer transition-colors ${activeInput === 'date' ? 'bg-neutral-100 dark:bg-neutral-700 shadow-inner' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
          onClick={() => setActiveInput('date')}
        >
          <label className="block text-[11px] font-bold text-neutral-900 dark:text-white cursor-pointer">Qachon?</label>
          <input 
            type="text" 
            placeholder="Sanani tanlang" 
            className="w-full bg-transparent text-sm text-neutral-600 dark:text-neutral-300 outline-none placeholder-neutral-400 dark:placeholder-neutral-500 truncate cursor-pointer"
            readOnly
            value="15 Okt - 20 Okt"
          />
        </div>

        <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700"></div>

        {/* Who? */}
        <div 
          className={`relative flex-1 rounded-full pl-6 pr-2 py-2 cursor-pointer transition-colors flex items-center justify-between ${activeInput === 'guests' ? 'bg-neutral-100 dark:bg-neutral-700 shadow-inner' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
          onClick={() => setActiveInput('guests')}
        >
          <div>
            <label className="block text-[11px] font-bold text-neutral-900 dark:text-white cursor-pointer">Kimlar?</label>
            <span className="block text-sm text-neutral-600 dark:text-neutral-300 truncate">
              {adults + children > 0 ? `${adults + children} mehmon` : 'Mehmonlar soni'}
            </span>
          </div>

          <button className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-colors flex-shrink-0">
             <Search className="h-5 w-5" />
          </button>

          {activeInput === 'guests' && (
            <div className="absolute right-0 top-full mt-4 w-80 rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-xl border border-neutral-100 dark:border-neutral-700 z-50 cursor-default" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-700">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Kattalar</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">13 va undan katta</p>
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
  );
}
