import React, { useState } from 'react';
import { Send, MapPin, Calendar, Users, Wallet, Target, Globe, Loader2 } from 'lucide-react';
import interactionService from '../services/interactionService';

export default function CustomTourPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    guests: '',
    budget: '',
    interests: '',
    language: 'UZ'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await interactionService.submitCustomRequest(formData);
    } catch (err) {
      console.warn('Custom request API error fallback:', err);
    } finally {
      setIsLoading(false);
      setStep(2); // Show confirmation/offers
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      
      {step === 1 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-neutral-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">Aynan siz uchun sayohat yaratamiz</h1>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm sm:text-base">
              Qayerga va qanday sharoitda sayohat qilishni xohlayotganingizni bizga ayting. Eng yaxshi tashkilotchilar sizga moslashtirilgan takliflar yuborishadi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Qayerga bormoqchisiz?</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="Masalan: Buxoro yoki Aral dengizi" 
                    value={formData.destination}
                    onChange={e => setFormData({...formData, destination: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Qachon?</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Odamlar soni</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="Masalan: 4" 
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Kutilayotgan byudjet (Kishi boshiga)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Wallet className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Masalan: 500,000 UZS" 
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" /> Asosiy qiziqishlaringiz va talablaringiz
              </label>
              <textarea 
                required
                placeholder="Tarixiy obidalar, sokin tabiat, faqat Halol taomlar, bolalar uchun sharoit..."
                value={formData.interests}
                onChange={e => setFormData({...formData, interests: e.target.value})}
                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none h-24"
              ></textarea>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-6 mt-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-neutral-400" />
                <select 
                  value={formData.language}
                  onChange={e => setFormData({...formData, language: e.target.value})}
                  className="bg-transparent text-sm font-semibold text-neutral-700 outline-none"
                >
                  <option value="UZ">O'zbek tili</option>
                  <option value="RU">Rus tili</option>
                  <option value="EN">Ingliz tili</option>
                </select>
              </div>
              <button type="submit" className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                Tashkilotchilarga yuborish <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-neutral-100 text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Send className="h-10 w-10 text-emerald-600 ml-1" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">So'rov muvaffaqiyatli yuborildi!</h2>
          <p className="text-neutral-500 mb-10 max-w-lg mx-auto">
            Sizning talablaringiz bo'yicha eng yaxshi gid va turoperatorlar tez orada sizga maxsus takliflar yuborishadi. Takliflarni <b>"Chat"</b> bo'limida ko'rishingiz mumkin.
          </p>
          
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">MISOL UCHUN TAKLIF</div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://i.pravatar.cc/150?u=alisher" alt="Alisher" className="h-12 w-12 rounded-full" />
                <div>
                  <h4 className="font-bold text-neutral-900">Alisher Vohidov (Gid)</h4>
                  <p className="text-xs text-neutral-500">4.9 reyting • 340 sharh</p>
                </div>
              </div>
              <p className="text-xl font-black text-emerald-600">650,000 <span className="text-xs text-neutral-500 font-medium">UZS</span></p>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed mb-4">
              "Assalomu alaykum! Siz so'ragan sanada men bo'shman. Dasturga qo'shimcha ravishda eski shahar hunarmandlari bilan uchrashuv ham qo'shib beraman."
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-emerald-600 text-white font-semibold py-2 rounded-lg text-sm">Bron qilish</button>
              <button className="flex-1 bg-white border border-neutral-300 text-neutral-700 font-semibold py-2 rounded-lg text-sm">Yozishish</button>
            </div>
          </div>

          <button onClick={() => setStep(1)} className="mt-8 text-sm font-medium text-neutral-500 hover:text-neutral-900 underline">
            Yangi so'rov yaratish
          </button>
        </div>
      )}
    </div>
  );
}
