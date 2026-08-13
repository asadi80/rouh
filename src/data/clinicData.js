// ============================================================
// بيانات العيادة — عدّل كل القيم هنا لتحديث محتوى الموقع بالكامل
// All clinic content lives here. Edit these values to update the site.
// ============================================================

export const clinicInfo = {
  name: "مصحة روح للطب النفسي",
  shortName: "مصحة روح",
  tagline: "معًا نحو صحة نفسية أفضل",
  description:
   " مصحّة روح للطب النفسي مؤسسة متخصصة في علاج الاضطرابات النفسية والعقلية والإدمان، تقدم رعاية طبية ونفسية قائمة على أسس علمية، عبر فريق مؤهل، ضمن بيئة آمنة تحترم الخصوصية وتدعم جودة الحياة",
  phone: "+218916669082",
  phoneDisplay: "+218916669082",
  whatsapp: "+218916669082",
  email: "clinic@rouh.ly",
  address: "شارع الشيخ - النوفلين - طرابلس - ليبيا",
  // رابط "المشاركة" من خرائط Google لموقع العيادة (اضغط "مشاركة" في تطبيق الخرائط وانسخ الرابط هنا)
  googleMapsUrl: "https://maps.app.goo.gl/yZhunz2nXeEBop1d8",
  
  // رابط تضمين (Embed) من خرائط Google لعرض الخريطة داخل الصفحة
  googleMapsEmbedUrl:
     "https://www.google.com/maps?q=32.88791132521724,13.21959187976219&hl=ar&z=15&output=embed",
};

export const socialLinks = [
  { id: "instagram", label: "انستغرام", url: "https://instagram.com/alshifa.clinic" },
  { id: "whatsapp", label: "واتساب", url: "https://wa.me/966500000000" },
  { id: "twitter", label: "X (تويتر)", url: "https://x.com/alshifa_clinic" },
  { id: "facebook", label: "فيسبوك", url: "https://www.facebook.com/p/%D9%85%D8%B5%D8%AD%D8%A9-%D8%B1%D9%88%D8%AD-%D9%84%D9%84%D8%B7%D8%A8-%D8%A7%D9%84%D9%86%D9%81%D8%B3%D9%8A-61584759076913/" },
  { id: "tiktok", label: "تيك توك", url: "https://tiktok.com/@alshifa.clinic" },
  { id: "snapchat", label: "سناب شات", url: "https://snapchat.com/add/alshifa.clinic" },
];

// أوقات العمل الأسبوعية
export const workingHours = [
  { day: "السبت", hours: "9:00 ص – 9:00 م", isOpen: true },
  { day: "الأحد", hours: "9:00 ص – 9:00 م", isOpen: true },
  { day: "الاثنين", hours: "9:00 ص – 9:00 م", isOpen: true },
  { day: "الثلاثاء", hours: "9:00 ص – 9:00 م", isOpen: true },
  { day: "الأربعاء", hours: "9:00 ص – 9:00 م", isOpen: true },
  { day: "الخميس", hours: "9:00 ص – 9:00 م", isOpen: true },
  { day: "الجمعة", hours: "9:00 م – 3:00 م", isOpen: true },
];

// قائمة الأطباء وجداولهم — أضف أو عدّل الأطباء هنا
export const doctors = [
  {
    id: 1,
    name: "د. إسراء التلاوي",
    title: " أخصائية علاج نفسي ",
    specialty: "اضطرابات القلق والاكتئاب والاضطرابات الجنسية.",
    initials: "س.ع",
     image: "../assets/doctors/essra.jpg",
    bio: "بخبرة تمتد لـ 10 سنوات، نقدم لك مساحة آمنة وموثوقة للدعم والعلاج المتخصص في القلق والاكتئاب، الاضطرابات النفسية، المشكلات الزوجية والعاطفية، والاضطرابات الجنسية .",
    schedule: [
      { day: "الأحد", time: "3:00 م – 9:00 م" },
      { day: "الأربعاء", time: "3:00 م – 9:00 م" },
    ],
  },
  {
    id: 2,
    name: "د. خالد المطيري",
    title: "استشاري الطب النفسي للأطفال والمراهقين",
    specialty: "طب نفسي للأطفال والمراهقين",
    initials: "خ.م",
    bio: "متخصص في اضطرابات فرط الحركة وتشتت الانتباه وصعوبات التعلم النفسية.",
    schedule: [
      { day: "الأحد", time: "9:00 ص – 1:00 م" },
      { day: "الثلاثاء", time: "9:00 ص – 1:00 م" },
      { day: "الخميس", time: "9:00 ص – 1:00 م" },
    ],
  },
  {
    id: 3,
    name: "د. نورة الحربي",
    title: "أخصائية العلاج النفسي المعرفي السلوكي",
    specialty: "العلاج المعرفي السلوكي (CBT)",
    initials: "ن.ح",
    bio: "تقدّم جلسات علاج فردي وجماعي باستخدام أساليب معرفية سلوكية حديثة.",
    schedule: [
      { day: "السبت", time: "2:00 م – 6:00 م" },
      { day: "الثلاثاء", time: "2:00 م – 6:00 م" },
      { day: "الأربعاء", time: "10:00 ص – 2:00 م" },
    ],
  },
  {
    id: 4,
    name: "د. فهد القحطاني",
    title: "استشاري الطب النفسي وعلاج الإدمان",
    specialty: "علاج الإدمان والاضطرابات المصاحبة",
    initials: "ف.ق",
    bio: "يقدّم برامج علاجية متكاملة للتعافي من الإدمان بالتعاون مع فريق متعدد التخصصات.",
    schedule: [
      { day: "الأحد", time: "4:00 م – 8:00 م" },
      { day: "الخميس", time: "1:00 م – 5:00 م" },
    ],
  },
];

export const stats = [
  { value: "+12", label: "سنة خبرة" },
  { value: "+4", label: "أطباء واستشاريون" },
  { value: "+3200", label: "مراجع تمت رعايتهم" },
];
