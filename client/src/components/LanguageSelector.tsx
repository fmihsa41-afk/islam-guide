import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect: (lang: string) => void;
}

const languages = [
  { name: 'English', flag: '🇺🇸', code: 'en' },
  { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  { name: 'French', flag: '🇫🇷', code: 'fr' },
  { name: 'Russian', flag: '🇷🇺', code: 'ru' },
  { name: 'German', flag: '🇩🇪', code: 'de' },
  { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
];

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const [showMouse, setShowMouse] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMouse(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold font-serif mb-2">Choose your language</h2>
        <p className="text-muted-foreground">Select a language to continue your journey</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full relative">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(lang.code);
            }}
            className="flex items-center gap-4 p-6 bg-card border-2 border-border/50 rounded-2xl hover:border-primary transition-all text-left relative group"
          >
            <span className="text-3xl">{lang.flag}</span>
            <span className="font-semibold text-lg">{lang.name}</span>
            
            {lang.code === 'en' && showMouse && (
              <motion.div
                className="absolute z-50 pointer-events-none"
                initial={{ x: 100, y: 100, opacity: 0 }}
                animate={{ x: 20, y: 20, opacity: 1, scale: [1, 0.8, 1] }}
                transition={{ duration: 1.5, delay: 0.5 }}
              >
                <MousePointer2 className="h-8 w-8 text-black fill-white drop-shadow-md" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
