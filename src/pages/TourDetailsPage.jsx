import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Globe, Check, X, ShieldCheck, Heart, Share, Calendar, Users, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const MOCK_TOUR = {
  id: 1,
  title: "Afsonaviy Samarqand bo'ylab 2 kunlik sayohat",
  category: "Madaniy tur",
  duration: "2 kun",
  languages: ["O'zbek", "Rus", "Ingliz"],
  rating: 4.9,
  reviewsCount: 128,
  priceUZS: 450000,
  images: [
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
    "https://images.unsplash.com/photo-1627993077749-f0275815ea7f?w=600&q=80",
    "https://images.unsplash.com/photo-1584639906659-450f681a8c51?w=600&q=80",
    "https://images.unsplash.com/photo-1551524164-687a5acf3905?w=600&q=80",
    "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=600&q=80",
  ],
  inclusions: ["Konditsionerli transport", "Professional gid xizmati", "Ekskursiya davomida ichimlik suvi"],
  exclusions: ["Muzeylarga kirish chiptalari", "Tushlik va kechki ovqat", "Shaxsiy xarajatlar"],
  meetingPoint: "Samarqand temir yo'l vokzali, asosiy kirish joyi",
  program: [
    { day: "1-kun", title: "Ko'hna shaharga kirib kelish", desc: "Registon maydoni, Go'ri Amir maqbarasi va Bibixonim masjidiga tashrif. Kechki ovqat milliy choyxonada." },
    { day: "2-kun", title: "Yulduzlar ilmi va ziyorat", desc: "Ulug'bek rasadxonasi, Shohi Zinda majmuasi va Siyob bozorida erkin vaqt." }
  ],
  organizer: {
    name: "Alisher Vohidov",
    type: "Gid",
    isVerified: true,
    experience: "8 yil",
    languages: "UZ, RU, EN",
    avatar: "https://i.pravatar.cc/150?u=alisher",
    rating: 4.9,
    reviewCount: 340
  },
  reviewsBreakdown: {
    guide: 5.0,
    program: 4.8,
    organization: 4.9,
    value: 4.7
  }
};

