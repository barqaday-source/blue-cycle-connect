import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "ku";
export const LANG_KEY = "tb_lang";

/** كل نصوص الواجهة — عربي/كوردي */
export const DICT = {
  ar: {
    // عام
    brand: "تدوير بلو",
    home: "الرئيسية",
    map: "الخريطة",
    prices: "أسعار اليوم",
    wallet: "المحفظة",
    profile: "حسابي",
    shipments: "شحناتي",
    notifications: "الإشعارات",
    menu: "القائمة",
    back: "رجوع",
    save: "حفظ",
    saving: "جاري الحفظ",
    saved: "تم الحفظ",
    cancel: "إلغاء",
    delete: "حذف",
    deleted: "تم الحذف",
    confirm: "تأكيد",
    loading: "جاري التحميل",
    empty: "لا توجد بيانات بعد",
    error: "حدث خطأ، حاول مرة أخرى",
    signOut: "خروج",
    kg: "كغ",
    iqdPerKg: "د.ع/كغ",
    all: "عرض الكل",
    search: "بحث",
    call: "اتصال",
    whatsapp: "واتساب",
    language: "اللغة",
    langSwitch: "کوردی",

    // المواطن
    yourLocation: "موقعك",
    hello: "أهلاً",
    citizenHeadline: "صوّر موادك، واكسب من بيتك.",
    startNow: "ابدأ الآن",
    captureEarn: "صوّر واكسب",
    pricesHint: "شوف سعر الكيلو لكل مادة قبل ما تبيع",
    mapHint: "شوف المواطنين والشركات القريبة منك",
    pickMaterial: "اختر نوع المادة بسرعة",
    myCurrentShipments: "شحناتي الحالية",
    noShipments: "لا توجد شحنات بعد — ابدأ بنشر أول وجبة الآن",
    companyOffers: "عروض الشركات",
    newShipment: "وجبة جديدة",
    material: "المادة",
    weight: "الوزن التقديري",
    area: "المنطقة",
    notes: "ملاحظات",
    photo: "صورة المواد",
    takePhoto: "التقاط صورة",
    fromGallery: "من المعرض",
    publish: "نشر",
    published: "تم نشر الوجبة",
    balance: "الرصيد",
    transactions: "الحركات",

    // الشركة
    companyPanel: "لوحة الشركة",
    feed: "خلاصة الشحنات",
    orders: "الطلبات",
    ads: "الإعلانات",
    stats: "الإحصائيات",
    collectors: "المجمعون",
    newAd: "إعلان جديد",
    adTitle: "عنوان الإعلان",
    adDesc: "وصف الإعلان",
    pricePerKg: "سعر الكيلو",
    accept: "قبول",
    reject: "رفض",
    accepted: "مقبول",
    rejected: "مرفوض",
    pending: "قيد الانتظار",
    joinRequests: "طلبات الانضمام",
    myCompany: "شركتي",
    joinCompany: "انضم إلى شركة",
    nearestCompanies: "أقرب الشركات إليك",
    requestSent: "تم إرسال الطلب",
    opportunities: "الفرص",
    directory: "دليل الشركات",

    // الحساب
    editProfile: "تعديل الحساب",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني",
    companyName: "اسم الشركة",
    city: "المدينة",
    address: "العنوان والموقع",
    privacy: "الخصوصية",
    avatar: "الصورة الشخصية",
    adminPanel: "لوحة المدير",
  },
  ku: {
    brand: "تەدویری بلو",
    home: "سەرەکی",
    map: "نەخشە",
    prices: "نرخی ئەمڕۆ",
    wallet: "جیبە",
    profile: "ئاکاونتم",
    shipments: "بارەکانم",
    notifications: "ئاگادارییەکان",
    menu: "لیست",
    back: "گەڕانەوە",
    save: "پاشەکەوت",
    saving: "پاشەکەوتکردن",
    saved: "پاشەکەوت کرا",
    cancel: "هەڵوەشاندن",
    delete: "سڕینەوە",
    deleted: "سڕدرا",
    confirm: "پشتڕاستکردن",
    loading: "بارکردن",
    empty: "هێشتا زانیاری نییە",
    error: "هەڵەیەک ڕوویدا، دووبارە هەوڵ بدە",
    signOut: "چوونەدەرەوە",
    kg: "کگم",
    iqdPerKg: "دینار/کگم",
    all: "هەموو",
    search: "گەڕان",
    call: "پەیوەندی",
    whatsapp: "واتساپ",
    language: "زمان",
    langSwitch: "العربية",

    yourLocation: "شوێنی تۆ",
    hello: "بەخێربێی",
    citizenHeadline: "وێنەی کەلوپەلەکانت بگرە و لە ماڵەوە قازانج بکە.",
    startNow: "ئێستا دەست پێبکە",
    captureEarn: "وێنە بگرە و قازانج بکە",
    pricesHint: "پێش فرۆشتن نرخی کیلۆ بۆ هەر مادەیەک ببینە",
    mapHint: "هاووڵاتیان و کۆمپانیاکانی نزیک ببینە",
    pickMaterial: "جۆری مادە هەڵبژێرە",
    myCurrentShipments: "بارەکانی ئێستام",
    noShipments: "هێشتا بارێک نییە — یەکەم بار بڵاو بکەوە",
    companyOffers: "پێشکەشکردنی کۆمپانیاکان",
    newShipment: "بارێکی نوێ",
    material: "مادە",
    weight: "کێشی خەملێنراو",
    area: "ناوچە",
    notes: "تێبینی",
    photo: "وێنەی مادەکان",
    takePhoto: "وێنە بگرە",
    fromGallery: "لە گەلەری",
    publish: "بڵاوکردنەوە",
    published: "بار بڵاو کرایەوە",
    balance: "باڵانس",
    transactions: "جوڵەکان",

    companyPanel: "پانێلی کۆمپانیا",
    feed: "لیستی بارەکان",
    orders: "داواکارییەکان",
    ads: "ڕیکلامەکان",
    stats: "ئامارەکان",
    collectors: "کۆکەرەوەکان",
    newAd: "ڕیکلامی نوێ",
    adTitle: "ناونیشانی ڕیکلام",
    adDesc: "وەسفی ڕیکلام",
    pricePerKg: "نرخی کیلۆ",
    accept: "پەسەندکردن",
    reject: "ڕەتکردنەوە",
    accepted: "پەسەندکراو",
    rejected: "ڕەتکراوە",
    pending: "چاوەڕوان",
    joinRequests: "داواکاری پەیوەندی",
    myCompany: "کۆمپانیاکەم",
    joinCompany: "پەیوەندی بە کۆمپانیایەک",
    nearestCompanies: "نزیکترین کۆمپانیاکان",
    requestSent: "داواکاری نێردرا",
    opportunities: "دەرفەتەکان",
    directory: "ڕێنمای کۆمپانیاکان",

    editProfile: "دەستکاری ئاکاونت",
    fullName: "ناوی تەواو",
    phone: "ژمارەی مۆبایل",
    email: "ئیمەیڵ",
    companyName: "ناوی کۆمپانیا",
    city: "شار",
    address: "ناونیشان و شوێن",
    privacy: "تایبەتمەندی",
    avatar: "وێنەی کەسی",
    adminPanel: "پانێلی بەڕێوەبەر",
  },
} as const;

