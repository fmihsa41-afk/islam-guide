import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TypingEffect } from '@/components/TypingEffect';
import { LanguageCycler } from '@/components/LanguageCycler';
import { ScholarChat } from '@/components/ScholarChat';
import { CallScreen } from '@/components/CallScreen';
import { Courses } from '@/components/Courses';

type Phase = 'landing' | 'chatting' | 'connecting' | 'scholar' | 'call' | 'congrats' | 'courses';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: any }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, phase]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (phase === 'landing') {
      if (inputText.toLowerCase().includes('what is islam')) {
        setPhase('chatting');
        setMessages([
          { role: 'user', content: inputText },
          { role: 'ai', content: <LanguageCycler /> }
        ]);
        setInputText('');
      } else {
         // Default fallback for prototype
         setPhase('chatting');
         setMessages([
            { role: 'user', content: inputText },
            { role: 'ai', content: "I can tell you about Islam. Try asking 'What is Islam?'" }
         ]);
         setInputText('');
      }
    } else if (phase === 'chatting') {
       if (inputText.toLowerCase().includes('become a muslim')) {
        setMessages(prev => [
            ...prev,
            { role: 'user', content: inputText },
            { role: 'ai', content: "We will connect you to our scholar." }
          ]);
          setInputText('');
          
          // Trigger the connect animation
          setTimeout(() => {
            setPhase('connecting');
          }, 1000);
       } else {
         setMessages(prev => [
            ...prev,
            { role: 'user', content: inputText },
            { role: 'ai', content: "That's a deep question. Would you like to speak to a scholar?" }
          ]);
          setInputText('');
       }
    }
  };

  const handleScholarComplete = () => {
    setPhase('call');
  };

  const handleCallEnd = () => {
    setPhase('congrats');
    setTimeout(() => {
        setPhase('courses');
    }, 3000);
  };

  if (phase === 'courses') {
    return <Courses />;
  }

  if (phase === 'congrats') {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <h1 className="text-6xl font-serif font-bold text-primary mb-4">Mubarak!</h1>
                <p className="text-xl text-muted-foreground">Congratulations on becoming a Muslim.</p>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-500">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-serif">all-Islam</span>
        </div>
        <div className="text-sm text-muted-foreground">v1.0</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {phase === 'landing' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">How can I help you understand Islam?</h1>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {['What is Islam?', 'Who is Prophet Muhammad?', 'What are the 5 pillars?', 'How to pray?'].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => { setInputText(q); }}
                  className="p-4 text-left border rounded-xl hover:bg-muted/50 transition-colors text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
             <div className="max-w-3xl mx-auto space-y-8 pb-32">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'ai' && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Sparkles className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'bg-muted px-4 py-3 rounded-2xl rounded-tr-none' : ''}`}>
                      <div className="prose dark:prose-invert">
                        {msg.content}
                      </div>
                      
                      {/* Special handling for the "Connecting" phase inside the chat */}
                      {phase === 'connecting' && idx === messages.length - 1 && (
                        <motion.div 
                          className="mt-4 p-4 border rounded-xl bg-card shadow-sm relative overflow-hidden"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>SC</AvatarFallback>
                                        <AvatarImage src="/assets/generated_images/warm_friendly_scholar_avatar.png" />
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">Connect with Scholar</div>
                                        <div className="text-xs text-muted-foreground">Available now</div>
                                    </div>
                                </div>
                                <Button size="sm" className="relative overflow-hidden group">
                                    Connect
                                    {/* Mouse Animation */}
                                    <motion.div 
                                        className="absolute z-50 pointer-events-none"
                                        initial={{ x: 100, y: 100, opacity: 0 }}
                                        animate={{ x: 20, y: 20, opacity: 1, scale: [1, 0.8, 1] }}
                                        transition={{ duration: 1.5, times: [0, 0.8, 1] }}
                                        onAnimationComplete={() => setPhase('scholar')}
                                    >
                                        <MousePointer2 className="h-6 w-6 text-black fill-white drop-shadow-md" />
                                    </motion.div>
                                </Button>
                            </div>
                        </motion.div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                         <Avatar className="w-8 h-8 border">
                             <AvatarFallback className="bg-muted-foreground/20"><User className="w-4 h-4" /></AvatarFallback>
                         </Avatar>
                    )}
                  </motion.div>
                ))}
                
                <div ref={messagesEndRef} />
             </div>
          </div>
        )}

        {/* Input Area */}
        {phase !== 'connecting' && phase !== 'scholar' && phase !== 'call' && (
            <div className="p-4 bg-background/80 backdrop-blur-lg fixed bottom-0 left-0 right-0 z-10">
            <div className="max-w-3xl mx-auto relative">
                <form onSubmit={handleInputSubmit} className="relative">
                <Input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message all-Islam..." 
                    className="pr-12 py-6 rounded-2xl shadow-lg border-muted-foreground/20 text-base"
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                    disabled={!inputText.trim()}
                >
                    <Send className="w-4 h-4" />
                </Button>
                </form>
                <div className="text-center mt-2 text-xs text-muted-foreground">
                all-Islam can make mistakes. Consider checking important information.
                </div>
            </div>
            </div>
        )}
      </main>

      {/* Modals/Overlays */}
      <AnimatePresence>
        {phase === 'scholar' && (
            <motion.div 
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <ScholarChat onComplete={handleScholarComplete} />
            </motion.div>
        )}
        
        {phase === 'call' && (
            <CallScreen onEndCall={handleCallEnd} />
        )}
      </AnimatePresence>
    </div>
  );
}
