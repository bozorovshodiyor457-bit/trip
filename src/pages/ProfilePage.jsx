import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, ShieldCheck, Mail, Phone, Plus, Trash2, Edit2, ShieldAlert, Loader2, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import uploadService from '../services/uploadService';
import authService, { getCompanions } from '../services/authService';
import interactionService from '../services/interactionService';

export default function ProfilePage() {
  const { user, setUser } = useAppContext();
  const [companions, setCompanions] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Avatar Upload States
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Fetch real profile and companions from API
  useEffect(() => {
    let isMounted = true;
    async function loadProfileData() {
      try {
        setIsLoadingProfile(true);
        console.log("API Request: GET /api/b2c/auth/me");
        const profileRes = await authService.getMe();
        console.log("API Response: GET /api/b2c/auth/me", profileRes);

        if (isMounted && profileRes) {
          const fetchedUser = profileRes.user || profileRes.data || profileRes;
          setUser(fetchedUser);
          localStorage.setItem('visitca_user', JSON.stringify(fetchedUser));
        }
      } catch (err) {
        console.warn("API notice: GET /api/b2c/auth/me", err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }

      try {
        console.log("API Request: GET /api/b2c/auth/companions");
        const compRes = await getCompanions();
        console.log("API Response: GET /api/b2c/auth/companions", compRes);
        if (isMounted) {
          const list = compRes?.companions || compRes?.data || (Array.isArray(compRes) ? compRes : []);
          setCompanions(list);
        }
      } catch (err) {
        console.warn("Companions fetch notice:", err);
      }
    }
    loadProfileData();
    return () => { isMounted = false; };
  }, [setUser]);

  const currentUser = user || {};
  const userAvatar = currentUser.avatar || currentUser.avatarUrl || null;

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
      console.log("API Request: POST /api/uploads/avatar (FormData)", file.name);
      
      const res = await uploadService.uploadAvatar(file);
      console.log("API Response: POST /api/uploads/avatar", res);

      const newAvatarUrl = res?.url || res?.avatarUrl || res?.data?.url || res?.data?.avatarUrl || res?.fileUrl;
      
      if (!newAvatarUrl) {
        throw new Error("Serverdan rasm URL havolasi qaytmadi");
      }

      // Update user state with real server HTTPS URL
      const updatedUser = {
        ...currentUser,
        avatar: newAvatarUrl,
        avatarUrl: newAvatarUrl
      };
      setUser(updatedUser);
      localStorage.setItem('visitca_user', JSON.stringify(updatedUser));
      setAvatarSuccess("Profil rasmi muvaffaqiyatli yangilandi");

      // Refetch profile GET /api/b2c/auth/me to stay in sync
      try {
        const meRes = await authService.getMe();
        if (meRes) {
          const freshUser = meRes.user || meRes.data || meRes;
          setUser(freshUser);
          localStorage.setItem('visitca_user', JSON.stringify(freshUser));
        }
      } catch (meErr) {
        console.warn("Profile refetch notice:", meErr);
      }
    } catch (err) {
      console.error("API Error: POST /api/uploads/avatar failed:", err);
      const strMsg = typeof err === 'string' ? err : (err?.message || "Rasmni yuklashda server xatoligi yuz berdi");
      setAvatarError(typeof strMsg === 'string' ? strMsg : "Rasmni yuklashda server xatoligi yuz berdi");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Profil va Sozlamalar</h1>

      {isLoadingProfile ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
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
                    <img src={userAvatar} alt={currentUser.name || 'User'} className="h-full w-full object-cover" />
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

              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{currentUser.name || currentUser.fullName || currentUser.email || currentUser.phone || "Foydalanuvchi"}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Sayohatchi</p>

              {/* Error Banner */}
              {avatarError && (
                <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 p-3 border border-red-200 dark:border-red-800 text-left">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 leading-snug">
                    {typeof avatarError === 'object' ? (avatarError?.message || avatarError?.error?.message || JSON.stringify(avatarError)) : avatarError}
                  </p>
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
                  <span className="font-semibold text-neutral-900 dark:text-white">{currentUser.phone || "Ko'rsatilmagan"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2"><Mail className="h-4 w-4" /> Email</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{currentUser.email || "Ko'rsatilmagan"}</span>
                </div>
              </div>
            </div>

            <div className={`rounded-3xl p-6 border ${currentUser.isVerified || currentUser.oneId ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900' : 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'}`}>
              <div className="flex items-start gap-3">
                {currentUser.isVerified || currentUser.oneId ? <ShieldCheck className="h-6 w-6 text-emerald-600 flex-shrink-0" /> : <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0" />}
                <div>
                  <h3 className={`font-bold ${currentUser.isVerified || currentUser.oneId ? 'text-emerald-900 dark:text-emerald-400' : 'text-amber-900 dark:text-amber-400'} mb-1`}>
                    {currentUser.isVerified || currentUser.oneId ? "Shaxs tasdiqlangan" : "Shaxs tasdiqlanmagan"}
                  </h3>
                  <p className={`text-xs ${currentUser.isVerified || currentUser.oneId ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'} leading-relaxed mb-3`}>
                    {currentUser.isVerified || currentUser.oneId 
                      ? "Siz OneID orqali muvaffaqiyatli avtorizatsiyadan o'tgansiz." 
                      : "Xavfsizlik va avtomatik to'ldirish uchun OneID orqali shaxsingizni tasdiqlang."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Companions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Saved Companions */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Saqlangan hamrohlar</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Keyingi safarlarda ma'lumotlarni qayta kiritmaslik uchun</p>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Qo'shish
                </button>
              </div>

              {companions.length === 0 ? (
                <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  Hozircha saqlangan hamrohlar mavjud emas.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {companions.map(person => (
                    <div key={person._id || person.id} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 relative group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-neutral-900 dark:text-white">{person.name || person.fullName}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">{person.relation || 'Hamroh'}</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Tug'ilgan sana: <span className="font-medium text-neutral-900 dark:text-white">{person.dob || person.dateOfBirth}</span></p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Pasport: <span className="font-medium text-neutral-900 dark:text-white">{person.passport || person.passportNumber}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
