import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Phone, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// @ts-ignore
import scholarAvatar from '@assets/generated_images/warm_friendly_scholar_avatar.png';

interface ScholarChatProps {
  onComplete: () => void;
}

const chatScript = [
  { role: 'user', text: "I’ve been curious about Islam and what it really teaches." },
  { role: 'scholar', text: "Islam teaches belief in one God, Allah, living with purpose, and following Allah’s guidance as revealed in the Qur’an and through the Prophet Muhammad." },
  { role: 'user', text: "Is Islam only about rules, or is there more to it?" },
  { role: 'scholar', text: "It’s more than rules—it’s about faith, character, mercy, justice, prayer, and a personal relationship with Allah." },
  { role: 'user', text: "Do you believe Islam is for everyone?" },
  { role: 'scholar', text: "Yes, Islam teaches that its message is for all people, regardless of background or culture." },
  { role: 'user', text: "What if someone believes in one God, Allah, and accepts Muhammad as His messenger—what does that mean?" },
  { role: 'scholar', text: "That means they accept the core belief of Islam. Entering Islam begins with sincerely declaring that belief." },
  { role: 'user', text: "I feel convinced and want to become a Muslim. What should I do?" },
  { role: 'scholar', text: "That’s a beautiful decision. If you’d like, we can join a call together so you can say the Shahadah (the declaration of faith) and officially become Muslim." }
];

export function ScholarChat({ onComplete }: ScholarChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCallMouse, setShowCallMouse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < chatScript.length) {
      const nextMessage = chatScript[currentIndex];
      const delay = nextMessage.role === 'scholar' ? 2000 : 1500;
      
      if (nextMessage.role === 'scholar') {
        setIsTyping(true);
      }

      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, nextMessage]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Show mouse cursor after chat completes
      const timer = setTimeout(() => {
        setShowCallMouse(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-background rounded-none md:rounded-2xl md:shadow-2xl md:border overflow-hidden">
      <div className="bg-card p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={scholarAvatar} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-serif font-bold text-xl">Scholar Ahmed</h3>
            <p className="text-xs text-primary animate-pulse font-medium">Online • Ready to connect</p>
          </div>
        </div>
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12 border-primary/20 hover:bg-primary/5 text-primary relative"
            onClick={onComplete}
          >
            <Phone className="h-6 w-6" />
          </Button>
          <AnimatePresence>
            {showCallMouse && (
              <motion.div 
                className="absolute z-50 pointer-events-none"
                initial={{ x: 100, y: 100, opacity: 0 }}
                animate={{ x: 10, y: 10, opacity: 1, scale: [1, 0.8, 1] }}
                transition={{ duration: 1.5, times: [0, 0.8, 1] }}
                onAnimationComplete={() => {
                  setTimeout(onComplete, 500);
                }}
              >
                <MousePointer2 className="h-6 w-6 text-black fill-white drop-shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted rounded-tl-none font-serif text-lg leading-relaxed'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
             </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/50 backdrop-blur">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input placeholder="Type a message..." disabled className="bg-background py-6 rounded-xl" />
          <Button disabled size="icon" className="h-12 w-12 rounded-xl">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
