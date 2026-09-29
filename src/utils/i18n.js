export const translations = {
  UZ: {
    heroTitle: "O'zbekiston kashf etilishini kutmoqda",
    heroDesc: "Visitca Trip — O'zbekiston bo'ylab eng yaxshi turlar, mehmonxonalar va sarguzashtlarni topish va band qilish uchun ishonchli hamrohingiz.",
    searchHint: "(Qidiruv paneliga bosib \"C-03: Qidiruv\" ga, Pastdagi istalgan turga bosib \"C-05: Tur tafsilotlari\" ga o'ting)",
    seoPage: "SEO Sahifa",
    partners: "Hamkorlarga",
    b2bStatus: "B2B / Statuslar",
    login: "Kirish",
    myProfile: "Mening profilim",
    myTrips: "Mening safarlarim",
    chat: "Xabarlar (Chat)",
    customTour: "Men uchun tur",
    support: "Qo'llab-quvvatlash",
    logout: "Chiqish",
    notifications: "Bildirishnomalar",
    markAllRead: "Barchasini o'qildi qilish",
    noNotif: "Hech qanday bildirishnoma yo'q",
    footerText: "O'zbekistonning boy tarixi, madaniyati va go'zal tabiatini biz bilan birga kashf eting.",
    footerRights: "© 2026 Visitca Trip. Barcha huquqlar himoyalangan."
  },
  RU: {
    heroTitle: "Узбекистан ждет своего открытия",
    heroDesc: "Visitca Trip — ваш надежный спутник в поиске и бронировании лучших туров, отелей и приключений по всему Узбекистану.",
    searchHint: "(Нажмите на поиск, чтобы перейти к \"C-03: Поиск\", или на любой тур ниже для \"C-05: Детали тура\")",
    seoPage: "SEO Страница",
    partners: "Партнерам",
    b2bStatus: "B2B / Статусы",
    login: "Войти",
    myProfile: "Мой профиль",
    myTrips: "Мои поездки",
    chat: "Сообщения (Чат)",
    customTour: "Тур для меня",
    support: "Поддержка",
    logout: "Выйти",
    notifications: "Уведомления",
    markAllRead: "Отметить все как прочитанные",
    noNotif: "Нет уведомлений",
    footerText: "Откройте для себя богатую историю, культуру и красивую природу Узбекистана вместе с нами.",
    footerRights: "© 2026 Visitca Trip. Все права защищены."
  },
  EN: {
    heroTitle: "Uzbekistan is waiting to be discovered",
    heroDesc: "Visitca Trip is your reliable companion for finding and booking the best tours, hotels, and adventures across Uzbekistan.",
    searchHint: "(Click on the search bar to go to \"C-03: Search\", or click any tour below to view \"C-05: Tour Details\")",
    seoPage: "SEO Page",
    partners: "For Partners",
    b2bStatus: "B2B / Statuses",
    login: "Login",
    myProfile: "My Profile",
    myTrips: "My Trips",
    chat: "Messages (Chat)",
    customTour: "Custom Tour",
    support: "Support",
    logout: "Logout",
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotif: "No notifications",
    footerText: "Discover the rich history, culture, and beautiful nature of Uzbekistan with us.",
    footerRights: "© 2026 Visitca Trip. All rights reserved."
  }
};

export const useTranslation = (lang) => {
  return (key) => {
    return translations[lang]?.[key] || translations['UZ'][key] || key;
  };
};
