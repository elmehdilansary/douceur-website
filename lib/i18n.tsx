"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "fr" | "ar";

type Dict = Record<string, string>;

const FR: Dict = {
  // Hero
  "hero.eyebrow": "Mouchoirs Extra Doux · Maroc",
  "hero.tagline": "Tissé au Maroc. Ressenti par tous.",
  "hero.features": "600 feuilles · 3 plis · Hypoallergénique",
  "hero.cta.discover": "Découvrir",
  "hero.cta.contact": "Nous Contacter",
  "hero.stat.sheets": "Feuilles",
  "hero.stat.plies": "Plis",
  "hero.stat.natural": "Naturel",
  "hero.scroll": "Scroll",

  // Manifesto
  "manifesto.eyebrow": "Notre engagement",
  "manifesto.title": "Douceur, chaque jour",
  "manifesto.lead": "Des mouchoirs pensés pour accompagner chaque moment de votre vie avec légèreté et fiabilité.",
  "manifesto.stat1": "Feuilles par paquet",
  "manifesto.stat2": "Ultra résistant",
  "manifesto.stat2.suffix": " Plis",
  "manifesto.stat3": "Douceur naturelle",
  "manifesto.stat4": "Choix des familles",
  "manifesto.stat4.suffix": "er",
  "manifesto.panel1.title": "Douceur qui protège",
  "manifesto.panel1.body": "Trois épaisseurs de tendresse, conçues pour prendre soin de vous au quotidien.",
  "manifesto.panel2.title": "Résistance naturelle",
  "manifesto.panel2.body": "Extra résistants même mouillés — parce que la douceur n'exclut pas la solidité.",
  "manifesto.panel3.title": "Fait au Maroc",
  "manifesto.panel3.body": "Fabriqué avec fierté au Maroc, pour les familles marocaines et au-delà.",

  // Products
  "products.eyebrow": "Notre gamme",
  "products.title": "Trois produits, une même douceur",
  "products.lead": "Chaque produit est pensé pour une occasion, une texture, un moment.",
  "products.p1.name": "Mouchoirs",
  "products.p1.subtitle": "Extra Doux & Résistants",
  "products.p1.desc": "La douceur qui enveloppe chaque geste. Ultra-résistants à la déchirure, doux au toucher.",
  "products.p1.tag1": "600 / 300 Feuilles",
  "products.p1.tag2": "3 Plis",
  "products.p1.tag3": "Hypoallergénique",
  "products.p1.badge": "🌺 Best-seller",
  "products.p2.name": "Papier Hygiénique",
  "products.p2.subtitle": "Douceur & Résistance Quotidienne",
  "products.p2.desc": "Conçu pour la famille entière. Ultra résistant même mouillé, avec une douceur naturelle incomparable.",
  "products.p2.tag1": "Rouleau XXL",
  "products.p2.tag2": "3 Plis",
  "products.p2.tag3": "Extra Fort",
  "products.p2.badge": "🌿 Naturel",
  "products.p3.name": "Lingettes",
  "products.p3.subtitle": "Fraîcheur à Portée de Main",
  "products.p3.desc": "Douces, humides et parfumées. Parfaites pour le visage, les mains et les tout-petits.",
  "products.p3.tag1": "80 Lingettes",
  "products.p3.tag2": "Parfumées",
  "products.p3.tag3": "Bébé Safe",
  "products.p3.badge": "✨ Nouveau",

  // Materials
  "materials.eyebrow": "Nos Engagements",
  "materials.title": "Pourquoi {LOGO} ?",
  "materials.f1.title": "Fibres naturelles sélectionnées",
  "materials.f1.body": "Chaque feuille Douceur est fabriquée à partir de fibres de cellulose vierge soigneusement sélectionnées pour leur pureté et leur douceur incomparable.",
  "materials.f1.detail": "Cellulose 100% vierge",
  "materials.f2.title": "Technologie 3 plis",
  "materials.f2.body": "Notre procédé exclusif à trois épaisseurs crée une barrière protectrice tout en conservant une souplesse au toucher sans égal.",
  "materials.f2.detail": "3× plus résistant",
  "materials.f3.title": "Hypoallergénique",
  "materials.f3.body": "Sans parfum agressif, sans colorant nocif. Douceur prend soin des peaux sensibles, des plus petits aux plus grands.",
  "materials.f3.detail": "Testé dermatologiquement",
  "materials.f4.title": "Qualité Marocaine",
  "materials.f4.body": "Produit au cœur du Maroc selon des standards internationaux rigoureux, Douceur est le choix numéro 1 des familles marocaines.",
  "materials.f4.detail": "Made in Morocco",

  // Contact
  "contact.eyebrow": "Contact",
  "contact.title": "Parlons ensemble",
  "contact.lead": "Une question, un partenariat, ou simplement envie de dire bonjour ?",
  "contact.name": "Nom",
  "contact.email": "Email",
  "contact.message": "Message",
  "contact.send": "Envoyer le message 🌺",
  "contact.sending": "Envoi en cours…",
  "contact.sent": "Message envoyé !",
  "contact.sent.sub": "Nous vous répondrons très bientôt.",
  "contact.lead2": "Distributeurs, revendeurs ou curieux — nous sommes là pour vous répondre.",
  "contact.field.name": "Nom complet",
  "contact.field.company": "Entreprise",
  "contact.field.email": "Email",
  "contact.field.phone": "Téléphone",
  "contact.field.role": "Je suis",
  "contact.field.message": "Message",
  "contact.field.optional": "(optionnel)",
  "contact.role.distributor": "Distributeur",
  "contact.role.reseller": "Revendeur",
  "contact.role.individual": "Particulier",
  "contact.role.other": "Autre",

  // Footer
  "footer.follow": "Suivez-nous",
  "footer.contact": "Contact",
  "footer.write": "Nous écrire",
  "footer.madein": "Fabriqué au Maroc",
  "footer.withlove": "Avec amour",
  "footer.tagline": "Douceur dans chaque geste, chaque jour.",
  "footer.subtitle": "Mouchoirs Extra Doux\net Résistants",
  "footer.rights": "Tous droits réservés.",
  "footer.bottom": "Fabriqué au Maroc avec soin",
  "footer.badge1": "600 / 300 Feuilles",
  "footer.badge2": "3 Plis",
  "footer.badge3": "100% Naturel",

  // Loader
  "loader.sub": "Maroc",

  // Panda
  "panda.msg1": "Bienvenue ! 🐼✨",
  "panda.msg2": "Doux & résistant 💫",
  "panda.msg3": "600 / 300 feuilles !",
  "panda.msg4": "Regarde ces packs 🌺",
  "panda.msg5": "Fait au Maroc 🇲🇦",
  "panda.msg6": "100% naturel 🌿",
  "panda.msg7": "Merci de venir ! 💙",

  // ScrollScene labels
  "scroll.s1.title": "Douceur Tropical",
  "scroll.s1.sub":   "600 feuilles · 3 plis · Hypoallergénique",
  "scroll.s2.title": "Édition Violette",
  "scroll.s2.sub":   "Douceur & Résistance au quotidien",
  "scroll.s3.title": "Édition Bleue",
  "scroll.s3.sub":   "Extra doux pour toute la famille",
  "scroll.s4.title": "Édition Menthe",
  "scroll.s4.sub":   "Fraîcheur naturelle · Fait au Maroc",

  // Lang switch
  "lang.switch": "العربية",
};

