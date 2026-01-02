import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mic, Video, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// @ts-ignore
import scholarAvatar from '@assets/generated_images/warm_friendly_scholar_avatar.png';

interface CallScreenProps {
  onEndCall: () => void;
}

export function CallScreen({ onEndCall }: CallScreenProps) {
  const [shahadahStep, setShahadahStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setShahadahStep(1), 1000); 
    const timer2 = setTimeout(() => setShahadahStep(2), 4000); 
    const timer3 = setTimeout(() => setShahadahStep(3), 8000); 
    const timerEnd = setTimeout(() => onEndCall(), 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerEnd);
    };
  }, [onEndCall]);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center text-white">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-10 z-10"
      >
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -inset-8 bg-primary rounded-full blur-3xl" 
          />
          <Avatar className="h-40 w-40 border-4 border-primary/50 shadow-2xl relative bg-zinc-900">
            <AvatarImage src={scholarAvatar} />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-serif">Scholar Ahmed</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <p className="text-primary font-medium tracking-widest uppercase text-xs">Voice Call Active</p>
          </div>
        </div>

        <div className="min-h-[120px] px-6 text-center max-w-lg">
            <motion.div 
                key={shahadahStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
            >
                {shahadahStep === 0 && <p className="text-zinc-400">Connecting to secure line...</p>}
                
                {shahadahStep === 1 && (
                  <div className="space-y-2">
                    <p className="text-primary-foreground/60 text-sm">Scholar recites:</p>
                    <p className="text-2xl font-serif italic">"Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulu Allah."</p>
                  </div>
                )}
                
                {shahadahStep === 2 && (
                  <div className="space-y-2">
                    <p className="text-primary-foreground/60 text-sm">User repeats:</p>
                    <p className="text-2xl font-serif italic text-primary">"Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulu Allah."</p>
                  </div>
                )}
                
                {shahadahStep === 3 && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-2">
                    <p className="text-3xl font-bold text-primary">Allahu Akbar!</p>
                    <p className="text-xl">Welcome to the family of Islam.</p>
                  </motion.div>
                )}
            </motion.div>
        </div>

        <div className="flex gap-6 mt-10">
          <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
            <Mic className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
            <Video className="h-6 w-6" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-16 w-16 rounded-full shadow-2xl shadow-red-500/20"
            onClick={onEndCall}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
