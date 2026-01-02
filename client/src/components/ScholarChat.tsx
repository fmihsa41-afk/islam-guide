import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Phone } from 'lucide-react';
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
  const [messages, setMessages] = useState<typeof chatScript>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < chatScript.length) {
      const nextMessage = chatScript[currentIndex];
      
      const delay = nextMessage.role === 'scholar' ? 1500 : 1000;
      
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
        // Chat finished, wait a bit then show call button or trigger completion
        const timer = setTimeout(() => {
           onComplete();
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-card rounded-xl shadow-2xl border overflow-hidden">
      <div className="bg-primary/10 p-4 border-b flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-primary">
          <AvatarImage src={scholarAvatar} />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-serif font-bold text-lg">Scholar Ahmed</h3>
          <p className="text-xs text-muted-foreground">Online • Ready to help</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted rounded-tl-none font-serif'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex justify-start"
           >
             <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
               <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
               <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
           </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/50 backdrop-blur">
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Type a message..." disabled className="bg-background" />
          <Button disabled size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