const AR: Dict = {
  // Hero
  "hero.eyebrow": "مناديل فائقة النعومة · المغرب",
  "hero.tagline": "مصنوع في المغرب. يشعر به الجميع.",
  "hero.features": "600 ورقة · 3 طبقات · مضاد للحساسية",
  "hero.cta.discover": "اكتشف",
  "hero.cta.contact": "اتصل بنا",
  "hero.stat.sheets": "ورقة",
  "hero.stat.plies": "طبقات",
  "hero.stat.natural": "طبيعي",
  "hero.scroll": "مرّر",

  // Manifesto
  "manifesto.eyebrow": "التزامنا",
  "manifesto.title": "نعومة، كل يوم",
  "manifesto.lead": "مناديل مصممة لترافق كل لحظة من حياتك بخفة وموثوقية.",
  "manifesto.stat1": "ورقة في كل علبة",
  "manifesto.stat2": "مقاومة فائقة",
  "manifesto.stat2.suffix": " طبقات",
  "manifesto.stat3": "نعومة طبيعية",
  "manifesto.stat4": "خيار العائلات",
  "manifesto.stat4.suffix": "",
  "manifesto.panel1.title": "نعومة تحمي",
  "manifesto.panel1.body": "ثلاث طبقات من الحنان، مصممة للعناية بك يومياً.",
  "manifesto.panel2.title": "مقاومة طبيعية",
  "manifesto.panel2.body": "فائقة المقاومة حتى عند البلل — لأن النعومة لا تستبعد القوة.",
  "manifesto.panel3.title": "صُنع في المغرب",
  "manifesto.panel3.body": "مصنوع بفخر في المغرب، للعائلات المغربية وأبعد من ذلك.",

  // Products
  "products.eyebrow": "تشكيلتنا",
  "products.title": "ثلاثة منتجات، نعومة واحدة",
  "products.lead": "كل منتج مصمم لمناسبة، لنسيج، للحظة.",
  "products.p1.name": "مناديل ورقية",
  "products.p1.subtitle": "فائقة النعومة والمقاومة",
  "products.p1.desc": "النعومة التي تغلف كل حركة. مقاومة فائقة للتمزق، ناعمة الملمس.",
  "products.p1.tag1": "600 / 300 ورقة",
  "products.p1.tag2": "3 طبقات",
  "products.p1.tag3": "مضاد للحساسية",
  "products.p1.badge": "🌺 الأكثر مبيعاً",
  "products.p2.name": "ورق المرحاض",
  "products.p2.subtitle": "نعومة ومقاومة يومية",
  "products.p2.desc": "مصمم لكل أفراد العائلة. مقاومة فائقة حتى عند البلل، بنعومة طبيعية لا مثيل لها.",
  "products.p2.tag1": "لفة كبيرة جداً",
  "products.p2.tag2": "3 طبقات",
  "products.p2.tag3": "قوة إضافية",
  "products.p2.badge": "🌿 طبيعي",
  "products.p3.name": "مناديل مبللة",
  "products.p3.subtitle": "انتعاش في متناول اليد",
  "products.p3.desc": "ناعمة، مبللة، ومعطرة. مثالية للوجه واليدين والأطفال الصغار.",
  "products.p3.tag1": "80 منديل",
  "products.p3.tag2": "معطرة",
  "products.p3.tag3": "آمنة للأطفال",
  "products.p3.badge": "✨ جديد",

  // Materials
  "materials.eyebrow": "التزاماتنا",
  "materials.title": "لماذا {LOGO}؟",
  "materials.f1.title": "ألياف طبيعية مختارة",
  "materials.f1.body": "كل ورقة Douceur مصنوعة من ألياف السليلوز البكر المختارة بعناية لنقائها ونعومتها التي لا مثيل لها.",
  "materials.f1.detail": "سليلوز بكر 100٪",
  "materials.f2.title": "تقنية ثلاث طبقات",
  "materials.f2.body": "عمليتنا الحصرية ذات الثلاث طبقات تخلق حاجزاً واقياً مع الحفاظ على ملمس ناعم لا يضاهى.",
  "materials.f2.detail": "أقوى 3 مرات",
  "materials.f3.title": "مضاد للحساسية",
  "materials.f3.body": "بدون عطور قاسية، بدون ملونات ضارة. Douceur تعتني بالبشرة الحساسة، من الصغار إلى الكبار.",
  "materials.f3.detail": "مختبر طبياً",
  "materials.f4.title": "جودة مغربية",
  "materials.f4.body": "مُصنع في قلب المغرب وفق معايير دولية صارمة، Douceur هو الخيار الأول للعائلات المغربية.",
  "materials.f4.detail": "صُنع في المغرب",

  // Contact
  "contact.eyebrow": "اتصل بنا",
  "contact.title": "لنتحدث معاً",
  "contact.lead": "سؤال، شراكة، أو فقط ترغب في إلقاء التحية؟",
  "contact.name": "الاسم",
  "contact.email": "البريد الإلكتروني",
  "contact.message": "الرسالة",
  "contact.send": "إرسال الرسالة 🌺",
  "contact.sending": "جاري الإرسال…",
  "contact.sent": "تم إرسال الرسالة!",
  "contact.sent.sub": "سنرد عليك قريباً جداً.",
  "contact.lead2": "موزعون، بائعون أو فضوليون — نحن هنا للرد عليك.",
  "contact.field.name": "الاسم الكامل",
  "contact.field.company": "الشركة",
  "contact.field.email": "البريد الإلكتروني",
  "contact.field.phone": "الهاتف",
  "contact.field.role": "أنا",
  "contact.field.message": "الرسالة",
  "contact.field.optional": "(اختياري)",
  "contact.role.distributor": "موزع",
  "contact.role.reseller": "بائع",
  "contact.role.individual": "فرد",
  "contact.role.other": "آخر",

  // Footer
  "footer.follow": "تابعنا",
  "footer.contact": "اتصل بنا",
  "footer.write": "راسلنا",
  "footer.madein": "صُنع في المغرب",
  "footer.withlove": "بكل حب",
  "footer.tagline": "نعومة في كل حركة، كل يوم.",
  "footer.subtitle": "مناديل فائقة النعومة\nوالمقاومة",
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.bottom": "صُنع في المغرب بعناية",
  "footer.badge1": "600 / 300 ورقة",
  "footer.badge2": "3 طبقات",
  "footer.badge3": "100٪ طبيعي",

  // Loader
  "loader.sub": "المغرب",

  // Panda
  "panda.msg1": "مرحباً! 🐼✨",
  "panda.msg2": "ناعم ومقاوم 💫",
  "panda.msg3": "600 / 300 ورقة!",
  "panda.msg4": "انظر إلى هذه العلب 🌺",
  "panda.msg5": "صُنع في المغرب 🇲🇦",
  "panda.msg6": "طبيعي 100٪ 🌿",
  "panda.msg7": "شكراً لزيارتك! 💙",

  // ScrollScene labels
  "scroll.s1.title": "Douceur الاستوائي",
  "scroll.s1.sub":   "600 ورقة · 3 طبقات · مضاد للحساسية",
  "scroll.s2.title": "الإصدار البنفسجي",
  "scroll.s2.sub":   "نعومة ومقاومة كل يوم",
  "scroll.s3.title": "الإصدار الأزرق",
  "scroll.s3.sub":   "ناعم للغاية للعائلة بأكملها",
  "scroll.s4.title": "الإصدار النعناعي",
  "scroll.s4.sub":   "انتعاش طبيعي · صُنع في المغرب",

  // Lang switch
  "lang.switch": "Français",
};

const DICTS: Record<Lang, Dict> = { fr: FR, ar: AR };

type I18nCtx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };

const Ctx = createContext<I18nCtx>({ lang: "fr", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("douceur-lang")) as Lang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "fr" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("douceur-lang", l);
  };

  const t = (k: string) => DICTS[lang][k] ?? k;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useT() {
  return useContext(Ctx);
}
