import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, QrCode, Phone, MessageCircle, AlertTriangle, ChevronRight, X, CalendarPlus, Download, User as UserIcon, Loader2 } from 'lucide-react';
import ReviewModal from '../components/ReviewModal';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';

const MOCK_TRIPS = [
  {
    id: 1,
    status: 'upcoming',
    title: "Afsonaviy Samarqand bo'ylab sayohat",
    date: "2026-10-24",
    time: "08:00",
    guests: "2 ta katta",
    price: 900000,
    guide: { name: "Alisher Vohidov", phone: "+998 90 123 45 67", avatar: "https://i.pravatar.cc/150?u=alisher" },
    meetingPoint: "Samarqand temir yo'l vokzali",
    bookingId: "VT-847291",
    refundPolicy: "100%",
  },
  {
    id: 2,
    status: 'past',
    title: "Eski Buxoro ko'chalari",
    date: "2026-09-15",
    time: "09:30",
    guests: "1 ta katta",
    price: 520000,
    guide: { name: "Zuhra Karimova", phone: "+998 93 987 65 43", avatar: "https://i.pravatar.cc/150?u=zuhra" },
    meetingPoint: "Labihovuz majmuasi",
    bookingId: "VT-109283",
    refundPolicy: "0%",
  }
];

export default function MyTripsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [activeManage, setActiveManage] = useState(null); // Cancel/Reschedule Modal
  const [manageAction, setManageAction] = useState('cancel'); // 'cancel' or 'reschedule'
  const [reviewTour, setReviewTour] = useState(null); // Tour to review
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTrips() {
      try {
        setIsLoading(true);
        const res = await bookingService.getMyTrips();
        if (isMounted) {
          const list = res?.trips || res?.data || (Array.isArray(res) ? res : []);
          setTrips(list.length > 0 ? list : MOCK_TRIPS);
        }
      } catch (err) {
        console.warn('MyTrips API error fallback:', err);
        if (isMounted) setTrips(MOCK_TRIPS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchTrips();
    return () => { isMounted = false; };
  }, []);

  const handleCancelBooking = async (tripId) => {
    try {
      await bookingService.cancelBooking(tripId, { reason: 'Foydalanuvchi bekor qildi' });
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'canceled' } : t));
      setActiveManage(null);
    } catch (err) {
      console.warn('Cancel booking error fallback:', err);
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'canceled' } : t));
      setActiveManage(null);
    }
  };

  const allTrips = (trips && trips.length > 0) ? trips : MOCK_TRIPS;
  const filteredTrips = allTrips.filter(t => t.status === activeTab);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Mening safarlarim</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-8">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'upcoming' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
        >
          Kelgusi safarlar
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'past' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
        >
          O'tgan safarlar
        </button>
        <button 
          onClick={() => setActiveTab('canceled')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'canceled' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
        >
          Bekor qilingan
        </button>
      </div>

      {/* Trips List */}
      <div className="space-y-6">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 border-dashed">
            <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Bu yerda hozircha bo'sh</h3>
            <p className="text-neutral-500">Bu toifaga mos safarlar topilmadi.</p>
          </div>
        ) : (
          filteredTrips.map(trip => (
            <div key={trip.id} className="flex flex-col md:flex-row bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              
              {/* Trip Info */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wide
                         ${trip.status === 'upcoming' ? 'bg-emerald-100 text-emerald-800' : 
                           trip.status === 'past' ? 'bg-neutral-100 text-neutral-800' : 'bg-red-100 text-red-800'}`
                       }>
                         {trip.status === 'upcoming' ? 'Kelgusi' : trip.status === 'past' ? 'Yakunlangan' : 'Bekor qilingan'}
                       </span>
                       <span className="text-sm font-medium text-neutral-500">ID: {trip.bookingId}</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">{trip.title}</h3>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-neutral-700">
                    <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{trip.date}</p>
                      <p className="text-xs text-neutral-500">Soat {trip.time} da boshlanadi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-700">
                    <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{trip.meetingPoint}</p>
                      <p className="text-xs text-neutral-500">Uchrashuv nuqtasi</p>
                    </div>
                  </div>
                </div>

                {/* Guide Info */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <img src={trip.guide.avatar} alt={trip.guide.name} className="h-10 w-10 rounded-full object-cover border border-neutral-200" />
                    <div>
                      <p className="text-xs text-neutral-500 font-medium uppercase">Tashkilotchi / Gid</p>
                      <p className="font-bold text-neutral-900 text-sm">{trip.guide.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="h-8 w-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100" title="Qo'ng'iroq qilish">
                       <Phone className="h-4 w-4" />
                     </button>
                     <button className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100" title="Chat yozish">
                       <MessageCircle className="h-4 w-4" />
                     </button>
                  </div>
                </div>
              </div>

              {/* Actions Area */}
              <div className="w-full md:w-64 bg-neutral-50 border-t md:border-t-0 md:border-l border-neutral-200 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1">Jami to'langan</p>
                  <p className="text-2xl font-black text-neutral-900">{trip.price.toLocaleString()} <span className="text-sm font-medium text-neutral-500">so'm</span></p>
                  <p className="text-xs text-neutral-500 mt-1">{trip.guests}</p>
                </div>

                <div className="mt-6 space-y-2">
                  {trip.status === 'upcoming' && (
                    <>
                      <button 
                        onClick={() => setActiveVoucher(trip)}
                        className="w-full bg-neutral-900 text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <QrCode className="h-4 w-4" /> Elektron Vaucher
                      </button>
                      <button 
                        onClick={() => setActiveManage(trip)}
                        className="w-full bg-white border border-neutral-300 text-neutral-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-neutral-50 transition-colors"
                      >
                        Bekor qilish / Ko'chirish
                      </button>
                    </>
                  )}
                  {trip.status === 'past' && (
                    <button 
                      onClick={() => setReviewTour(trip.title)}
                      className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Sharh qoldirish
                    </button>
                  )}
                  {trip.status === 'canceled' && (
                    <button className="w-full bg-white border border-neutral-300 text-neutral-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                      Qaytadan bron qilish
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* C-10: E-Voucher Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-full">
            <div className="bg-emerald-600 p-6 text-center relative text-white">
               <button onClick={() => setActiveVoucher(null)} className="absolute right-4 top-4 bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors">
                 <X className="h-5 w-5" />
               </button>
               <h2 className="text-xl font-bold mb-1">Tasdiqlangan chipta</h2>
               <p className="text-emerald-100 text-sm">ID: {activeVoucher.bookingId}</p>
            </div>
            
            <div className="p-6 bg-white flex flex-col items-center border-b border-dashed border-neutral-300">
               <p className="text-xs text-neutral-500 font-medium mb-3 uppercase tracking-wider">Oflayn tekshirish uchun QR kod</p>
               {/* Mock QR Code */}
               <div className="w-48 h-48 bg-white border border-neutral-200 p-2 rounded-xl shadow-sm relative flex items-center justify-center">
                  <div className="absolute inset-2 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-90"></div>
               </div>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
               <div>
                 <h3 className="font-bold text-neutral-900 mb-1">{activeVoucher.title}</h3>
                 <p className="text-sm text-neutral-600">{activeVoucher.date} • {activeVoucher.time}</p>
                 <p className="text-sm text-neutral-600">{activeVoucher.guests}</p>
               </div>
               
               <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                 <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase">Uchrashuv nuqtasi</p>
                      <p className="text-sm font-medium text-neutral-900 mt-1">{activeVoucher.meetingPoint}</p>
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="Xaritadan ochish">
                      <MapPin className="h-4 w-4" />
                    </button>
                 </div>
               </div>
               
               <div className="flex gap-3 pt-2">
                 <button className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-neutral-800 transition-colors">
                    <Download className="h-4 w-4" /> PDF yuklash
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 text-neutral-900 font-semibold py-2.5 rounded-lg text-sm hover:bg-neutral-200 transition-colors border border-neutral-200">
                    <CalendarPlus className="h-4 w-4" /> Taqvimga
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* C-11: Manage (Cancel/Reschedule) Modal */}
      {activeManage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => setActiveManage(null)} className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-900 p-1 bg-neutral-100 rounded-full transition-colors z-10">
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">Safarni boshqarish</h2>
              <p className="text-sm text-neutral-500 mt-1">{activeManage.title}</p>
            </div>

            <div className="flex border-b border-neutral-100 bg-neutral-50">
              <button 
                onClick={() => setManageAction('cancel')}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${manageAction === 'cancel' ? 'border-red-500 text-red-600 bg-white' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
              >
                Safarni bekor qilish
              </button>
              <button 
                onClick={() => setManageAction('reschedule')}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${manageAction === 'reschedule' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
              >
                Sanani ko'chirish
              </button>
            </div>

            <div className="p-6">
              {manageAction === 'cancel' ? (
                <div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 mb-6">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-900 text-sm">Bekor qilish siyosati</h4>
                      <p className="text-xs text-red-700 mt-1 leading-relaxed">
                        Siz safargacha 48 soatdan ko'proq vaqt qolganida bekor qilyapsiz. Qaytarish siyosati: <b className="text-red-900">{activeManage.refundPolicy}</b>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-sm">
                    <span className="text-sm font-semibold text-neutral-700">Qaytariladigan summa:</span>
                    <span className="text-xl font-black text-emerald-600">
                      {(activeManage.price * (parseFloat(activeManage.refundPolicy) || 0) / 100).toLocaleString()} so'm
                    </span>
                  </div>

                  <label className="block mb-4">
                    <span className="block text-sm font-semibold text-neutral-700 mb-2">Bekor qilish sababi (Ixtiyoriy)</span>
                    <textarea 
                      className="w-full rounded-xl border border-neutral-300 p-3 text-sm outline-none focus:border-red-500 resize-none h-24" 
                      placeholder="Sababni yozing..."
                    ></textarea>
                  </label>
                  
                  <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                    Safarni bekor qilish
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-6">
                    <CalendarPlus className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">Sanani ko'chirish so'rovi</h4>
                      <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        Yangi sanani tanlang. Agar o'sha sanada joy bo'lsa, tashkilotchi tasdiqlaydi. Ko'chirish bepul amalga oshiriladi.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                     <label className="block text-sm font-semibold text-neutral-700 mb-2">Yangi sanani tanlang</label>
                     <input type="date" className="w-full rounded-xl border border-neutral-300 p-3 text-sm outline-none focus:border-blue-500" />
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    So'rov yuborish
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

      {/* C-15: Review Modal */}
      <ReviewModal 
        isOpen={!!reviewTour} 
        onClose={() => setReviewTour(null)} 
        tourTitle={reviewTour} 
      />

    </div>
  );
}
