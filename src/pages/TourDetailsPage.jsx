import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Star, MapPin, Clock, Check, X, ShieldCheck, Heart, Share, 
  Calendar, Users, ChevronDown, ChevronUp, Loader2, 
  Plus, Minus, ArrowLeft
} from 'lucide-react';
import tourService from '../services/tourService';
import reviewService from '../services/reviewService';
import interactionService from '../services/interactionService';
import chatService from '../services/chatService';

export default function TourDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('group'); // group, individual
  const [openDay, setOpenDay] = useState(0);
  const [tour, setTour] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isChatStarting, setIsChatStarting] = useState(false);

  // Booking Widget States
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState("Sanani tanlang");
  
  // Modals
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTourData() {
      if (!id) {
        setIsLoading(false);
        setError("Tur kodi ko'rsatilmagan");
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        console.log(`API Request: GET /api/b2c/tours/${id}`);
        const data = await tourService.getTourById(id);
        console.log(`API Response: GET /api/b2c/tours/${id}`, data);

        if (isMounted) {
          const detail = data?.tour || data?.data?.tour || data?.data || (typeof data === 'object' ? data : null);
          if (!detail) {
            setError("Tur topilmadi");
            setTour(null);
          } else {
            setTour(detail);

            // If options/departures exist, fetch them
            const optionId = detail?.options?.[0]?._id || detail?.optionId || detail?.id || id;
            if (optionId) {
              try {
                const depRes = await tourService.getOptionDepartures(optionId);
                const slots = depRes?.departures || depRes?.data || (Array.isArray(depRes) ? depRes : []);
                if (slots.length > 0) {
                  setAvailableDates(slots);
                  const firstSlot = slots[0]?.date || slots[0]?.range || slots[0]?.startDate;
                  if (firstSlot) setSelectedDateRange(firstSlot);
                }
              } catch (depErr) {
                console.warn("Departures API notice:", depErr);
              }
            }
          }
        }
      } catch (err) {
        console.error(`API Error: GET /api/b2c/tours/${id} failed:`, err);
        if (isMounted) {
          setError("Tur ma'lumotlarini yuklab bo'lmadi");
          setTour(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }

      try {
        const revData = await reviewService.getTourReviews(id);
        if (isMounted) {
          setReviews(revData?.reviews || revData?.data || []);
        }
      } catch (err) {
        console.warn('Reviews API notice:', err);
      }
    }
    loadTourData();
    return () => { isMounted = false; };
  }, [id]);

  const handleToggleFav = async () => {
    setIsFavorite(!isFavorite);
    try {
      if (id) await interactionService.toggleFavorite(id);
    } catch (err) {
      console.warn('Toggle favorite error:', err);
    }
  };

  const handleAskQuestion = async () => {
    if (!tour) return;
    setIsChatStarting(true);
    try {
      const res = await chatService.startChat({
        tourId: id || tour._id || tour.id,
        organizerId: tour.organizer?._id || tour.organizer?.id,
        initialMessage: `Salom! "${tour.title || tour.name}" turi bo'yicha savolim bor edi.`
      });
      const chatId = res?.chat?._id || res?._id || res?.id;
      if (chatId) {
        navigate(`/chat?id=${chatId}`);
      } else {
        navigate('/chat');
      }
    } catch (err) {
      console.warn('Start chat error, opening chat page:', err);
      navigate('/chat');
    } finally {
      setIsChatStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[450px]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400 mb-3" />
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Tur ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Tur topilmadi yoki o'chirilgan
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
            {error || "Siz qidirgan tur mavjud emas yoki tizimdan olib tashlangan."}
          </p>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Turlarga qaytish</span>
          </button>
        </div>
      </div>
    );
  }

  const tourTitle = tour.title || tour.name || "Sayohat turi";

  // Price Extraction with Comprehensive Fallbacks
  const rawUnitPrice = Number(
    tour?.price_uzs ?? 
    tour?.priceUZS ?? 
    tour?.price ?? 
    tour?.price_from ?? 
    tour?.basePrice ?? 
    tour?.options?.[0]?.price ?? 
    tour?.minPrice ?? 
    450000
  );

  const optionPrice = activeTab === 'individual'
    ? (tour?.individualPrice || (rawUnitPrice > 0 ? Math.round(rawUnitPrice * 1.4) : 630000))
    : rawUnitPrice;

  // Format price helper
  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return `${new Intl.NumberFormat('uz-UZ').format(num)} so'm`;
  };

  // Format date display helper
  const formatDisplayDate = (raw) => {
    if (!raw || raw === "Sanani tanlang" || raw === "Tanlanmagan") return "Sanani tanlang";
    const cleaned = String(raw).replace(/^Sana\s+/i, '').trim();
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    }
    return cleaned || "Sanani tanlang";
  };

  // Calculations
  const totalGuests = Math.max(1, (adults || 1) + (childrenCount || 0));
  const calculatedTotalPrice = optionPrice * totalGuests;
  const guestsLabel = `${totalGuests} kishi (${adults} katta${childrenCount > 0 ? `, ${childrenCount} bola` : ''})`;

  // Extract gallery images safely
  const tourImages = Array.isArray(tour.images) && tour.images.length > 0 
    ? tour.images 
    : [tour.image || tour.cover_image || tour.image_url || "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80"];

  const handleProceedBooking = () => {
    if (!selectedDateRange || selectedDateRange === "Sanani tanlang" || selectedDateRange === "Tanlanmagan") {
      setIsDateModalOpen(true);
      return;
    }
    const bookingDetails = {
      tourId: id || tour._id || tour.id || 1,
      title: tourTitle,
      dateRange: selectedDateRange,
      adults,
      children: childrenCount,
      totalGuests,
      pricePerPerson: optionPrice,
      totalPrice: calculatedTotalPrice
    };
    sessionStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
    navigate('/checkout');
  };

  const programList = Array.isArray(tour.program) ? tour.program : [];
  const inclusionsList = Array.isArray(tour.inclusions) ? tour.inclusions : [];
  const exclusionsList = Array.isArray(tour.exclusions) ? tour.exclusions : [];
  const meetingPointStr = tour.meetingPoint || tour.location || tour.city || "Ko'rsatilmagan";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-32 sm:pb-8">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
          {tourTitle}
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-sm transition-colors">
            <Share className="h-4 w-4" /> <span className="hidden sm:inline">Ulashish</span>
          </button>
          <button 
            onClick={handleToggleFav}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors ${
              isFavorite 
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} /> 
            <span className="hidden sm:inline">{isFavorite ? 'Saqlangan' : 'Saqlash'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
        <div className="flex items-center gap-1 font-medium text-neutral-900 dark:text-white">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {tour.rating || tour.rating_avg || 4.9} <span className="text-neutral-500 dark:text-neutral-400 font-normal underline cursor-pointer">({reviews.length || tour.reviewsCount || 0} sharh)</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-neutral-400" />
          {String(meetingPointStr).split(',')[0]}
        </div>
        <span>•</span>
        <div className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-700 dark:text-neutral-300">
          {tour.category || "Madaniy tur"}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-2xl overflow-hidden mb-12 h-[350px] sm:h-[450px]">
        <div className="md:col-span-2 h-full">
          <img src={tourImages[0]} alt={tourTitle} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          <img src={tourImages[1] || tourImages[0]} alt={tourTitle} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
          <img src={tourImages[2] || tourImages[0]} alt={tourTitle} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
        <div className="hidden md:block h-full">
          <img src={tourImages[3] || tourImages[0]} alt={tourTitle} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
        </div>
      </div>

      {/* Details & Booking Sidebar Grid */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Details */}
        <div className="w-full lg:w-2/3 space-y-12">
          
          {/* Tour Description */}
          {tour.description && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Sayohat haqida</h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-base whitespace-pre-line">
                {tour.description}
              </p>
            </div>
          )}

          {/* Program Section */}
          {programList.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Sayohat dasturi</h2>
              <div className="space-y-4">
                {programList.map((item, index) => (
                  <div key={index} className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50">
                    <button
                      onClick={() => setOpenDay(openDay === index ? -1 : index)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">{item.day || `Kun ${index + 1}`}</span>
                        <span>{item.title}</span>
                      </div>
                      {openDay === index ? <ChevronUp className="h-5 w-5 text-neutral-400" /> : <ChevronDown className="h-5 w-5 text-neutral-400" />}
                    </button>
                    {openDay === index && (
                      <div className="p-4 pt-0 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 mt-2">
                        {item.desc || item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          {(inclusionsList.length > 0 || exclusionsList.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              {inclusionsList.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Narxga kiritilgan</h3>
                  <ul className="space-y-2.5">
                    {inclusionsList.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                        <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{typeof inc === 'string' ? inc : inc.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {exclusionsList.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Narxga kiritilmagan</h3>
                  <ul className="space-y-2.5">
                    {exclusionsList.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                        <X className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{typeof exc === 'string' ? exc : exc.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Map Location */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Uchrashuv nuqtasi</h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">{meetingPointStr}</p>
            <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/6/41/24.png')] bg-cover bg-center opacity-50 mix-blend-multiply dark:mix-blend-screen dark:opacity-30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-10 w-10 text-red-500 drop-shadow-md" />
              </div>
            </div>
          </div>
          
        </div>

        {/* Sticky Booking Widget */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-6">
            
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">{formatPrice(calculatedTotalPrice)}</span>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 block sm:inline sm:ml-1">(jami)</span>
              </div>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {formatPrice(optionPrice)} / kishi
              </span>
            </div>

            <div className="flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 mb-6">
              <button 
                onClick={() => setActiveTab('group')}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${activeTab === 'group' ? 'bg-white dark:bg-neutral-700 shadow text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
              >
                Guruhli tur
              </button>
              <button 
                onClick={() => setActiveTab('individual')}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${activeTab === 'individual' ? 'bg-white dark:bg-neutral-700 shadow text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
              >
                Individual
              </button>
            </div>

            <div className="space-y-4 mb-6 relative">
              {/* Date selector trigger */}
              <div 
                onClick={() => setIsDateModalOpen(true)}
                className="border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-neutral-800 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white uppercase">Sana</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{formatDisplayDate(selectedDateRange)}</p>
                </div>
                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              {/* Guests selector trigger */}
              <div 
                onClick={() => setIsGuestsModalOpen(true)}
                className="border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-neutral-800 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white uppercase">Mehmonlar</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{guestsLabel}</p>
                </div>
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-transparent dark:border-emerald-900/50 text-sm font-medium px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>Safar kafolatlangan! Joylar soni chegaralangan.</span>
            </div>

            <button 
              onClick={handleProceedBooking}
              className="w-full bg-emerald-600 text-white font-bold text-lg py-3.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25 mb-3"
            >
              Bron qilish ({formatPrice(calculatedTotalPrice)})
            </button>

            <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-4">Sizdan hozir pul yechilmaydi</p>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" /> Bo'sh sanalarni tanlang
              </h3>
              <button onClick={() => setIsDateModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {availableDates.length > 0 ? (
                availableDates.map((item, idx) => {
                  const dateText = item.date || item.range || item.startDate || `Sana ${idx + 1}`;
                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => {
                        setSelectedDateRange(dateText);
                        setIsDateModalOpen(false);
                      }}
                      className={`p-3.5 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                        selectedDateRange === dateText 
                          ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold' 
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span className="text-sm">{dateText}</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        {item.status || "Mavjud"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm text-neutral-500">
                  Bo'sh kunlar ko'rsatilmagan. Ixtiyoriy sanani tanlashingiz mumkin.
                </div>
              )}
            </div>

            <button
              onClick={() => setIsDateModalOpen(false)}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Guests Picker Modal */}
      {isGuestsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" /> Mehmonlar sonini tanlang
              </h3>
              <button onClick={() => setIsGuestsModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 mb-6">
              {/* Adults Counter */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <div>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">Kattalar</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">12 yoshdan yuqori</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    disabled={adults <= 1}
                    className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-neutral-900 dark:text-white text-base w-4 text-center">{adults}</span>
                  <button
                    onClick={() => setAdults(prev => prev + 1)}
                    className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Children Counter */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <div>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">Bolalar</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">2-11 yoshgacha</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildrenCount(prev => Math.max(0, prev - 1))}
                    disabled={childrenCount <= 0}
                    className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-neutral-900 dark:text-white text-base w-4 text-center">{childrenCount}</span>
                  <button
                    onClick={() => setChildrenCount(prev => prev + 1)}
                    className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 mb-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex justify-between items-center text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span>Hisoblangan summa:</span>
              <span className="text-sm font-extrabold">{formatPrice(calculatedTotalPrice)}</span>
            </div>

            <button
              onClick={() => setIsGuestsModalOpen(false)}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
              Tayyor
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl flex justify-between items-center gap-4">
        <div>
          <span className="text-xl font-black text-neutral-900 dark:text-white">{formatPrice(calculatedTotalPrice)}</span>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">{guestsLabel}</span>
        </div>
        <button 
          onClick={handleProceedBooking}
          className="flex-1 bg-emerald-600 text-white font-bold text-base py-3.5 px-6 rounded-xl hover:bg-emerald-700 transition-all shadow-md text-center"
        >
          Bron qilish
        </button>
      </div>
    </div>
  );
}
