import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mic, Video, PhoneOff, User, Volume2, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageCycler } from './LanguageCycler';
// @ts-ignore
import scholarAvatar from '@assets/generated_images/warm_friendly_scholar_avatar.png';

interface CallScreenProps {
  onEndCall: () => void;
}

const shahadahSteps = [
  { 
    arabic: "أشهد أن لا إله إلا الله", 
    transliteration: "Ash-hadu an la ilaha illa Allah", 
    translations: [
      { lang: 'English', text: "I bear witness that there is no god but Allah" },
      { lang: 'Spanish', text: "Doy testimonio de que no hay más dios que Alá" },
      { lang: 'French', text: "Je témoigne qu'il n'y a de dieu qu'Allah" },
      { lang: 'Russian', text: "Я свидетельствую, что нет бога, кроме Аллаха" },
      { lang: 'German', text: "Ich bezeuge, dass es keinen Gott außer Allah gibt" },
      { lang: 'Arabic', text: "أشهد أن لا إله إلا الله", font: "font-arabic" }
    ]
  },
  { 
    arabic: "وأشهد أن محمداً رسول الله", 
    transliteration: "wa ash-hadu anna Muhammadan rasulu Allah", 
    translations: [
      { lang: 'English', text: "and I bear witness that Muhammad is the messenger of Allah" },
      { lang: 'Spanish', text: "y doy testimonio de que Muhammad es el mensajero de Alá" },
      { lang: 'French', text: "et je témoigne que Muhammad est le messager d'Allah" },
      { lang: 'Russian', text: "и я свидетельствую, что Мухаммад — посланник Аллаха" },
      { lang: 'German', text: "und ich bezeuge, dass Muhammad der Gesandte Allahs ist" },
      { lang: 'Arabic', text: "وأشهد أن محمداً رسول الله", font: "font-arabic" }
    ]
  }
];

export function CallScreen({ onEndCall }: CallScreenProps) {
  const [step, setStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showShahadah, setShowShahadah] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowShahadah(true), 2000);
    const t2 = setTimeout(() => setStep(1), 12000); 
    const t3 = setTimeout(onEndCall, 24000);
    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
      clearTimeout(t3); 
    };
  }, [onEndCall]);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8 z-10 w-full max-w-2xl px-6"
      >
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -inset-8 bg-primary rounded-full blur-3xl" 
          />
          <Avatar className="h-32 w-32 border-4 border-primary/50 shadow-2xl relative bg-zinc-900">
            <AvatarImage src={scholarAvatar} />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-serif">Scholar Ahmed</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <p className="text-primary font-medium tracking-widest uppercase text-xs">Live Session</p>
          </div>
        </div>

        <div className="w-full min-h-[220px]">
          <AnimatePresence mode="wait">
            {showShahadah && (
              <motion.div 
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-center"
              >
                <div className="space-y-3">
                  <div className="text-4xl font-arabic leading-relaxed text-primary">
                    {shahadahSteps[step].arabic}
                  </div>
                  <div className="text-lg text-white/60 italic font-light tracking-wide">
                    "{shahadahSteps[step].transliteration}"
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <LanguageCycler customTranslations={shahadahSteps[step].translations} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-6 mt-6">
          <Button 
            variant="outline" 
            size="icon" 
            className={`h-16 w-16 rounded-full border-white/10 ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white'}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-16 w-16 rounded-full shadow-2xl shadow-red-500/20"
            onClick={onEndCall}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-16 w-16 rounded-full border-white/10 bg-white/5 text-white"
          >
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}