export type TKey = keyof typeof DICT.ar;

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (k: TKey) => string;
}

const Ctx = createContext<LangState | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "ar" || saved === "ku") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = "rtl";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const value: LangState = {
    lang,
    setLang,
    toggle: () => setLang(lang === "ar" ? "ku" : "ar"),
    t: (k) => DICT[lang][k] ?? DICT.ar[k],
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangState {
  const v = useContext(Ctx);
  if (v) return v;
  // fallback آمن قبل تركيب المزوّد
  return {
    lang: "ar",
    setLang: () => {},
    toggle: () => {},
    t: (k) => DICT.ar[k],
  };
}

/** ترجمة أسماء المواد وحالات الشحنة */
export const MATERIAL_LABELS: Record<string, { ar: string; ku: string }> = {
  plastic: { ar: "بلاستيك", ku: "پلاستیک" },
  paper: { ar: "ورق", ku: "کاغەز" },
  metal: { ar: "معدن", ku: "کانزا" },
  glass: { ar: "زجاج", ku: "شووشە" },
  electronics: { ar: "إلكترونيات", ku: "ئەلیکترۆنیات" },
  cardboard: { ar: "كارتون", ku: "کارتۆن" },
  aluminum: { ar: "ألمنيوم", ku: "ئەلەمینیۆم" },
  copper: { ar: "نحاس", ku: "مس" },
  other: { ar: "أخرى", ku: "هیتر" },
};

export const STATUS_LABELS: Record<string, { ar: string; ku: string }> = {
  pending: { ar: "قيد الانتظار", ku: "چاوەڕوان" },
  accepted: { ar: "مقبولة", ku: "پەسەندکراو" },
  assigned: { ar: "مُسندة", ku: "سپێردراو" },
  collected: { ar: "تم الاستلام", ku: "وەرگیراوە" },
  completed: { ar: "مكتملة", ku: "تەواوکراو" },
  rejected: { ar: "مرفوضة", ku: "ڕەتکراوە" },
  cancelled: { ar: "ملغاة", ku: "هەڵوەشێنراوە" },
};

export function materialLabel(key: string, lang: Lang, fallback?: string) {
  return MATERIAL_LABELS[key]?.[lang] ?? fallback ?? key;
}
export function statusLabel(key: string, lang: Lang, fallback?: string) {
  return STATUS_LABELS[key]?.[lang] ?? fallback ?? key;
}
