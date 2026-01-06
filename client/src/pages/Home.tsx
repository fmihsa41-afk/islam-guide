import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, GraduationCap, Phone, Plus, MessageCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CallScreen } from '@/components/CallScreen';
import { Courses } from '@/components/Courses';
import { CongratulationsModal } from '@/components/CongratulationsModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageSelector } from '@/components/LanguageSelector';
import AdminBooks from '@/pages/AdminBooks';

type Role = 'user' | 'ai' | 'scholar';
interface Message {
  role: Role;
  content: any;
  id: string;
  certifiable?: boolean;
}

type View = 'ai' | 'courses' | 'books' | 'lang-select';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('ai');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showConnect, setShowConnect] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isScholarActive, setIsScholarActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // scholar typing
  const [aiTyping, setAiTyping] = useState(false);
  const [showCallTrigger, setShowCallTrigger] = useState(false);
  const [step, setStep] = useState(0);
  const [demoRunning, setDemoRunning] = useState(true);
  const [isConnected, setIsConnected] = useState(false); // scholar connection state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pastChats = [
    'why is there evil?',
    'is islam aganist women?',
    'islam support violence?',
    'who created god?',
  ];

  // always John Madison in the sidebar
  const [activeUser] = useState({
    name: 'John Madison',
    avatar: '',
    role: 'JD',
  });

  const [scholarEditMode, setScholarEditMode] = useState(false);
  const [scholarEditedText, setScholarEditedText] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [isEditedAndCertified, setIsEditedAndCertified] = useState(false);

  useEffect(() => {
    if (step >= 9 || !demoRunning) return;
    const delays = [1000, 2000, 2500, 1000, 1500, 2000, 2500, 1000, 1000];
    const timer = setTimeout(() => {
      handleInteraction();
    }, delays[step] || 1500);
    return () => clearTimeout(timer);
  }, [step, demoRunning]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showConnect, isTyping, aiTyping]);

  const addMessage = (role: Role, content: any, meta?: { certifiable?: boolean }) => {
    setMessages(prev => {
      const newMessage: Message = {
        role,
        content,
        id: Math.random().toString(36).substr(2, 9),
        certifiable: meta?.certifiable,
      };
      return [...prev, newMessage];
    });
  };

  const showAiThinking = (callback: () => void) => {
    setAiTyping(true);
    setTimeout(() => {
      setAiTyping(false);
      callback();
    }, 2500);
  };

  // scholar thinking (5–7s, using 6000ms)
  const showScholarThinking = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 6000);
  };

  const typeMessage = async (text: string, callback?: () => void) => {
    for (let i = 0; i <= text.length; i++) {
      setInputText(text.slice(0, i));
      await new Promise(r => setTimeout(r, 40));
    }
    await new Promise(r => setTimeout(r, 300));
    addMessage('user', text);
    setInputText('');
    if (callback) callback();
  };

  const scholarResponse = `No one created God.

The books explain that Allah is eternal, uncreated, and independent, while everything else is created and dependent on Him. Creation itself requires a creator, but the Creator does not require one.

Allah is described as:
- existing without a beginning,
- not dependent on time, matter, or cause,
- and unlike His creation in every way.

As explained in The Purpose of Creation, asking "Who created God?" is a category mistake — because creation applies only to created things, not to the One who creates.

Simple example (for clarity)
If a painter paints a picture, the picture depends on the painter — but it makes no sense to ask: "Who painted the painter?" because the painter exists independently of the painting.

Likewise: The universe depends on Allah. Allah depends on nothing.`;

  const handleInteraction = async () => {
    try {
      if (step === 0) {
        await typeMessage('who created god?', () => {
          setStep(1);
          setDemoRunning(true);
        });
      } else if (step === 1) {
        showAiThinking(() => {
          setScholarEditMode(false);

          addMessage(
            'ai',
            <div className="space-y-4">
              <p className="text-muted-foreground italic text-sm border-l-2 border-primary/20 pl-3">
                Peace be upon you! I will assist you with answers until our scholar joins the conversation.
                Please note that my current responses are not yet certified.
              </p>
              <div className="relative rounded-xl transition-all p-3 leading-relaxed text-sm whitespace-pre-line">
                {scholarResponse}
              </div>
            </div>,
            { certifiable: true }
          );

          setStep(2);
        });
      } else if (step === 2) {
        await typeMessage('How do I become a Muslim?', () => setStep(3));
      } else if (step === 3) {
        showAiThinking(() => {
          addMessage(
            'ai',
            <div className="space-y-1">
              <p>We will connect you with our scholar.</p>
            </div>
          );
          setStep(4);
        });
      } else if (step === 4) {
        setShowConnect(true);
        setIsConnected(false);
        setStep(5);
      } else if (step === 5) {
        setShowConnect(true);
        setIsScholarActive(true);
        setIsConnected(true); // show as connected as soon as he starts thinking

        showScholarThinking(() => {
          addMessage(
            'scholar',
            "I am Scholar Ahmed with you. Peace be upon you! I've seen your interest in Islam and I'm here to help you on this beautiful journey."
          );
          setIsCertified(true);
          setStep(6);
        });
      } else if (step === 6) {
        const nextUserMessage =
          'I have talked to the AI chat and I am convinced with Islam. How do I become a Muslim?';
        if (
          !messages.some(
            m => typeof m.content === 'string' && m.content.includes('convinced with Islam')
          )
        ) {
          await typeMessage(nextUserMessage, () => setStep(7));
        } else {
          setStep(7);
        }
      } else if (step === 7) {
        // scholar thinking before this second scholar message as well
        showScholarThinking(() => {
          addMessage(
            'scholar',
            "Allah Akbar! That is a truly great decision. The best way to start is by declaring the Shahadah. If you'd like, let's start a call to recite it together."
          );
          setShowCallTrigger(true);
          setStep(8);
        });
      } else if (step === 8) {
        setDemoRunning(false);
        setStep(9);
      }
    } catch (error) {
      console.log('Demo step error:', error);
    }
  };

  const handleCallEnd = () => {
    setShowCall(false);
    setShowCongrats(true);
  };

  const handleCongratsContinue = () => {
    setShowCongrats(false);
    setActiveView('lang-select' as View);
  };

  const handleLanguageSelect = (lang: string) => {
    setActiveView('courses');
  };

  const sendUserMessage = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (!demoRunning && inputText.trim()) {
      addMessage('user', inputText);
      setInputText('');
      showAiThinking(() => {
        addMessage('ai', 'This is an AI response to your message.');
      });
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      {activeView === 'ai' && (
        <aside className="w-64 bg-secondary/30 border-r border-border/40 flex flex-col hidden md:flex">
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-border/60 hover:bg-secondary/50 rounded-lg py-5"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New chat</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              <div className="px-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Your chats
                </h3>
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
                {activeUser.avatar ? (
                  <AvatarImage src={activeUser.avatar} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {activeUser.role}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{activeUser.name}</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="p-4 flex items-center justify-between border-b border-border/40 bg-background/80 sticky top-0 z-40">
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
            <Button
              variant={activeView === 'books' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-lg"
              onClick={() => setActiveView('books')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Books</span>
            </Button>
          </nav>
          <div className="text-sm text-muted-foreground hidden md:block opacity-50">
            v1.0 {demoRunning && `(Demo: Step ${step}/9)`}
          </div>
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
                {/* MAIN SCROLLABLE CHAT AREA */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
                  {/* pb-18: more gap above chat bar (12 + 6) */}
                  <div className="max-w-xl w-full space-y-6 pb-18">
                    {/* Landing state */}
                    {messages.length === 0 && !isTyping && !aiTyping && step === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20"
                        >
                          <Sparkles className="w-8 h-8 text-primary-foreground" />
                        </motion.div>
                        <h1 className="text-3xl font-bold font-serif">Welcome to all-Islam</h1>
                        <p className="text-sm text-muted-foreground">Made in KSA to people</p>
                      </div>
                    )}

                    {/* Messages list */}
                    <AnimatePresence initial={false} mode="popLayout">
                      {messages.map(msg => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className={`flex gap-3 ${
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {msg.role !== 'user' && (
                            msg.role === 'scholar' ? (
                              // SCHOLAR: always filled green in chat
                              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border border-emerald-600 ring-2 ring-emerald-400/40">
                                <Avatar className="h-5 w-5 border-0 bg-transparent">
                                  <AvatarImage src="/attached_assets/warm_friendly_scholar_avatar.png" />
                                  <AvatarFallback className="text-[9px] font-bold text-white bg-transparent">
                                    SA
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            ) : (
                              // AI avatar unchanged
                              <Avatar className="w-7 h-7 border">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </AvatarFallback>
                              </Avatar>
                            )
                          )}

                          <div className="max-w-[85%] text-sm">
                            <div
                              className={
                                msg.role === 'user'
                                  ? 'bg-muted px-3 py-2 rounded-2xl rounded-tr-none'
                                  : 'bg-primary/5 border border-primary/10 px-3 py-2 rounded-2xl rounded-tl-none'
                              }
                            >
                              {msg.content}
                            </div>

                            {msg.role === 'ai' && msg.certifiable && (
                              <p
                                className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${
                                  isCertified ? 'text-emerald-500' : 'text-red-500'
                                }`}
                              >
                                {isCertified
                                  ? isEditedAndCertified
                                    ? 'Changed answer, now certified'
                                    : 'Certified'
                                  : 'Waiting for scholar to certify the answer'}
                              </p>
                            )}
                          </div>

                          {msg.role === 'user' && (
                            <Avatar className="w-7 h-7 border">
                              <AvatarFallback className="bg-muted-foreground/20">
                                <User className="w-3.5 h-3.5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing indicators */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start gap-3"
                      >
                        {/* SCHOLAR AVATAR FILLED GREEN WHILE TYPING */}
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border border-emerald-600 ring-2 ring-emerald-400/40">
                          <Avatar className="h-5 w-5 border-0 bg-transparent">
                            <AvatarImage src="/attached_assets/warm_friendly_scholar_avatar.png" />
                            <AvatarFallback className="text-[9px] font-bold text-white bg-transparent">
                              SA
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 px-3 py-2 rounded-2xl rounded-tl-none flex items-center gap-1 max-w-[85%]">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </motion.div>
                    )}

                    {aiTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start gap-3"
                      >
                        <Avatar className="w-7 h-7 border">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Sparkles className="w-3.5 h-3.5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-primary/10 border border-primary/20 px-3 py-2 rounded-2xl rounded-tl-none flex items-center gap-1 max-w-[85%]">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </motion.div>
                    )}

                    {/* Scholar connect: dots while connecting, SA when connected */}
                    {showConnect && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <motion.div
                            animate={
                              isConnected
                                ? {
                                    // connected: icon is about 3/5 of connecting size, pulsing
                                    scale: [0.6, 0.5, 0.6],
                                  }
                                : {
                                    // connecting: full size
                                    scale: 1,
                                  }
                            }
                            transition={
                              isConnected
                                ? {
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: 'easeInOut',
                                  }
                                : { duration: 0.2 }
                            }
                            className="relative flex items-center justify-center h-12 w-12"
                          >
                            {/* OUTER RING ONLY WHEN CONNECTED */}
                            {isConnected && (
                              <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
                            )}

                            {/* INNER CIRCLE */}
                            <div
                              className={`relative rounded-full flex items-center justify-center h-10 w-10 ${
                                isConnected ? 'bg-emerald-500' : 'bg-transparent'
                              }`}
                            >
                              {isConnected ? (
                                // CONNECTED: SA avatar
                                <Avatar className="h-8 w-8 border-0 bg-transparent">
                                  <AvatarImage src="/attached_assets/warm_friendly_scholar_avatar.png" />
                                  <AvatarFallback className="text-[10px] font-bold text-white bg-transparent">
                                    SA
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                // CONNECTING: floating grey dots (thinking)
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>

                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          {isConnected ? (
                            <>
                              <span className="font-semibold">Scholar Ahmed</span>
                              <span className="text-emerald-600">connected</span>
                            </>
                          ) : (
                            <span className="text-amber-600">connecting you with a scholar</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Centered landing input only when absolutely no chat yet */}
                    {messages.length === 0 && !isScholarActive && step === 0 && !aiTyping && (
                      <motion.div
                        layoutId="chat-bar"
                        className="mt-8 w-full z-50"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <div className="relative max-w-2xl mx-auto">
                          <Input
                            value={inputText}
                            readOnly
                            placeholder="Message all-Islam..."
                            className="pr-12 py-6 rounded-2xl shadow-lg border-muted-foreground/20 text-base h-14 bg-background"
                          />
                          <Button
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                            disabled
                          >
                            <Send className="w-4 h-4" />
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

            {activeView === 'books' && (
              <motion.div
                key="books-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <AdminBooks />
              </motion.div>
            )}

            {activeView === 'lang-select' && (
              <LanguageSelector onSelect={handleLanguageSelect} />
            )}
          </AnimatePresence>
        </main>

        {activeView === 'ai' && messages.length > 0 && (
          <motion.div
            layoutId="chat-bar"
            className="p-4 bg-background/80 border-t border-border/40 relative"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="max-w-3xl mx-auto relative flex gap-2 w-full">
              <div className="relative flex-1">
                <Input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={
                    isScholarActive ? 'Message Scholar Ahmed...' : 'Message all-Islam...'
                  }
                  className="pr-12 py-6 rounded-2xl shadow-lg border-muted-foreground/20 text-base"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && inputText.trim() && !demoRunning) {
                      sendUserMessage(e);
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                  disabled={!inputText.trim() || demoRunning}
                  onClick={sendUserMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {showCallTrigger && (
                <Button
                  variant="default"
                  size="icon"
                  className="h-[52px] w-[52px] rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 shrink-0"
                  onClick={() => setShowCall(true)}
                >
                  <Phone className="h-6 w-6" />
                </Button>
              )}
            </div>
            {messages.length > 0 && (
              <div className="text-center mt-2 text-xs text-muted-foreground max-w-3xl mx-auto">
                all-Islam connects you with wisdom. Everything you need in one place.{` `}
                {demoRunning && '(Demo running)'}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showCall && <CallScreen onEndCall={handleCallEnd} />}
        {showCongrats && <CongratulationsModal onContinue={handleCongratsContinue} />}
      </AnimatePresence>
    </div>
  );
}
