import React, { useState, useRef } from 'react';
import { User as UserIcon, ShieldCheck, Mail, Phone, CreditCard, Plus, Trash2, Edit2, ShieldAlert, Loader2, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import uploadService from '../services/uploadService';

const MOCK_USER = {
  name: "Toshmatov Eshmat",
  phone: "+998 90 123 45 67",
  email: "eshmat.t@gmail.com",
  oneId: true,
};

const INITIAL_COMPANIONS = [
  { id: 1, name: "Toshmatova Gulnora", relation: "Turmush o'rtoq", dob: "1990-05-15", passport: "AA 1234567" },
  { id: 2, name: "Toshmatov Alisher", relation: "Farzand", dob: "2015-10-20", passport: "AB 7654321" },
];

const INITIAL_CARDS = [
  { id: 1, type: "Uzcard", last4: "8600", expiry: "12/28", isPrimary: true },
  { id: 2, type: "Humo", last4: "9860", expiry: "05/27", isPrimary: false },
];

export default function ProfilePage() {
  const { user, setUser } = useAppContext();
  const [companions, setCompanions] = useState(INITIAL_COMPANIONS);
  const [cards, setCards] = useState(INITIAL_CARDS);

  // Avatar Upload States
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const fileInputRef = useRef(null);

  const currentUser = user || MOCK_USER;
  const userAvatar = currentUser.avatar || null;

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError('');
    setAvatarSuccess('');

    // 1. Check file type
    if (!file.type.startsWith('image/')) {
      setAvatarError("Faqat rasm fayllari (JPG, PNG, WEBP) ruxsat etiladi");
      return;
    }

    // 2. Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Fayl hajmi 5MB dan oshmasligi kerak");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const res = await uploadService.uploadAvatar(file);
      const newAvatarUrl = res?.url || URL.createObjectURL(file);
      
      const updatedUser = {
        ...currentUser,
        avatar: newAvatarUrl
      };
      setUser(updatedUser);
      localStorage.setItem('visitca_user', JSON.stringify(updatedUser));
      setAvatarSuccess("Profil rasmi muvaffaqiyatli yangilandi");
    } catch (err) {
      console.error("Avatar upload error:", err);
      // Fallback preview if AWS dev sandbox is off
      const previewUrl = URL.createObjectURL(file);
      const updatedUser = { ...currentUser, avatar: previewUrl };
      setUser(updatedUser);
      localStorage.setItem('visitca_user', JSON.stringify(updatedUser));
      setAvatarError("Rasmni yuklashda xatolik yuz berdi. Qayta urinib ko'ring");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Profil va Sozlamalar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Info & Verification */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 text-center">
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleAvatarFileSelect}
              className="hidden"
            />

            <div className="relative inline-block mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="h-24 w-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto border-4 border-white dark:border-neutral-800 shadow-md overflow-hidden relative">
                {userAvatar ? (
                  <img src={userAvatar} alt={currentUser.name} className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-10 w-10 text-neutral-400" />
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="h-7 w-7 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white dark:border-neutral-900 hover:bg-emerald-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                title="Rasmni yangilash"
              >
                {isUploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </button>
            </div>

            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{currentUser.name || MOCK_USER.name}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Sayohatchi</p>

            {/* Error Banner */}
            {avatarError && (
              <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 p-3 border border-red-200 dark:border-red-800 text-left">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 leading-snug">{avatarError}</p>
              </div>
            )}

            {/* Success Banner */}
            {avatarSuccess && (
              <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 border border-emerald-200 dark:border-emerald-800 text-left">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 leading-snug">{avatarSuccess}</p>
              </div>
            )}
            
            <div className="space-y-3 text-sm text-left border-t border-neutral-100 dark:border-neutral-800 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2"><Phone className="h-4 w-4" /> Telefon</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{currentUser.phone || MOCK_USER.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2"><Mail className="h-4 w-4" /> Email</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{currentUser.email || MOCK_USER.email}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl p-6 border ${MOCK_USER.oneId ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {MOCK_USER.oneId ? <ShieldCheck className="h-6 w-6 text-emerald-600 flex-shrink-0" /> : <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0" />}
              <div>
                <h3 className={`font-bold ${MOCK_USER.oneId ? 'text-emerald-900' : 'text-amber-900'} mb-1`}>
                  {MOCK_USER.oneId ? "Shaxs tasdiqlangan" : "Shaxs tasdiqlanmagan"}
                </h3>
                <p className={`text-xs ${MOCK_USER.oneId ? 'text-emerald-700' : 'text-amber-700'} leading-relaxed mb-3`}>
                  {MOCK_USER.oneId 
                    ? "Siz OneID orqali muvaffaqiyatli avtorizatsiyadan o'tgansiz. Endi bron qilish yanada oson va ishonchli." 
                    : "Xavfsizlik va avtomatik to'ldirish uchun OneID orqali shaxsingizni tasdiqlang."}
                </p>
                {!MOCK_USER.oneId && (
                  <button className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                    OneID orqali tasdiqlash
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Companions & Cards */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Saved Companions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Saqlangan hamrohlar</h2>
                <p className="text-sm text-neutral-500">Keyingi safarlarda ma'lumotlarni qayta kiritmaslik uchun</p>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="h-4 w-4" /> Qo'shish
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {companions.map(person => (
                <div key={person.id} className="border border-neutral-200 rounded-2xl p-4 relative group hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-neutral-900">{person.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">{person.relation}</span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-1">Tug'ilgan sana: <span className="font-medium text-neutral-900">{person.dob}</span></p>
                  <p className="text-sm text-neutral-600">Pasport: <span className="font-medium text-neutral-900">{person.passport}</span></p>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">To'lov usullari</h2>
                <p className="text-sm text-neutral-500">Bog'langan bank kartalari</p>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 border border-neutral-300 hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="h-4 w-4" /> Karta qo'shish
              </button>
            </div>

            <div className="space-y-3">
              {cards.map(card => (
                <div key={card.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
                      <CreditCard className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{card.type} **** {card.last4}</p>
                      <p className="text-xs text-neutral-500">Amal qilish muddati: {card.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {card.isPrimary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md hidden sm:block">
                        Asosiy
                      </span>
                    )}
                    <button className="text-neutral-400 hover:text-red-500 transition-colors p-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
