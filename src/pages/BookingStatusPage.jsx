import React, { useState, useEffect } from 'react';
import { Building2, Download, FileText, Clock, CheckCircle2, AlertCircle, XCircle, QrCode, ArrowRight, Info } from 'lucide-react';

export default function BookingStatusPage() {
  const [activeTab, setActiveTab] = useState('b2b'); // 'b2b' | 'pending' | 'success' | 'failed'

  // B2B Form State
  const [b2bForm, setB2bForm] = useState({
    companyName: '',
    inn: '',
    bankName: '',
    mfo: '',
    accountNumber: ''
  });

  return (
    <div className="bg-neutral-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Switcher for demonstration purposes */}
        <div className="bg-white rounded-2xl p-2 mb-8 shadow-sm border border-neutral-200 flex flex-wrap gap-2">
          {[
            { id: 'b2b', label: "C-20: Korporativ To'lov" },
            { id: 'pending', label: "Holat: Tasdiq kutilmoqda" },
            { id: 'success', label: "Holat: Muvaffaqiyatli" },
            { id: 'failed', label: "Holat: Bekor qilingan" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: B2B CORPORATE PAYMENT FORM (C-20) */}
        {/* ============================================================== */}
        {activeTab === 'b2b' && (
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-neutral-100 p-2.5 rounded-xl">
                    <Building2 className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">Kompaniya rekvizitlari</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Kompaniya nomi</label>
                    <input type="text" placeholder="MChJ Visitca Solutions" className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 focus:bg-white transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">STIR (INN)</label>
                      <input type="text" placeholder="123456789" maxLength={9} className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 focus:bg-white transition-colors tracking-widest" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">MFO</label>
                      <input type="text" placeholder="00014" maxLength={5} className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 focus:bg-white transition-colors tracking-widest" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Bank nomi</label>
                    <input type="text" placeholder="Xalq Banki ATB" className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Hisob raqami</label>
                    <input type="text" placeholder="2020 8000 0000 0000 0001" maxLength={24} className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 focus:bg-white transition-colors tracking-widest font-mono" />
                  </div>
                </div>
              </div>

              {/* Warning Block */}
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex gap-4 items-start">
                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Joylar 3 bank kunigacha ushlab turiladi</h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Ushbu muddat ichida to'lov qilinmasa yoki tasdiqlovchi hujjat (platejka) yuborilmasa, bron qilingan joylar avtomatik tarzda bekor qilinadi (S-01 qoidasiga asosan).
                  </p>
                </div>
              </div>

            </div>

            {/* Invoice Sidebar */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 sticky top-24">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">To'lov ma'lumotlari</h3>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Xizmat nomi:</span>
                    <span className="font-medium text-neutral-900 text-right">"Buyuk Ipak Yo'li" guruhi (12 kishi)</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Jami qiymati:</span>
                    <span className="font-medium text-neutral-900">12,500,000 UZS</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>QQS stavkasi (12%):</span>
                    <span className="font-medium text-neutral-900">1,500,000 UZS</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-neutral-900">Jami to'lov:</span>
                    <span className="text-xl font-black text-emerald-600">14,000,000 UZS</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-bold py-3.5 rounded-xl hover:bg-neutral-800 transition-colors shadow-md">
                    <Download className="h-5 w-5" /> PDF hisob-faktura
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white text-neutral-900 font-bold py-3.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 transition-colors">
                    <FileText className="h-5 w-5 text-emerald-600" /> EHA orqali yuborish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PENDING CONFIRMATION */}
        {/* ============================================================== */}
        {activeTab === 'pending' && (
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden text-center max-w-xl mx-auto animate-in zoom-in-95 duration-300">
             <div className="bg-blue-50 py-10 px-6 border-b border-blue-100 flex flex-col items-center">
               <div className="relative mb-6">
                 <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                 <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-sm">
                   <Clock className="h-10 w-10 text-blue-600" />
                 </div>
               </div>
               <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">Tashkilotchi tasdig'i kutilmoqda</h2>
               <p className="text-neutral-500">So'rovingiz muvaffaqiyatli yuborildi. Tashkilotchi joy borligini tasdiqlashi kerak.</p>
             </div>
             
             <div className="p-8">
               <div className="flex flex-col items-center mb-8">
                 <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Qolgan vaqt (S-03)</span>
                 <div className="text-4xl font-mono font-black text-neutral-900 flex gap-2">
                   <span>05</span><span className="text-neutral-300">:</span><span>59</span><span className="text-neutral-300">:</span><span>42</span>
                 </div>
               </div>

               <div className="bg-neutral-50 rounded-2xl p-5 text-left border border-neutral-200 flex items-start gap-4 mb-6">
                 <Info className="h-6 w-6 text-neutral-500 flex-shrink-0" />
                 <p className="text-sm text-neutral-600 leading-relaxed">
                   Kartangizdagi mablag' vaqtinchalik muzlatildi (<span className="font-bold text-neutral-900">Hold holati</span>), biroq u yechib olinmadi. Agar 6 soat ichida tashkilotchi javob bermasa, joy bekor qilinadi va pul darhol qaytariladi.
                 </p>
               </div>

               <button className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 underline transition-colors">
                 So'rovni bekor qilish
               </button>
             </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SUCCESS PAYMENT */}
        {/* ============================================================== */}
        {activeTab === 'success' && (
          <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden max-w-lg mx-auto animate-in zoom-in-95 duration-300 relative">
            <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500"></div>
            
            <div className="p-8 text-center pt-12">
              <div className="mx-auto h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Bron tasdiqlandi!</h2>
              <p className="text-neutral-500 mb-8">Sayohatga tayyorgarlikni boshlashingiz mumkin.</p>
              
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 mb-8 text-left relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <QrCode className="h-32 w-32 text-neutral-900" />
                </div>
                
                <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Vaucher raqami</p>
                <p className="text-2xl font-black text-neutral-900 tracking-widest mb-4 font-mono">VS-9482-73A</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-neutral-500 mb-1">Sana</span>
                    <span className="font-semibold text-neutral-900">24 Oktabr, 08:00</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 mb-1">Odamlar soni</span>
                    <span className="font-semibold text-neutral-900">2 ta kattalar</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200 flex items-center justify-center gap-2">
                  Vaucherni ochish <ArrowRight className="h-5 w-5" />
                </button>
                <button className="w-full text-neutral-900 font-bold py-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  Shaxsiy kabinetga qaytish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: EXPIRED / FAILED */}
        {/* ============================================================== */}
        {activeTab === 'failed' && (
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden text-center max-w-xl mx-auto animate-in zoom-in-95 duration-300">
             <div className="bg-red-50 py-10 px-6 border-b border-red-100 flex flex-col items-center">
               <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                 <XCircle className="h-10 w-10 text-red-600" />
               </div>
               <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">Vaqt tugadi / Bekor qilindi</h2>
               <p className="text-red-700/80">Siz tanlagan joylarga bo'lgan bron avtomatik bekor qilindi.</p>
             </div>
             
             <div className="p-8">
               <div className="bg-neutral-50 rounded-2xl p-5 text-left border border-neutral-200 flex items-start gap-4 mb-8">
                 <Info className="h-6 w-6 text-neutral-500 flex-shrink-0" />
                 <p className="text-sm text-neutral-600 leading-relaxed">
                   Sabab: 15 daqiqalik to'lov vaqti tugadi (S-04 qoidasi). Sizning kartangizdan hech qanday mablag' yechilmadi va <span className="font-bold text-neutral-900">Hold holati bekor qilindi</span>.
                 </p>
               </div>

               <div className="flex gap-4">
                 <button className="flex-1 bg-neutral-900 text-white font-bold py-3.5 rounded-xl hover:bg-neutral-800 transition-colors">
                   Qaytadan urinish
                 </button>
                 <button className="flex-1 text-neutral-900 font-bold py-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
                   Bosh sahifa
                 </button>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
