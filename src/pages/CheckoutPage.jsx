import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Lock, Clock, CreditCard, FileText, ArrowRight, ShieldCheck, Ticket, Loader2 } from 'lucide-react';
import bookingService from '../services/bookingService';
import interactionService from '../services/interactionService';

const BASE_PRICE = 450000;
const CHILD_PRICE = 300000;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Step 1 State
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [extras, setExtras] = useState({ transfer: false, lunch: false });

  // Step 2 State
  const [participants, setParticipants] = useState([{ name: '', dob: '', passport: '' }]);

  // Step 3 State
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);

  // Step 4 State
  const [paymentType, setPaymentType] = useState('full'); // full, advance
  const [paymentMethod, setPaymentMethod] = useState('payme'); // payme, click, uzum, card, invoice
  
  // C-20 Corporate Info
  const [companyInfo, setCompanyInfo] = useState({ inn: '', name: '', bank: '', mfo: '' });

  useEffect(() => {
    // Keep participants array in sync with count
    const totalPeople = adults + children;
    if (participants.length !== totalPeople) {
      const newParts = [...participants];
      while (newParts.length < totalPeople) newParts.push({ name: '', dob: '', passport: '' });
      while (newParts.length > totalPeople) newParts.pop();
      setParticipants(newParts);
    }
  }, [adults, children]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleNext = async () => {
    if (step === 1 && !bookingId) {
      setIsLoading(true);
      try {
        const res = await bookingService.holdBooking({
          adultCount: adults,
          childCount: children,
          notes: extras.transfer ? 'Transfer' : ''
        });
        const id = res?.booking?._id || res?._id || res?.id || 'demo-booking-id';
        setBookingId(id);
      } catch (err) {
        console.warn('Hold booking error fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const updateParticipant = (index, field, value) => {
    const newP = [...participants];
    newP[index][field] = value;
    setParticipants(newP);
  };

  const applyPromo = async (e) => {
    e.preventDefault();
    if (!promo.trim()) return;
    setIsLoading(true);
    try {
      const res = await interactionService.validatePromocode({
        code: promo.trim(),
        amount: subtotal
      });
      const disc = res?.discount || res?.data?.discount || 50000;
      setDiscount(disc);
      alert(`Promokod tasdiqlandi! ${disc.toLocaleString()} so'm chegirma.`);
    } catch (err) {
      console.warn('Promo code validation error:', err);
      if (promo.toLowerCase() === 'sale20') {
        setDiscount(50000);
        alert('Promokod qabul qilindi! 50,000 so\'m chegirma.');
      } else {
        setDiscount(0);
        alert('Noto\'g\'ri yoki muddati o\'tgan promokod.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    const targetId = bookingId || 'demo-booking-id';
    try {
      const res = await bookingService.payBooking(targetId, { provider: paymentMethod });
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }
    } catch (err) {
      console.warn('Real payment endpoint fallback to mock payment:', err);
      try {
        await bookingService.payMockBooking(targetId);
      } catch (mockErr) {
        console.warn('Mock payment error:', mockErr);
      }
    } finally {
      setIsLoading(false);
      navigate(`/status?id=${targetId}`);
    }
  };

  // Calculations
  const subtotal = (adults * BASE_PRICE) + (children * CHILD_PRICE);
  const extrasTotal = (extras.transfer ? 150000 : 0) + (extras.lunch ? (adults + children) * 80000 : 0);
  const total = subtotal + extrasTotal - discount;
  const toPayNow = paymentType === 'advance' ? total * 0.3 : total; // 30% advance

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-neutral-50/30 dark:bg-neutral-900/30 min-h-screen">
      
      {/* Top Bar with Timer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-2 block">
            &larr; Turga qaytish
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Bronni rasmiylashtirish</h1>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
          <Clock className="h-5 w-5" />
          <span className="text-sm font-medium">Joylar siz uchun <b>{formatTime(timeLeft)}</b> saqlanadi</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Stepper */}
        <div className="w-full lg:w-2/3 space-y-8">
          
          {/* Stepper Progress */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar pb-2">
            {[1, 2, 3, 4].map(s => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                    {step > s ? <Check className="h-4 w-4" /> : s}
                  </div>
                  <span className={`text-xs font-medium ${step >= s ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>
                    {s === 1 ? 'Xizmatlar' : s === 2 ? 'Ma\'lumotlar' : s === 3 ? 'Chegirma' : 'To\'lov'}
                  </span>
                </div>
                {s < 4 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}></div>}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Services */}
          {step === 1 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Kimlar boradi?</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Kattalar</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{BASE_PRICE.toLocaleString()} so'm</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white">-</button>
                    <span className="w-4 text-center font-medium text-neutral-900 dark:text-white">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Bolalar (2-12 yosh)</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{CHILD_PRICE.toLocaleString()} so'm</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white">-</button>
                    <span className="w-4 text-center font-medium text-neutral-900 dark:text-white">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white">+</button>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Qo'shimcha xizmatlar</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={extras.transfer} onChange={e => setExtras({...extras, transfer: e.target.checked})} className="h-5 w-5 rounded border-neutral-300 dark:border-neutral-700 accent-emerald-600 dark:accent-emerald-500" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">Aeroport/Vokzaldan transfer</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Kutib olish va yetkazish</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">+150,000 so'm</span>
                </label>
                <label className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={extras.lunch} onChange={e => setExtras({...extras, lunch: e.target.checked})} className="h-5 w-5 rounded border-neutral-300 dark:border-neutral-700 accent-emerald-600 dark:accent-emerald-500" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">Milliy tushlik (Har bir kishi uchun)</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Choyxonada maxsus taomnoma</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">+80,000 so'm</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Participant details */}
          {step === 2 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Ishtirokchilar ma'lumotlari</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Sug'urta va chiptalar rasmiylashtirilishi uchun pasport ma'lumotlarini aniq kiriting.</p>
              
              <div className="space-y-6">
                {participants.map((p, i) => (
                  <div key={i} className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/30">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Ishtirokchi {i + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">F.I.Sh.</label>
                        <input type="text" value={p.name} onChange={e => updateParticipant(i, 'name', e.target.value)} placeholder="Toshmatov Eshmat" className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-neutral-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Tug'ilgan sana</label>
                        <input type="date" value={p.dob} onChange={e => updateParticipant(i, 'dob', e.target.value)} className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-neutral-900 dark:text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Pasport / ID seriya va raqam</label>
                        <input type="text" value={p.passport} onChange={e => updateParticipant(i, 'passport', e.target.value)} placeholder="AA 1234567" className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 uppercase text-neutral-900 dark:text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Promo */}
          {step === 3 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Promokod</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Agar sizda chegirma kodi bo'lsa, quyida kiriting (Masalan: SALE20).</p>
              
              <form onSubmit={applyPromo} className="flex gap-2 max-w-sm">
                <input 
                  type="text" 
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  placeholder="Kodni kiriting" 
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 uppercase font-medium tracking-wide text-neutral-900 dark:text-white" 
                />
                <button type="submit" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                  Qo'llash
                </button>
              </form>
              
              {discount > 0 && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                  <Ticket className="h-5 w-5" />
                  <span className="text-sm font-medium">Tabriklaymiz! Sizga {discount.toLocaleString()} so'm chegirma qo'llanildi.</span>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                Xavfsiz to'lov
              </h2>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">To'lov miqdori</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${paymentType === 'full' ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="radio" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} className="accent-emerald-600 w-4 h-4" />
                      <span className="font-bold text-neutral-900 dark:text-white">To'liq to'lov</span>
                    </div>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white ml-6">{total.toLocaleString()} so'm</p>
                  </label>
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-colors ${paymentType === 'advance' ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="radio" checked={paymentType === 'advance'} onChange={() => setPaymentType('advance')} className="accent-emerald-600 w-4 h-4" />
                      <span className="font-bold text-neutral-900 dark:text-white">30% Avans to'lov</span>
                    </div>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white ml-6">{(total * 0.3).toLocaleString()} so'm</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 ml-6 mt-1">Qolganini safar kuni to'laysiz</p>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">To'lov usuli</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['payme', 'click', 'uzum', 'card', 'invoice'].map(method => (
                    <label key={method} className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-600' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}>
                      <input type="radio" name="method" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" />
                      {method === 'card' ? <CreditCard className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mb-2" /> : method === 'invoice' ? <FileText className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mb-2" /> : <div className="h-6 font-black text-neutral-700 dark:text-neutral-300 mb-2 capitalize">{method}</div>}
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 text-center capitalize">{method === 'card' ? 'Bank kartasi' : method === 'invoice' ? 'Hisob-faktura' : method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* C-20 Corporate Invoice Fields */}
              {paymentMethod === 'invoice' && (
                <div className="p-5 border border-blue-200 dark:border-blue-900/50 rounded-xl bg-blue-50/30 dark:bg-blue-900/10 mb-8 animate-in fade-in slide-in-from-top-4">
                  <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Kompaniyalar uchun hisob-faktura
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Kompaniya nomi</label>
                       <input type="text" value={companyInfo.name} onChange={e => setCompanyInfo({...companyInfo, name: e.target.value})} placeholder="MChJ / XK" className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">STIR (INN)</label>
                       <input type="text" value={companyInfo.inn} onChange={e => setCompanyInfo({...companyInfo, inn: e.target.value})} placeholder="9 raqamli" maxLength={9} className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white" />
                    </div>
                    <div className="sm:col-span-2">
                       <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Bank rekvizitlari (H/R, MFO)</label>
                       <input type="text" value={companyInfo.bank} onChange={e => setCompanyInfo({...companyInfo, bank: e.target.value})} placeholder="2020..." className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white" />
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button 
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-0"
            >
              Orqaga
            </button>
            {step < 4 ? (
              <button 
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-md disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Davom etish <ArrowRight className="h-4 w-4" /></>}
              </button>
            ) : (
              <button 
                onClick={handlePayment}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (paymentMethod === 'invoice' ? 'Hisob-faktura yuklab olish (PDF)' : `To'lash (${toPayNow.toLocaleString()} so'm)`)}
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Buyurtma xulosasi</h2>
            
            <div className="flex gap-4 mb-6">
              <img src="https://picsum.photos/seed/tour20/800/600" alt="Tour" className="h-16 w-20 object-cover rounded-lg" />
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white leading-tight text-sm">Afsonaviy Samarqand bo'ylab 2 kunlik sayohat</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">24 Okt - 25 Okt (Guruhli tur)</p>
              </div>
            </div>

            <div className="space-y-4 text-sm mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-6">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Kattalar x{adults}</span>
                <span className="text-neutral-900 dark:text-white font-medium">{(adults * BASE_PRICE).toLocaleString()} so'm</span>
              </div>
              {children > 0 && (
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Bolalar x{children}</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{(children * CHILD_PRICE).toLocaleString()} so'm</span>
                </div>
              )}
              {extras.transfer && (
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Transfer</span>
                  <span className="text-neutral-900 dark:text-white font-medium">150,000 so'm</span>
                </div>
              )}
              {extras.lunch && (
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Tushlik x{adults + children}</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{((adults + children) * 80000).toLocaleString()} so'm</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Chegirma (Promo)</span>
                  <span>-{discount.toLocaleString()} so'm</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="font-bold text-neutral-900 dark:text-white">Jami summa:</span>
              <span className="text-2xl font-black text-neutral-900 dark:text-white">{total.toLocaleString()} <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">so'm</span></span>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Xavfsiz tranzaksiya</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">Barcha to'lovlar shifrlangan va xavfsiz amalga oshiriladi. Hech qanday yashirin to'lovlar yoki ustamalar yo'q.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
