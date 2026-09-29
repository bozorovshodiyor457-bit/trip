import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertOctagon, Paperclip, Send, AlertCircle } from 'lucide-react';

const FAQS = [
  {
    q: "Bronni qanday qilib bekor qilsam bo'ladi?",
    a: "Profil darchasidan 'Mening safarlarim' bo'limiga kiring. O'zingizga kerakli turni tanlab, 'Bekor qilish' tugmasini bosing. Bekor qilish siyosatiga muvofiq, summaning qanchadir qismi qaytarilishi mumkin."
  },
  {
    q: "To'lovlar qanchalik xavfsiz?",
    a: "Biz Payme va Click tizimlari orqali ishlaganimiz sababli barcha tranzaksiyalar 100% shifrlangan. Karta ma'lumotlaringiz bizning serverda saqlanmaydi."
  },
  {
    q: "Gid kelmay qolsa, pulim nima bo'ladi?",
    a: "Bunday holatda Sizning pulingiz 100% miqdorda qaytarib beriladi. Biz faqat tekshiruvdan o'tgan ishonchli gidlar bilan ishlaymiz."
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [disputeStep, setDisputeStep] = useState(1);
  const [reason, setReason] = useState('guide_no_show'); // guide_no_show, bad_quality, other
  const [description, setDescription] = useState('');

  const submitDispute = (e) => {
    e.preventDefault();
    setDisputeStep(2);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="h-8 w-8 text-neutral-400" />
          Qo'llab-quvvatlash markazi
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto">
          Savollaringiz bormi yoki safarda qandaydir muammo yuz berdimi? Biz har doim yordam berishga tayyormiz.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left: FAQ */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Ko'p beriladigan savollar</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="font-semibold text-neutral-900 pr-4">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-5 w-5 text-neutral-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-neutral-400 flex-shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-neutral-600 bg-white leading-relaxed text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dispute Form */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-100">
            {disputeStep === 1 ? (
              <>
                <h2 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5 text-red-500" /> Nizo ochish (Shikoyat)
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Agar sayohat davomida tashkilotchi tomonidan kelishuv buzilgan bo'lsa, ariza qoldiring. Biz uni ko'rib chiqamiz.
                </p>

                <form onSubmit={submitDispute} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Buyurtma ID</label>
                    <input type="text" placeholder="Masalan: VT-847291" required className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-red-500 uppercase" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Shikoyat sababi</label>
                    <select 
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-red-500 bg-white"
                    >
                      <option value="guide_no_show">Gid kelmadi yoki kechikdi</option>
                      <option value="bad_quality">Sifat dasturga mos kelmadi</option>
                      <option value="transport_issue">Transport muammosi</option>
                      <option value="other">Boshqa sabab</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Batafsil izoh</label>
                    <textarea 
                      required
                      placeholder="Vaziyatni batafsil tushuntirib bering..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-red-500 resize-none h-28"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">Dalil (Rasm yoki Video)</label>
                    <div className="w-full border-2 border-dashed border-neutral-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 hover:border-red-300 transition-colors">
                      <Paperclip className="h-6 w-6 text-neutral-400 mb-2" />
                      <span className="text-sm font-medium text-neutral-600">Fayllarni biriktirish</span>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-200">
                    Arizani yuborish
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Ariza qabul qilindi</h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Sizning shikoyatingiz ma'muriyatga yuborildi. Biz holatni tekshirib chiqib, 24 soat ichida siz bilan bog'lanamiz. Pullaringiz xavfsizlikda.
                </p>
                <button onClick={() => setDisputeStep(1)} className="text-sm font-semibold text-neutral-900 border border-neutral-300 rounded-lg px-6 py-2.5 hover:bg-neutral-50 transition-colors">
                  Orqaga qaytish
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex items-start gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
             <AlertCircle className="h-5 w-5 text-neutral-500 flex-shrink-0" />
             <p className="text-xs text-neutral-600 leading-relaxed">
               Nizo ko'rib chiqilayotgan paytda, tashkilotchiga pul o'tkazish bloklanadi. Agar tashkilotchi aybdor deb topilsa, pullar 100% sizga qaytariladi.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
