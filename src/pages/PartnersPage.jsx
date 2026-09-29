import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Globe, Percent, CalendarCheck } from 'lucide-react';

export default function PartnersPage() {
  const handleOpenBusinessApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      window.open("https://play.google.com/store/apps/details?id=purecube.visitca.visitca_business", "_blank");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.open("https://apps.apple.com/uz/app/visitca-business/id6741774752", "_blank");
    } else {
      window.open("https://play.google.com/store/apps/details?id=purecube.visitca.visitca_business", "_blank");
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="bg-neutral-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Visitca bilan sayyohlarga o'z turlaringizni soting
            </h1>
            <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Biz eng yirik turistik auditoriyani jalb qilamiz, siz esa sifatli xizmat ko'rsatasiz. Barchasi avtomatlashtirilgan, shaffof va kafolatlangan to'lovlar bilan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg">
                Hamkor bo'lish
              </button>
              <button onClick={handleOpenBusinessApp} className="bg-neutral-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-neutral-700 transition-colors border border-neutral-700">
                Biznes ilovani yuklash
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="bg-neutral-800 border border-neutral-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-20"></div>
               <h3 className="font-bold text-xl mb-6">Daromadingizni hisoblang</h3>
               <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-xs font-semibold text-neutral-400 uppercase mb-2">Turlar soni (Oyiga)</label>
                   <input type="range" className="w-full accent-emerald-500" defaultValue="15" min="1" max="50" />
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-neutral-400 uppercase mb-2">O'rtacha chek (UZS)</label>
                   <input type="range" className="w-full accent-emerald-500" defaultValue="500000" min="100000" max="2000000" />
                 </div>
               </div>
               <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-700 text-center">
                 <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Kutilayotgan daromad</p>
                 <p className="text-3xl font-black text-emerald-400">7,500,000 UZS</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shartlar / Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Nima uchun aynan Visitca?</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">Bizning agentlik modelimiz sizning biznesingiz rivoji uchun eng qulay shartlarni taklif etadi.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Percent, title: "Eng past komissiya", desc: "Gidlar uchun atigi 1-2%, Turoperatorlar uchun 3-5%. Boshqa platformalarga qaraganda 5 barobar arzon." },
            { icon: TrendingUp, title: "Keng auditoriya", desc: "Sizning turlaringiz avtomatik ravishda barcha tillarga tarjima qilinib, minglab turistlarga ko'rsatiladi." },
            { icon: ShieldCheck, title: "Kafolatlangan to'lov", desc: "Safar tugashi bilanoq pulingiz kartangizga xavfsiz o'tkazib beriladi. Nol risk." },
          ].map((item, idx) => (
            <div key={idx} className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
              <div className="h-14 w-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <item.icon className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
              <p className="text-neutral-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-neutral-50 border-t border-b border-neutral-200 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Kimlarga qanday imkoniyatlar?</h2>
            <p className="text-neutral-500">O'z faoliyat turiga ko'ra tizimdan to'liq foydalaning.</p>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-neutral-100 border-b border-neutral-200 p-4 sm:p-6 font-bold text-neutral-900">
              <div>Imkoniyatlar</div>
              <div className="text-center">Yakkatartibdagi Gid</div>
              <div className="text-center">Turoperator (Kompaniya)</div>
            </div>
            
            {[
              { f: "Turlar yaratish va sotish", g: true, t: true },
              { f: "Komissiya miqdori", g: "1 - 2%", t: "3 - 5%" },
              { f: "To'lov qabul qilish", g: "Jismoniy karta (Uzcard/Humo)", gIcon: true, t: "Korporativ hisob raqam", tIcon: true },
              { f: "Xodimlar (Gidlar) biriktirish", g: false, t: true },
              { f: "B2B hamkorlik (Hisob-faktura)", g: false, t: true },
              { f: "Reyting va tasdiqlanganlik belgisi", g: true, t: true },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 border-b border-neutral-100 p-4 sm:p-6 text-sm items-center hover:bg-neutral-50 transition-colors">
                <div className="font-medium text-neutral-700">{row.f}</div>
                <div className="text-center flex justify-center">
                  {typeof row.g === 'boolean' ? (row.g ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <span className="text-neutral-300">—</span>) : <span className="font-semibold text-neutral-900">{row.g}</span>}
                </div>
                <div className="text-center flex justify-center">
                  {typeof row.t === 'boolean' ? (row.t ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <span className="text-neutral-300">—</span>) : <span className="font-semibold text-neutral-900">{row.t}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Application Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl text-center">
         <h2 className="text-3xl font-bold text-neutral-900 mb-4">Hoziroq hamkor bo'ling!</h2>
         <p className="text-neutral-500 mb-10">Ro'yxatdan o'tish bir necha daqiqa vaqt oladi.</p>
         
         <form className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-left">
           <div className="grid sm:grid-cols-2 gap-6 mb-6">
             <div>
               <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">F.I.Sh / Kompaniya nomi</label>
               <input type="text" className="w-full border border-neutral-300 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="Ismingizni yozing" />
             </div>
             <div>
               <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Telefon raqam</label>
               <input type="text" className="w-full border border-neutral-300 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="+998" />
             </div>
             <div className="sm:col-span-2">
               <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Faoliyat turi</label>
               <select className="w-full border border-neutral-300 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none bg-white">
                 <option>Yakkatartibdagi Gid</option>
                 <option>Turoperator</option>
               </select>
             </div>
           </div>
           <button type="button" className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-neutral-800 transition-colors shadow-md">
             Arizani yuborish
           </button>
           <p className="text-xs text-center text-neutral-400 mt-4">Tugmani bosish orqali siz ommaviy ofera shartlariga rozi bo'lasiz.</p>
         </form>
      </section>

    </div>
  );
}
