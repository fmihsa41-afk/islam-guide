import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, MousePointer2 } from 'lucide-react'

interface CongratulationsModalProps {
  onContinue?: () => void
}

const translations = {
  heading: [
    { lang: 'English', text: 'MashaAllah!' },
    { lang: 'Spanish', text: '¡MashaAllah!' },
    { lang: 'French', text: 'MashaAllah!' },
    { lang: 'Russian', text: 'МашаАллах!' },
    { lang: 'German', text: 'MashaAllah!' },
    { lang: 'Arabic', text: 'ما شاء الله!', font: 'font-arabic' },
  ],
  description: [
    {
      lang: 'English',
      text: 'Congratulations on becoming a Muslim. May Allah bless your journey and increase you in knowledge.',
    },
    {
      lang: 'Spanish',
      text: 'Felicidades por convertirte en musulmán. Que Alá bendiga tu camino y te aumente en conocimiento.',
    },
    {
      lang: 'French',
      text: "Félicitations pour être devenu musulman. Qu'Allah bénisse votre voyage et vous augmente en connaissance.",
    },
    {
      lang: 'Russian',
      text: 'Поздравляем с принятием ислама. Да благословит Аллах ваш путь и увеличит ваши знания.',
    },
    {
      lang: 'German',
      text: 'Herzlichen Glückwunsch, dass Sie Muslim geworden sind. Möge Allah Ihre Reise segnen und Ihr Wissen vermehren.',
    },
    {
      lang: 'Arabic',
      text: 'تهانينا على إسلامك. بارك الله في رحلتك وزادك علماً.',
      font: 'font-arabic'
    },
  ],
  button: [
    { lang: 'English', text: 'Start Learning' },
    { lang: 'Spanish', text: 'Comenzar a Aprender' },
    { lang: 'French', text: 'Commencer à Apprendre' },
    { lang: 'Russian', text: 'Начать Обучение' },
    { lang: 'German', text: 'Lernen Beginnen' },
    { lang: 'Arabic', text: 'ابدأ التعلم', font: 'font-arabic' },
  ],
}

export function CongratulationsModal({ onContinue }: CongratulationsModalProps) {
  const [langIndex, setLangIndex] = useState(0)
  const [showMouse, setShowMouse] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % translations.heading.length)
    }, 1500)

    // Show mouse after a short delay
    const mouseTimer = setTimeout(() => {
      setShowMouse(true)
    }, 1500)

    return () => {
      clearInterval(timer)
      clearTimeout(mouseTimer)
    }
  }, [])

  const handleContinue = () => {
    // Redirect to Faith Academy
    window.location.replace('https://faith-academy--fmihsa41.replit.app/')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent -z-10" />

        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <Check size={28} className="text-white stroke-[3]" />
          </motion.div>
        </div>

        <div className="h-8 mb-2 relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`heading-${langIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`text-2xl font-bold text-gray-900 absolute ${translations.heading[langIndex].font || ''}`}
            >
              {translations.heading[langIndex].text}
            </motion.h2>
          </AnimatePresence>
        </div>

        <div className="h-24 mb-8 relative w-full flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${langIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`text-gray-600 absolute px-4 ${translations.description[langIndex].font || ''}`}
            >
              {translations.description[langIndex].text}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group relative"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`button-${langIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={translations.button[langIndex].font || ''}
            >
              {translations.button[langIndex].text}
            </motion.span>
          </AnimatePresence>
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />

          <AnimatePresence>
            {showMouse && (
              <motion.div 
                className="absolute z-50 pointer-events-none"
                initial={{ x: 100, y: 100, opacity: 0 }}
                animate={{ x: 20, y: 20, opacity: 1, scale: [1, 0.8, 1] }}
                transition={{ duration: 1.5, delay: 0.5 }}
                onAnimationComplete={() => {
                  // No auto-continue
                }}
              >
                <MousePointer2 className="h-6 w-6 text-black fill-white drop-shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </motion.div>
  )
}
