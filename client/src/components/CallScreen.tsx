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
    // Simulate the Shahadah recitation process
    const timer1 = setTimeout(() => setShahadahStep(1), 1000); // Scholar speaks
    const timer2 = setTimeout(() => setShahadahStep(2), 4000); // User repeats
    const timer3 = setTimeout(() => setShahadahStep(3), 8000); // Finished
    const timerEnd = setTimeout(() => onEndCall(), 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerEnd);
    };
  }, [onEndCall]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl z-10 relative">
            <AvatarImage src={scholarAvatar} />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-serif">Scholar Ahmed</h2>
          <p className="text-white/60">00:15</p>
        </div>

        <div className="h-24 flex items-center justify-center">
            <motion.p 
                key={shahadahStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl text-center max-w-md font-serif italic text-primary-foreground/90"
            >
                {shahadahStep === 0 && "Connecting..."}
                {shahadahStep === 1 && "\"Ash-hadu an la ilaha illa Allah...\""}
                {shahadahStep === 2 && "(Repeating) \"Ash-hadu an la ilaha illa Allah...\""}
                {shahadahStep === 3 && "Mashallah! Welcome brother/sister."}
            </motion.p>
        </div>

        <div className="flex gap-6 mt-8">
          <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full bg-zinc-800 hover:bg-zinc-700 border-none">
            <Mic className="h-6 w-6" />
          </Button>
          <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full bg-zinc-800 hover:bg-zinc-700 border-none">
            <Video className="h-6 w-6" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-14 w-14 rounded-full"
            onClick={onEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
