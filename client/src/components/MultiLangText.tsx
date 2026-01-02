import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Translation {
  lang: string;
  text: string;
  font?: string;
}

interface MultiLangTextProps {
  translations: Translation[];
  interval?: number;
  className?: string;
}

export function MultiLangText({ translations, interval = 1500, className }: MultiLangTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (translations.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % translations.length);
    }, interval);
    return () => clearInterval(timer);
  }, [translations, interval]);

  const current = translations[index];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4 }}
          className={`${className} ${current.font || ''}`}
        >
          {current.text}
        </motion.div>
      </AnimatePresence>
      {translations.length > 1 && (
        <div className="absolute -bottom-5 right-0 text-[10px] text-muted-foreground uppercase tracking-tighter opacity-50">
          {current.lang}
        </div>
      )}
    </div>
  );
}
