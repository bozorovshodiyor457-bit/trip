import React, { useState } from 'react';
import { X, Smartphone, Mail, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';

export default function AuthModal({ isOpen, onClose }) {
  const { setUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('local'); // 'local' or 'foreign'
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (phone.length < 5) return;

    try {
      // Textup.uz ga SMS yuborish so'rovi (API kalitlarini o'zingiznikiga almashtiring)
      /* 
      const response = await fetch('https://api.textup.uz/sendsms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SIZNING_API_KALITINGIZ'
        },
        body: JSON.stringify({
          phone: `998${phone.replace(/\D/g, '')}`, // raqam faqat raqamlardan iborat bo'lishi kerak
          text: 'Visitca Trip: Tasdiqlash kodingiz - 1234'
        })
      });
      const data = await response.json();
      console.log("SMS yuborildi:", data);
      */
      
      // Hozirgi holatda SMS jo'natilganini simulyatsiya qilib (chunki API kalit yo'q), 2-qadamga o'tkazamiz
      setStep(2);
    } catch (error) {
      console.error("SMS yuborishda xatolik:", error);
      alert("SMS yuborishda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.");
    }
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.slice(0, 9);
    
    let formatted = val;
    if (val.length > 2) {
      formatted = val.slice(0, 2) + '-' + val.slice(2);
    }
    if (val.length > 5) {
      formatted = formatted.slice(0, 6) + '-' + formatted.slice(6);
    }
    if (val.length > 7) {
      formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
    }
    
    setPhone(formatted);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setStep(3); // Go to OneID step
  };

  const handleOneIDVerify = () => {
    // Mock OneID verification
    setUser({ name: 'Shodiyor', phone: `+998 ${phone}`, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', isVerified: true });
    onClose();
    setStep(1);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setUser({ name: 'John Doe', email, avatar: 'https://i.pravatar.cc/150?img=33' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Tizimga kirish</h2>

        <div className="flex space-x-1 rounded-lg bg-neutral-100 p-1 mb-6">
          <button
            onClick={() => { setActiveTab('local'); setStep(1); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${activeTab === 'local' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            O'zbekiston fuqarosi
          </button>
          <button
            onClick={() => { setActiveTab('foreign'); setStep(1); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${activeTab === 'foreign' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Xorijiy turist
          </button>
        </div>

        {activeTab === 'local' ? (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Telefon raqami</label>
                  <div className="relative rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                    <span className="text-neutral-500 pr-2 border-r border-neutral-200 mr-2">+998</span>
                    <input
                      type="tel"
                      className="block w-full border-0 p-0 text-neutral-900 placeholder-neutral-400 focus:ring-0 sm:text-sm outline-none"
                      placeholder="90-123-45-67"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                    <Smartphone className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                >
                  Kodni olish
                </button>
              </form>
            ) : step === 2 ? (
              <form onSubmit={handleVerify} className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">SMS kodni kiriting</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-neutral-200 px-3 py-2 text-neutral-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm outline-none text-center tracking-widest text-lg"
                    placeholder="0000"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                >
                  Tasdiqlash
                </button>
                <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Eslatma: Birinchi brondan oldin sizdan OneID/MyGov orqali shaxsingizni tasdiqlash so'raladi.
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Shaxsni tasdiqlash</h3>
                <p className="text-sm text-neutral-500">
                  O'zbekiston qonunchiligiga muvofiq, xavfsizlikni ta'minlash va elektron vaucher rasmiylashtirish uchun OneID (Yagona identifikatsiya tizimi) orqali shaxsingizni tasdiqlashingiz so'raladi.
                </p>
                
                <button
                  onClick={handleOneIDVerify}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-purple-700 transition-colors mt-4"
                >
                  OneID orqali tasdiqlash
                </button>
                
                <button
                  onClick={() => {
                    setUser({ name: 'Shodiyor', phone: `+998 ${phone}`, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', isVerified: false });
                    onClose();
                    setStep(1);
                  }}
                  className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 underline mt-4 inline-block"
                >
                  Keyinroq tasdiqlash
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
             <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail manzil</label>
                  <div className="relative rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 flex items-center">
                    <input
                      type="email"
                      className="block w-full border-0 p-0 text-neutral-900 placeholder-neutral-400 focus:ring-0 sm:text-sm outline-none"
                      placeholder="tourist@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                >
                  Kirish
                </button>
             </form>

             <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-neutral-500">Yoki</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200 transition-colors">
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="#4285F4"
                    />
                  </svg>
                  <span className="text-sm">Google</span>
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200 transition-colors">
                  <svg className="h-5 w-5 text-neutral-900" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span className="text-sm">Apple</span>
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
