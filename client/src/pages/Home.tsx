import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, MousePointer2, MessageSquare, GraduationCap, Phone, Plus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageCycler } from '@/components/LanguageCycler';
import { ScholarChat } from '@/components/ScholarChat';
import { CallScreen } from '@/components/CallScreen';
import { Courses } from '@/components/Courses';
import { ScrollArea } from '@/components/ui/scroll-area';

type View = 'ai' | 'scholar' | 'courses';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('ai');
  const [inputText, setInputText] = useState('');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: any }[]>([]);
  const [showConnect, setShowConnect] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pastChats = [
    "where is god",
    "is islam aganist women",
    "does islam like violence",
    "who created god if he created us"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showConnect]);

  // Autoplay Script
  useEffect(() => {
    if (!isAutoPlaying) return;

    const runScript = async () => {
      // 1. User: who created god
      await new Promise(r => setTimeout(r, 1500));
      setMessages([{ role: 'user', content: "who created god" }]);
      
      // 2. AI: Translation Cycle
      await new Promise(r => setTimeout(r, 1000));
      setMessages(prev => [...prev, { role: 'ai', content: <LanguageCycler 
        customTranslations={[
          { lang: 'English', text: "No one created God.\n\nThe books explain that Allah is eternal, uncreated, and independent, while everything else is created and dependent on Him. Creation itself requires a creator, but the Creator does not require one.\n\nAllah is described as:\n- existing without a beginning,\n- not dependent on time, matter, or cause,\n- and unlike His creation in every way.\n\nAs explained in The Purpose of Creation, asking “Who created God?” is a category mistake — because creation applies only to created things, not to the One who creates.\n\nSimple example (for clarity)\nIf a painter paints a picture, the picture depends on the painter — but it makes no sense to ask: “Who painted the painter?” because the painter exists independently of the painting.\n\nLikewise: The universe depends on Allah. Allah depends on nothing." },
          { lang: 'Spanish', text: "Nadie creó a Dios.\n\nLos libros explican que Alá es eterno, no creado e independiente, mientras que todo lo demás es creado y depende de Él. La creación en sí misma requiere un creador, pero el Creador no requiere uno.\n\nAlá es descrito como:\n- existiendo sin un principio,\n- no depende del tiempo, la materia o la causa,\n- y a diferencia de Su creación en todos los sentidos." },
          { lang: 'French', text: "Personne n'a créé Dieu.\n\nLes livres expliquent qu'Allah est éternel, incréé et indépendant, tandis que tout le reste est créé et dépend de Lui. La création elle-même nécessite un créateur, mais le Créateur n'en nécessite pas.\n\nAllah est décrit como:\n- existant sans commencement,\n- ne dépendant pas du temps, de la matière ou de la cause,\n- et différent de Sa création à tous égards." },
          { lang: 'Russian', text: "Никто не создавал Бога.\n\nВ книгах объясняется, что Аллах вечен, несотворен и независим, в то время как все остальное сотворено и зависит от Него. Само творение требует создателя, но Создатель в нем не нуждается.\n\nАллах описывается как:\n- существующий без начала,\n- не зависящий от времени, материи или причины,\n- и не похожий на Свое творение во всех отношениях." },
          { lang: 'German', text: "Niemand hat Gott erschaffen.\n\nDie Bücher erklären, dass Allah ewig, unerschaffen und unabhängig ist, während alles andere erschaffen und von Ihm abhängig ist. Die Schöpfung selbst erfordert einen Schöpfer, aber der Schöpfer benötigt keinen.\n\nAllah wird beschrieben als:\n- existierend ohne Anfang,\n- nicht abhängig von Zeit, Materie oder Ursache,\n- und Seiner Schöpfung in jeder Hinsicht unähnlich." },
          { lang: 'Arabic', text: "لا أحد خلق الله.\n\nتشرح الكتب أن الله أبدي وغير مخلوق ومستقل، بينما كل شيء آخر مخلوق ومعتمد عليه. الخلق نفسه يتطلب خالقاً، لكن الخالق لا يتطلب خالقاً.\n\nيوصف الله بأنه:\n- موجود بلا بداية،\n- لا يعتمد على الوقت أو المادة أو السبب،\n- ولا يشبه خلقه بأي حال من الأحوال.", font: "font-arabic" }
        ]}
      /> }]);

      // 3. User: How do I become a Muslim?
      await new Promise(r => setTimeout(r, 8000)); // Wait for some translations
      setMessages(prev => [...prev, { role: 'user', content: "How do I become a Muslim?" }]);

      // 4. AI: Connect message
      await new Promise(r => setTimeout(r, 1000));
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: <LanguageCycler 
          customTranslations={[
            { lang: 'English', text: "We will connect you to our scholar." },
            { lang: 'Spanish', text: "Le conectaremos con nuestro erudito." },
            { lang: 'French', text: "Nous allons vous mettre en contact avec notre érudit." },
            { lang: 'Russian', text: "Мы соединим вас с нашим ученым." },
            { lang: 'German', text: "Wir werden Sie mit unserem Gelehrten verbinden." },
            { lang: 'Arabic', text: "سوف نقوم بتوصيلك بعالمنا.", font: "font-arabic" }
          ]} 
        /> 
      }]);

      // 5. Show Connect Button with Animation
      await new Promise(r => setTimeout(r, 1000));
      setShowConnect(true);
    };

    runScript();
    setIsAutoPlaying(false);
  }, [isAutoPlaying]);

  const handleConnectClick = () => {
    setActiveView('scholar');
  };

  const handleScholarComplete = () => {
    setShowCall(true);
  };

  const handleCallEnd = () => {
    setShowCall(false);
    setShowCongrats(true);
    setTimeout(() => {
      setShowCongrats(false);
      setActiveView('courses');
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      {/* Sidebar - only show when activeView is 'ai' */}
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
                  <p className="text-sm font-medium truncate">User Profile</p>
                </div>
            </div>
          </div>
        </aside>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="p-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary md:hidden">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif">all-Islam</span>
          </div>
          
          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
            <Button 
              variant={activeView === 'ai' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-lg"
              onClick={() => setActiveView('ai')}
            >
              <Bot className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">AI</span>
            </Button>
            <Button 
              variant={activeView === 'scholar' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-lg"
              onClick={() => setActiveView('scholar')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Scholar</span>
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

        {/* Main Content Area */}
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
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                  <div className="max-w-3xl mx-auto space-y-8 pb-32">
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-6">
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20"
                          >
                            <Sparkles className="w-8 h-8 text-primary-foreground" />
                          </motion.div>
                          <h1 className="text-4xl font-bold font-serif">Welcome to all-Islam</h1>
                          <p className="text-muted-foreground">The AI is typing...</p>
                      </div>
                    )}
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
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-muted px-4 py-3 rounded-2xl rounded-tr-none' : 'w-full'}`}>
                          {msg.content}
                        </div>
                        {msg.role === 'user' && (
                          <Avatar className="w-8 h-8 border">
                            <AvatarFallback className="bg-muted-foreground/20"><User className="w-4 h-4" /></AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                    
                    {showConnect && (
                      <motion.div 
                        className="max-w-md mx-auto p-4 border rounded-xl bg-card shadow-lg relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                      <AvatarFallback>SC</AvatarFallback>
                                      <AvatarImage src="/assets/generated_images/warm_friendly_scholar_avatar.png" />
                                  </Avatar>
                                  <div>
                                      <div className="font-semibold">Scholar Ahmed</div>
                                      <div className="text-xs text-muted-foreground">Available for Chat</div>
                                  </div>
                              </div>
                              <Button size="sm" onClick={handleConnectClick} className="relative overflow-hidden group">
                                  Connect
                                  <motion.div 
                                      className="absolute z-50 pointer-events-none"
                                      initial={{ x: 100, y: 100, opacity: 0 }}
                                      animate={{ x: 15, y: 15, opacity: 1, scale: [1, 0.8, 1] }}
                                      transition={{ duration: 1.5, delay: 1 }}
                                      onAnimationComplete={() => {
                                        setTimeout(handleConnectClick, 500);
                                      }}
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

            {activeView === 'scholar' && (
              <motion.div 
                key="scholar-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full p-4 md:p-8 overflow-y-auto"
              >
                <ScholarChat onComplete={handleScholarComplete} />
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
          </AnimatePresence>
        </main>

        {/* Input Area */}
        {activeView === 'ai' && (
            <div className="p-4 bg-background/80 backdrop-blur-lg border-t border-border/40">
            <div className="max-w-3xl mx-auto relative">
                <div className="relative">
                <Input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message all-Islam..." 
                    className="pr-12 py-6 rounded-2xl shadow-lg border-muted-foreground/20 text-base"
                />
                <Button 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                    disabled={!inputText.trim()}
                    onClick={() => {
                      setMessages(prev => [...prev, { role: 'user', content: inputText }]);
                      setInputText('');
                    }}
                >
                    <Send className="w-4 h-4" />
                </Button>
                </div>
                <div className="text-center mt-2 text-xs text-muted-foreground">
                all-Islam can make mistakes. Consider checking important information.
                </div>
            </div>
            </div>
        )}
      </div>

      {/* Global Overlays */}
      <AnimatePresence>
        {showCall && (
          <CallScreen onEndCall={handleCallEnd} />
        )}
        
        {showCongrats && (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background flex items-center justify-center text-center"
          >
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <h1 className="text-6xl font-serif font-bold text-primary mb-4">Mubarak!</h1>
                <p className="text-xl text-muted-foreground">Welcome to the Ummah.</p>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