export default function TourDetailsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('group'); // group, individual
  const [openDay, setOpenDay] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          {MOCK_TOUR.title}
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors">
            <Share className="h-4 w-4" /> <span className="hidden sm:inline">Ulashish</span>
          </button>
          <button className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors">
            <Heart className="h-4 w-4" /> <span className="hidden sm:inline">Saqlash</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-8">
        <div className="flex items-center gap-1 font-medium text-neutral-900">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {MOCK_TOUR.rating} <span className="text-neutral-500 font-normal underline cursor-pointer">({MOCK_TOUR.reviewsCount} sharh)</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-neutral-400" />
          {MOCK_TOUR.meetingPoint.split(',')[0]}
        </div>
        <span>•</span>
        <div className="px-2 py-0.5 rounded bg-neutral-100 font-medium text-neutral-700">
          {MOCK_TOUR.category}
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-10 h-auto md:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden">
        <div className="md:col-span-2 h-64 md:h-full relative group cursor-pointer">
          <img src={MOCK_TOUR.images[0]} alt="Gallery 1" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <div className="h-full relative group cursor-pointer overflow-hidden"><img src={MOCK_TOUR.images[1]} alt="Gallery 2" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
          <div className="h-full relative group cursor-pointer overflow-hidden"><img src={MOCK_TOUR.images[2]} alt="Gallery 3" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <div className="h-full relative group cursor-pointer overflow-hidden"><img src={MOCK_TOUR.images[3]} alt="Gallery 4" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
          <div className="h-full relative group cursor-pointer overflow-hidden"><img src={MOCK_TOUR.images[4]} alt="Gallery 5" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 space-y-10">
          
          {/* Quick Info Bar */}
          <div className="flex flex-wrap gap-6 py-4 border-y border-neutral-200">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Davomiyligi</p>
                <p className="font-semibold text-neutral-900">{MOCK_TOUR.duration}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-neutral-200 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Tillar</p>
                <p className="font-semibold text-neutral-900">{MOCK_TOUR.languages.join(', ')}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-neutral-200 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Guruh hajmi</p>
                <p className="font-semibold text-neutral-900">12 kishigacha</p>
              </div>
            </div>
          </div>

          {/* Organizer Profile (C-06 snippet) */}
          <div className="flex items-center justify-between p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-4">
              <img src={MOCK_TOUR.organizer.avatar} alt="Organizer" className="h-16 w-16 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-1">
                  {MOCK_TOUR.organizer.name}
                  {MOCK_TOUR.organizer.isVerified && <ShieldCheck className="h-5 w-5 text-emerald-500" title="Tasdiqlangan tashkilotchi" />}
                </h3>
                <p className="text-sm text-neutral-600">{MOCK_TOUR.organizer.type} • {MOCK_TOUR.organizer.experience} tajriba</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
               <div className="flex items-center justify-end gap-1 font-bold text-neutral-900">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {MOCK_TOUR.organizer.rating}
               </div>
               <p className="text-xs text-neutral-500">{MOCK_TOUR.organizer.reviewCount} sharh</p>
            </div>
          </div>

          {/* Program Accordion */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Tur dasturi</h2>
            <div className="space-y-4">
              {MOCK_TOUR.program.map((day, idx) => (
                <div key={idx} className="border border-neutral-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setOpenDay(openDay === idx ? -1 : idx)}
                    className="w-full flex items-center justify-between p-5 bg-white hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div>
                      <span className="font-semibold text-neutral-900 mr-3">{day.day}</span>
                      <span className="text-neutral-700">{day.title}</span>
                    </div>
                    {openDay === idx ? <ChevronUp className="h-5 w-5 text-neutral-400" /> : <ChevronDown className="h-5 w-5 text-neutral-400" />}
                  </button>
                  {openDay === idx && (
                    <div className="p-5 pt-0 text-neutral-600 bg-white border-t border-neutral-100 leading-relaxed">
                      {day.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Nimalar kiritilgan?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {MOCK_TOUR.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-700">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {inc}
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {MOCK_TOUR.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-500">
                    <X className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                    {exc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Map Mockup */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Uchrashuv nuqtasi</h2>
            <p className="text-neutral-700 mb-4">{MOCK_TOUR.meetingPoint}</p>
            <div className="w-full h-64 bg-neutral-200 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/6/41/24.png')] bg-cover bg-center opacity-50 mix-blend-multiply"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-10 w-10 text-red-500 drop-shadow-md" />
              </div>
            </div>
          </div>
          
        </div>

        {/* Sticky Booking Widget */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 bg-white rounded-2xl border border-neutral-200 shadow-xl p-6">
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-neutral-900">{MOCK_TOUR.priceUZS.toLocaleString('uz-UZ')}</span>
              <span className="text-sm font-medium text-neutral-500">so'm / kishi</span>
            </div>

            <div className="flex rounded-lg bg-neutral-100 p-1 mb-6">
              <button 
                onClick={() => setActiveTab('group')}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${activeTab === 'group' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                Guruhli tur
              </button>
              <button 
                onClick={() => setActiveTab('individual')}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${activeTab === 'individual' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                Individual
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="border border-neutral-300 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-neutral-400">
                <div>
                  <p className="text-xs font-bold text-neutral-900 uppercase">Sana</p>
                  <p className="text-sm text-neutral-600 mt-0.5">24 Okt - 25 Okt</p>
                </div>
                <Calendar className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="border border-neutral-300 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-neutral-400">
                <div>
                  <p className="text-xs font-bold text-neutral-900 uppercase">Mehmonlar</p>
                  <p className="text-sm text-neutral-600 mt-0.5">2 kishi</p>
                </div>
                <Users className="h-5 w-5 text-neutral-400" />
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Safar kafolatlangan! Faqat 3 ta joy qoldi.
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 text-white font-bold text-lg py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md mb-3"
            >
              Bron qilish
            </button>
            
            <button className="w-full bg-white border border-neutral-300 text-neutral-900 font-bold text-sm py-3.5 rounded-xl hover:bg-neutral-50 transition-colors flex justify-center items-center gap-2">
              <MessageCircle className="h-5 w-5" /> Savol berish
            </button>

            <p className="text-center text-xs text-neutral-400 mt-4">Sizdan hozir pul yechilmaydi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
