import React, { useState } from 'react';
import { Building2, Download, FileText, Clock, CheckCircle2, AlertCircle, XCircle, QrCode, ArrowRight, Info } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import { useTranslation } from '../utils/i18n';

export default function BookingStatusPage() {
  const { language } = useAppContext();
  const t = useTranslation(language);
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
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Switcher for demonstration purposes */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-2 mb-8 shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-2">
          {[
            { id: 'b2b', label: t('b2bPayment') },
            { id: 'pending', label: t('statusPending') },
            { id: 'success', label: t('statusSuccess') },
            { id: 'failed', label: t('statusFailed') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
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
              
              <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-neutral-100 dark:bg-neutral-700 p-2.5 rounded-xl">
                    <Building2 className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t('companyDetails')}</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-2">{t('companyName')}</label>
                    <input type="text" placeholder="MChJ Visitca Solutions" className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 dark:bg-neutral-700 dark:text-white focus:bg-white dark:focus:bg-neutral-800 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-2">{t('inn')}</label>
                      <input type="text" placeholder="123456789" maxLength={9} className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 dark:bg-neutral-700 dark:text-white focus:bg-white dark:focus:bg-neutral-800 transition-colors tracking-widest" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-2">{t('mfo')}</label>
                      <input type="text" placeholder="00014" maxLength={5} className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 dark:bg-neutral-700 dark:text-white focus:bg-white dark:focus:bg-neutral-800 transition-colors tracking-widest" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-2">{t('bankName')}</label>
                    <input type="text" placeholder="Xalq Banki ATB" className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 dark:bg-neutral-700 dark:text-white focus:bg-white dark:focus:bg-neutral-800 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-2">{t('accountNumber')}</label>
                    <input type="text" placeholder="2020 8000 0000 0000 0001" maxLength={24} className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-neutral-50 dark:bg-neutral-700 dark:text-white focus:bg-white dark:focus:bg-neutral-800 transition-colors tracking-widest font-mono" />
                  </div>
                </div>
              </div>

              {/* Warning Block */}
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 flex gap-4 items-start">
                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-500 mb-1">{t('holdWarningTitle')}</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-200 leading-relaxed">
                    {t('holdWarningDesc')}
                  </p>
                </div>
              </div>

            </div>

            {/* Invoice Sidebar */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 sticky top-24">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">{t('paymentDetails')}</h3>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t('serviceName')}:</span>
                    <span className="font-medium text-neutral-900 dark:text-white text-right">"Buyuk Ipak Yo'li" guruhi (12 kishi)</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t('totalPrice')}:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">12,500,000 UZS</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>{t('vatRate')}:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">1,500,000 UZS</span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-neutral-900 dark:text-white">{t('totalToPay')}:</span>
                    <span className="text-xl font-black text-emerald-600">14,000,000 UZS</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold py-3.5 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-md">
                    <Download className="h-5 w-5" /> {t('pdfInvoice')}
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-transparent text-neutral-900 dark:text-white font-bold py-3.5 rounded-xl border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                    <FileText className="h-5 w-5 text-emerald-600" /> {t('sendEha')}
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
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden text-center max-w-xl mx-auto animate-in zoom-in-95 duration-300">
             <div className="bg-blue-50 dark:bg-blue-900/30 py-10 px-6 border-b border-blue-100 dark:border-blue-900/50 flex flex-col items-center">
               <div className="relative mb-6">
                 <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                 <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center relative z-10 border-4 border-white dark:border-neutral-800 shadow-sm">
                   <Clock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                 </div>
               </div>
               <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white mb-2">{t('waitOrganizer')}</h2>
               <p className="text-neutral-500 dark:text-neutral-400">{t('waitOrganizerDesc')}</p>
             </div>
             
             <div className="p-8">
               <div className="flex flex-col items-center mb-8">
                 <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{t('timeLeft')} (S-03)</span>
                 <div className="text-4xl font-mono font-black text-neutral-900 dark:text-white flex gap-2">
                   <span>05</span><span className="text-neutral-300 dark:text-neutral-600">:</span><span>59</span><span className="text-neutral-300 dark:text-neutral-600">:</span><span>42</span>
                 </div>
               </div>

               <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 text-left border border-neutral-200 dark:border-neutral-700 flex items-start gap-4 mb-6">
                 <Info className="h-6 w-6 text-neutral-500 flex-shrink-0" />
                 <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                   {t('holdInfo')}
                 </p>
               </div>

               <button className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline transition-colors">
                 {t('cancelRequest')}
               </button>
             </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SUCCESS PAYMENT */}
        {/* ============================================================== */}
        {activeTab === 'success' && (
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-700 overflow-hidden max-w-lg mx-auto animate-in zoom-in-95 duration-300 relative">
            <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500"></div>
            
            <div className="p-8 text-center pt-12">
               <div className="mx-auto h-24 w-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">{t('bookingConfirmed')}</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8">{t('prepTrip')}</p>
              
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 mb-8 text-left relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10">
                  <QrCode className="h-32 w-32 text-neutral-900 dark:text-white" />
                </div>
                
                <p className="text-xs font-bold text-neutral-400 uppercase mb-1">{t('voucherNum')}</p>
                <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-widest mb-4 font-mono">VS-9482-73A</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-neutral-500 mb-1">{t('date')}</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">24 Oktabr, 08:00</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 mb-1">{t('peopleCount')}</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">2 ta kattalar</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2">
                  {t('openVoucher')} <ArrowRight className="h-5 w-5" />
                </button>
                <button className="w-full text-neutral-900 dark:text-white font-bold py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  {t('backToCabinet')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: EXPIRED / FAILED */}
        {/* ============================================================== */}
        {activeTab === 'failed' && (
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden text-center max-w-xl mx-auto animate-in zoom-in-95 duration-300">
             <div className="bg-red-50 dark:bg-red-900/20 py-10 px-6 border-b border-red-100 dark:border-red-900/30 flex flex-col items-center">
               <div className="h-20 w-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-neutral-800 shadow-sm">
                 <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
               </div>
               <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white mb-2">{t('timeUp')}</h2>
               <p className="text-red-700/80 dark:text-red-400/80">{t('timeUpDesc')}</p>
             </div>
             
             <div className="p-8">
               <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 text-left border border-neutral-200 dark:border-neutral-700 flex items-start gap-4 mb-8">
                 <Info className="h-6 w-6 text-neutral-500 flex-shrink-0" />
                 <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                   {t('cancelReason')}
                 </p>
               </div>

               <div className="flex gap-4">
                 <button className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold py-3.5 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                   {t('tryAgain')}
                 </button>
                 <button className="flex-1 text-neutral-900 dark:text-white font-bold py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                   {t('homePage')}
                 </button>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
