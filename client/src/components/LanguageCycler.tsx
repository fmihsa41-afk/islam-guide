import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultTranslations = [
  { lang: 'English', text: "Islam is a monotheistic religion that teaches belief in one God (Allah) and following His guidance as revealed to the Prophet Muhammad through the Qur’an." },
  { lang: 'Spanish', text: "El Islam es una religión monoteísta que enseña la creencia en un solo Dios (Allah) y el seguimiento de Su guía revelada al Profeta Muhammad a través del Corán." },
  { lang: 'French', text: "L'Islam est une religion monothéiste qui enseigne la croyance en un seul Dieu (Allah) et le suivi de Sa guidance révélée au Prophète Muhammad à travers le Coran." },
  { lang: 'Russian', text: "Ислам — это монотеистическая религия, которая учит вере в единого Бога (Аллаха) и следованию Его руководству, ниспосланному Пророку Мухаммаду через Коран." },
  { lang: 'German', text: "Der Islam ist eine monotheistische Religion, die den Glauben an einen Gott (Allah) und das Befolgen Seiner Führung lehrt, wie sie dem Propheten Muhammad durch den Koran offenbart wurde." },
  { lang: 'Arabic', text: "الإسلام هو دين توحيدي يعلم الإيمان بإله واحد (الله) واتباع هديه كما نزل على النبي محمد من خلال القرآن الكريم.", font: "font-arabic" }
];

interface LanguageCyclerProps {
  customTranslations?: typeof defaultTranslations;
}

export function LanguageCycler({ customTranslations }: LanguageCyclerProps) {
  const [index, setIndex] = useState(0);
  const translations = customTranslations || defaultTranslations;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % translations.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [translations.length]);

  const current = translations[index];

  return (
    <div className="min-h-[100px] flex items-start gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          className={`text-lg leading-relaxed flex-1 ${current.font || 'font-sans'}`}
        >
          {current.text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
