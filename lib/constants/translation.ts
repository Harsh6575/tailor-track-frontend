export const translations = {
  en: {
    length: "Length",
    chest: "Chest",
    sleeve: "Sleeve",
    shoulder: "Shoulder",
    waist: "Waist",
    front: "Front",
    neck: "Neck",
    hip: "Hip",
    ankles: "Ankles",
    thighs: "Thighs",
    rise: "Rise",
    knee: "Knee",
    notes: "Notes",
  },
  gu: {
    length: "લંબાઈ",
    chest: "છાતી",
    sleeve: "બાંય",
    shoulder: "સોલ્ડર",
    waist: "કમર",
    front: "પેચ",
    neck: "કોલર",
    hip: "સીટ",
    ankles: "મોરી",
    thighs: "જાંઘ",
    rise: "જોલો",
    knee: "ગોઠણ",
    notes: "નોંધ",
  },
} as const;

export type SupportedLang = keyof typeof translations;

/** Simple translation helper */
export const t = (key: keyof (typeof translations)["en"], lang: SupportedLang = "en") => {
  return translations[lang][key] || key;
};
