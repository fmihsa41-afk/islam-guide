import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, MousePointer2, MessageSquare, GraduationCap, Phone, Plus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageCycler } from '@/components/LanguageCycler';
import { CallScreen } from '@/components/CallScreen';
import { Courses } from '@/components/Courses';
import { CongratulationsModal } from '@/components/CongratulationsModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageSelector } from '@/components/LanguageSelector';

type Role = 'user' | 'ai' | 'scholar';

interface Message {
  role: Role;
  content: any;
  id: string;
}

type View = 'ai' | 'courses' | 'lang-select';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('ai');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showConnect, setShowConnect] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isScholarActive, setIsScholarActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCallTrigger, setShowCallTrigger] = useState(false);
  const [step, setStep] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pastChats = [
    "why is there evil?",
    "is islam aganist women?",
    "islam support violence?",
    "who created god?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showConnect, isTyping]);

  const addMessage = (role: Role, content: any) => {
    setMessages(prev => {
      const newMessage = { role, content, id: Math.random().toString(36).substr(2, 9) };
      return [newMessage];
    });
  };

  const handleInteraction = async () => {
    if (step === 0) {
      // Step 0: Type the first user message into the input bar
      const firstMessage = "who created god";
      for (let i = 0; i <= firstMessage.length; i++) {
        setInputText(firstMessage.slice(0, i));
        await new Promise(r => setTimeout(r, 50));
      }
      await new Promise(r => setTimeout(r, 500));
      addMessage('user', firstMessage);
      setInputText('');
      setStep(1);
    } else if (step === 1) {
      addMessage('ai', <LanguageCycler 
        customTranslations={[
          { lang: 'English', text: "No one created God.\n\nThe books explain that Allah is eternal, uncreated, and independent, while everything else is created and dependent on Him. Creation itself requires a creator, but the Creator does not require one.\n\nAllah is described as:\n- existing without a beginning,\n- not dependent on time, matter, or cause,\n- and unlike His creation in every way.\n\nAs explained in The Purpose of Creation, asking “Who created God?” is a category mistake — because creation applies only to created things, not to the One who creates.\n\nSimple example (for clarity)\nIf a painter paints a picture, the picture depends on the painter — but it makes no sense to ask: “Who painted the painter?” because the painter exists independently of the painting.\n\nLikewise: The universe depends on Allah. Allah depends on nothing." },
          { lang: 'Spanish', text: "Nadie creó a Dios.\n\nLos libros explican que Alá es eterno, no creado e independiente, mientras que todo lo demás es creado y depende de Él. La creación en sí misma requiere un creador, pero el Creador no requiere uno.\n\nAlá es descrito como:\n- existiendo sin un principio,\n- no depende del tiempo, la materia o la causa,\n- y a diferencia de Su creación en todos los sentidos." },
          { lang: 'French', text: "Personne n'a créé Dieu.\n\nLes livres expliquent qu'Allah est éternel, incréé et indépendant, tandis que tout le reste est créé et dépend de Lui. La création elle-même nécessite un créateur, mais le Créateur n'en nécessite pas.\n\nAllah est décrit como:\n- existant sans commencement,\n- ne dépendant pas du temps, de la matière ou de la cause,\n- et différent de Sa création à tous égards." },
          { lang: 'Russian', text: "Никто не создавал Бога.\n\nВ книгах объясняется, что Аллах вечен, несотворен и независим, в то время как все остальное сотворено и зависит от Него. Само творение требует создателя, но Создатель в нем не нуждается.\n\nАллах описывается как:\n- существующий без начала,\n- не зависящий от времени, материи или причины,\n- и не похожий на Свое творение во всех отношениях." },
          { lang: 'German', text: "Niemand hat Gott erschaffen.\n\nDie Bücher erklären, dass Allah ewig, unerschaffen und unabhängig ist, während alles andere erschaffen und von Ihm abhängig ist. Die Schöpfung selbst erfordert einen Schöpfer, aber der Schöpfer benötigt keinen.\n\nAllah wird beschrieben als:\n- existierend ohne Anfang,\n- nicht abhängig von Zeit, Materie oder Ursache,\n- und Seiner Schöpfung in jeder Hinsicht unähnlich." },
          { lang: 'Arabic', text: "لا أحد خلق الله.\n\nتشرح الكتب أن الله أبدي وغير مخلوق ومستقل، بينما كل شيء آخر مخلوق ومعتمد عليه. الخلق نفسه يتطلب خالقاً، لكن الخالق لا يتطلب خالقاً.\n\nيوصف الله بأنه:\n- موجود بلا بداية،\n- لا يعتمد على الوقت أو المادة أو السبب،\n- ولا يشبه خلقه بأي حال من الأحوال.", font: "font-arabic" }
        ]}
      />);
      setStep(2);
    } else if (step === 2) {
      addMessage('user', "How do I become a Muslim?");
      setStep(3);
    } else if (step === 3) {
      addMessage('ai', <LanguageCycler 
        customTranslations={[
          { lang: 'English', text: "We will connect you to our scholar." },
          { lang: 'Spanish', text: "Le conectaremos con nuestro erudito." },
          { lang: 'French', text: "Nous allons vous mettre en contact avec notre érudit." },
          { lang: 'Russian', text: "Мы соединим вас с нашим ученым." },
          { lang: 'German', text: "Wir werden Sie mit unserem Gelehrten verbinden." },
          { lang: 'Arabic', text: " سنقوم بتوصيلك بالشيخ.", font: "font-arabic" }
        ]} 
      />);
      setStep(4);
    } else if (step === 4) {
      setShowConnect(true);
      setStep(5);
    } else if (step === 5) {
      setShowConnect(false);
      setIsScholarActive(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('scholar', "I am Scholar Ahmed with you. Peace be upon you! I've seen your interest in Islam and I'm here to help you on this beautiful journey.");
      }, 500);
      setStep(6);
    } else if (step === 6) {
      addMessage('user', "I have talked to the AI chat and I am convinced with Islam. How do I become a Muslim?");
      setStep(7);
    } else if (step === 7) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('scholar', "Allah Akbar! That is a truly great decision. The best way to start is by declaring the Shahadah. If you'd like, let's start a call to recite it together.");
        setShowCallTrigger(true);
      }, 500);
      setStep(8);
    } else if (step === 8) {
      if (showCallTrigger) {
        setShowCall(true);
        setStep(9);
      }
    }
  };

  const handleConnectClick = () => {
    handleInteraction();
  };

  const handleCallEnd = () => {
    setShowCall(false);
    setActiveView(null as any); 
    setShowCongrats(true);
  };

  const handleCongratsContinue = () => {
    setShowCongrats(false);
    setActiveView('lang-select');
  };

  const handleLanguageSelect = (lang: string) => {
    setActiveView('courses');
  };

  return (
    <div 
      className="flex h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden"
      onClick={handleInteraction}
    >
      {activeView === 'ai' && (
        <aside className="w-64 bg-secondary/30 border-r border-border/40 flex flex-col hidden md:flex">
          <div className="p-4">
            <Button variant="outline" className="w-full justify-start gap-2 border-border/60 hover:bg-secondary/50 rounded-lg py-5">
              <Plus className="w-4 h-4" />
              <span className="font-medium">New chat</span>
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              <div className="px-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your chats</h3>
                <div className="space-y-1">
                  {pastChats.map((chat, i) => (
                    <button 
                      key={i} 
                      className="w-full text-left px-3 py-2 rounded-lg text-sm truncate hover:bg-secondary/50 transition-colors flex items-center gap-3 group"
                    >
                      <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                      <span className="truncate">{chat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">John Madison</p>
                </div>
            </div>
          </div>
        </aside>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="p-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary md:hidden">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif">all-Islam</span>
          </div>
          
          <nav className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
            <Button 
              variant={activeView === 'ai' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-lg"
              onClick={() => setActiveView('ai')}
            >
              <Bot className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">AI & Scholar</span>
            </Button>
            <Button 
              variant={activeView === 'courses' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-lg"
              onClick={() => setActiveView('courses')}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Courses</span>
            </Button>
          </nav>

          <div className="text-sm text-muted-foreground hidden md:block opacity-50">v1.0</div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeView === 'ai' && (
              <motion.div 
                key="ai-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col items-center justify-center">
                  <div className="max-w-3xl w-full space-y-8 pb-32">
                    {messages.length === 0 && !isTyping && (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20"
                          >
                            <Sparkles className="w-8 h-8 text-primary-foreground" />
                          </motion.div>
                          <h1 className="text-4xl font-bold font-serif">Welcome to all-Islam</h1>
                          <p className="text-muted-foreground">Made in KSA to People</p>
                      </div>
                    )}
                    
                    <AnimatePresence initial={false}>
                      {messages.map((msg, idx) => {
                        const isLast = idx === messages.length - 1;
                        return (
                          <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              scale: isLast ? 1 : 0.98,
                            }}
                            exit={{ opacity: 0, y: -50, scale: 0.9 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.role !== 'user' && (
                              <Avatar className={`w-8 h-8 border ${msg.role === 'scholar' ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                                {msg.role === 'scholar' ? (
                                  <>
                                    <AvatarImage src="/attached_assets/warm_friendly_scholar_avatar.png" />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">SA</AvatarFallback>
                                  </>
                                ) : (
                                  <AvatarFallback className="bg-primary text-primary-foreground"><Sparkles className="w-4 h-4" /></AvatarFallback>
                                )}
                              </Avatar>
                            )}
                            <div className={`max-w-[85%] ${
                              msg.role === 'user' 
                                ? 'bg-muted px-4 py-3 rounded-2xl rounded-tr-none' 
                                : 'w-full'
                            }`}>
                              {msg.content}
                            </div>
                            {msg.role === 'user' && (
                              <Avatar className="w-8 h-8 border">
                                <AvatarFallback className="bg-muted-foreground/20"><User className="w-4 h-4" /></AvatarFallback>
                              </Avatar>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                        <Avatar className="w-8 h-8 border border-primary ring-2 ring-primary/20">
                          <AvatarImage src="/attached_assets/warm_friendly_scholar_avatar.png" />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">SA</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </motion.div>
                    )}
                    
                    {showConnect && (
                      <motion.div 
                        className="max-w-md mx-auto p-4 border rounded-xl bg-card shadow-lg relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border-2 border-primary">
                                      <AvatarFallback>SA</AvatarFallback>
                                      <AvatarImage src="/attached_assets/warm_friendly_scholar_avatar.png" />
                                  </Avatar>
                                  <div>
                                      <div className="font-semibold">Scholar Ahmed</div>
                                      <div className="text-xs text-muted-foreground">Ready to speak with you</div>
                                  </div>
                              </div>
                              <Button size="sm" onClick={(e) => {
                                e.stopPropagation();
                                handleConnectClick();
                              }} className="relative overflow-hidden group">
                                  Connect
                                  <motion.div 
                                      className="absolute z-50 pointer-events-none"
                                      initial={{ x: 100, y: 100, opacity: 0 }}
                                      animate={{ x: 15, y: 15, opacity: 1, scale: [1, 0.8, 1] }}
                                      transition={{ duration: 1.5, delay: 1 }}
                                  >
                                      <MousePointer2 className="h-5 w-5 text-black fill-white drop-shadow-md" />
                                  </motion.div>
                              </Button>
                          </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'courses' && (
              <motion.div 
                key="courses-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <Courses />
              </motion.div>
            )}

            {activeView === 'lang-select' && (
              <LanguageSelector onSelect={handleLanguageSelect} />
            )}
          </AnimatePresence>
        </main>

        {activeView === 'ai' && (
          <div className="p-4 bg-background/80 backdrop-blur-lg border-t border-border/40 relative">
            <div className="max-w-3xl mx-auto relative flex gap-2 w-full">
              <div className="relative flex-1">
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isScholarActive ? "Message Scholar Ahmed..." : "Message all-Islam..."} 
                  className="pr-12 py-6 rounded-2xl shadow-lg border-muted-foreground/20 text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputText.trim()) {
                      addMessage('user', inputText);
                      setInputText('');
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                  disabled={!inputText.trim()}
                  onClick={(e) => {
                    e.stopPropagation();
                    addMessage('user', inputText);
                    setInputText('');
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {showCallTrigger && (
                <div className="relative">
                  <Button 
                    variant="default" 
                    size="icon"
                    className="h-[52px] w-[52px] rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCall(true);
                    }}
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                  <motion.div 
                    className="absolute z-50 pointer-events-none"
                    initial={{ x: 50, y: 50, opacity: 0 }}
                    animate={{ x: 10, y: 10, opacity: 1, scale: [1, 0.8, 1] }}
                    transition={{ duration: 1.5, delay: 1 }}
                  >
                    <MousePointer2 className="h-6 w-6 text-black fill-white drop-shadow-md" />
                  </motion.div>
                </div>
              )}
            </div>
            {messages.length > 0 && (
              <div className="text-center mt-2 text-xs text-muted-foreground max-w-3xl mx-auto">
                all-Islam connects you with wisdom. Everything you need in one place.
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCall && (
          <CallScreen onEndCall={handleCallEnd} />
        )}
        
        {showCongrats && (
          <CongratulationsModal 
            onContinue={handleCongratsContinue} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
