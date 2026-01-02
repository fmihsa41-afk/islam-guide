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
  { role: 'user', 
    en: "I’ve been curious about Islam and what it really teaches.",
    es: "He tenido curiosidad sobre el Islam y lo que realmente enseña.",
    fr: "J'ai été curieux de l'Islam et de ce qu'il enseigne réellement.",
    ru: "Мне было любопытно узнать об Исламе и о том, чему он на самом деле учит.",
    de: "Ich war neugierig auf den Islam und was er wirklich lehrt."
  },
  { role: 'scholar', 
    en: "Islam teaches belief in one God, Allah, living with purpose, and following Allah’s guidance as revealed in the Qur’an and through the Prophet Muhammad.",
    es: "El Islam enseña la creencia en un solo Dios, Allah, vivir con un propósito y seguir la guía de Allah revelada en el Corán y a través del Profeta Muhammad.",
    fr: "L'Islam enseigne la croyance en un seul Dieu, Allah, le fait de vivre avec un but et de suivre la guidance d'Allah telle qu'elle a été révélée dans le Coran et par le Prophète Muhammad.",
    ru: "Ислам учит вере в единого Бога, Аллаха, жизни с целью и следованию руководству Аллаха, ниспосланному в Коране и через Пророка Мухаммада.",
    de: "Der Islam lehrt den Glauben an einen Gott, Allah, ein Leben mit Sinn und das Befolgen der Führung Allahs, wie sie im Koran und durch den Propheten Muhammad offenbart wurde."
  },
  { role: 'user', 
    en: "Is Islam only about rules, or is there more to it?",
    es: "¿El Islam se trata solo de reglas, o hay más?",
    fr: "L'Islam n'est-il fait que de règles, ou y a-t-il plus que cela ?",
    ru: "Ислам — это только правила, или в нем есть что-то большее?",
    de: "Geht es im Islam nur um Regeln oder steckt mehr dahinter?"
  },
  { role: 'scholar', 
    en: "It’s more than rules—it’s about faith, character, mercy, justice, prayer, and a personal relationship with Allah.",
    es: "Es más que reglas: se trata de fe, carácter, misericordia, justicia, oración y una relación personal con Allah.",
    fr: "C'est plus que des règles : c'est une question de foi, de caractère, de miséricorde, de justice, de prière et d'une relation personnelle avec Allah.",
    ru: "Это не только правила — это вера, характер, милосердие, справедливость, молитва и личные отношения с Аллахом.",
    de: "Es ist mehr als nur Regeln – es geht um Glauben, Charakter, Barmherzigkeit, Gerechtigkeit, Gebet und eine persönliche Beziehung zu Allah."
  },
  { role: 'user', 
    en: "Do you believe Islam is for everyone?",
    es: "¿Crees que el Islam es para todos?",
    fr: "Croyez-vous que l'Islam est pour tout le monde ?",
    ru: "Верите ли вы, что Ислам для всех?",
    de: "Glauben Sie, dass der Islam für jeden ist?"
  },
  { role: 'scholar', 
    en: "Yes, Islam teaches that its message is for all people, regardless of background or culture.",
    es: "Sí, el Islam enseña que su mensaje es para todas las personas, independientemente de su origen o cultura.",
    fr: "Oui, l'Islam enseigne que son message s'adresse à tous, quels que soient leur origine ou leur culture.",
    ru: "Да, Ислам учит, что его послание предназначено для всех людей, независимо от происхождения или культуры.",
    de: "Ja, der Islam lehrt, dass seine Botschaft für alle Menschen ist, unabhängig von Hintergrund oder Kultur."
  },
  { role: 'user', 
    en: "What if someone believes in one God, Allah, and accepts Muhammad as His messenger—what does that mean?",
    es: "¿Qué pasa si alguien cree en un solo Dios, Allah, y acepta a Muhammad como Su mensajero? ¿Qué significa eso?",
    fr: "Et si quelqu'un croit en un seul Dieu, Allah, et accepte Muhammad comme Son messager, qu'est-ce que cela signifie ?",
    ru: "Что если кто-то верит в единого Бога, Аллаха, и признает Мухаммада Его посланником — что это значит?",
    de: "Was ist, wenn jemand an einen Gott, Allah, glaubt und Muhammad als Seinen Gesandten akzeptiert – was bedeutet das?"
  },
  { role: 'scholar', 
    en: "That means they accept the core belief of Islam. Entering Islam begins with sincerely declaring that belief.",
    es: "Eso significa que aceptan la creencia central del Islam. Entrar al Islam comienza con declarar sinceramente esa creencia.",
    fr: "Cela signifie qu'ils acceptent la croyance fondamentale de l'Islam. Entrer dans l'Islam commence par la déclaration sincère de cette croyance.",
    ru: "Это означает, что они принимают основное убеждение Ислама. Вхождение в Ислам начинается с искреннего провозглашения этой веры.",
    de: "Das bedeutet, dass sie den Kerngelauben des Islam akzeptieren. Der Eintritt in den Islam beginnt mit der aufrichtigen Erklärung dieses Glaubens."
  },
  { role: 'user', 
    en: "I feel convinced and want to become a Muslim. What should I do?",
    es: "Me siento convencido y quiero ser musulmán. ¿Qué debo hacer?",
    fr: "Je suis convaincu et je veux devenir musulman. Que dois-je faire ?",
    ru: "Я чувствую убежденность и хочу стать мусульманином. Что мне делать?",
    de: "Ich bin überzeugt und möchte Muslim werden. Was soll ich tun?"
  },
  { role: 'scholar', 
    en: "That’s a beautiful decision. If you’d like, we can join a call together so you can say the Shahadah (the declaration of faith) and officially become Muslim.",
    es: "Es una decisión hermosa. Si quieres, podemos unirnos a una llamada juntos para que puedas decir la Shahadah (la declaración de fe) y convertirte oficialmente en musulmán.",
    fr: "C'est une belle décision. Si vous le souhaitez, nous pouvons nous rejoindre en appel pour que vous puissiez prononcer la Shahadah (la déclaration de foi) et devenir officiellement musulman.",
    ru: "Это прекрасное решение. Если хотите, мы можем созвониться, чтобы вы могли произнести Шахаду (свидетельство веры) и официально стать мусульманином.",
    de: "Das ist eine schöne Entscheidung. Wenn du möchtest, können wir gemeinsam telefonieren, damit du die Schahadah (das Glaubensbekenntnis) sprechen und offiziell Muslim werden kannst."
  }
];

export function ScholarChat({ onComplete }: ScholarChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [lang, setLang] = useState('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < chatScript.length) {
      const nextMessage = chatScript[currentIndex];
      const delay = nextMessage.role === 'scholar' ? 2500 : 1500;
      
      if (nextMessage.role === 'scholar') {
        setIsTyping(true);
      }

      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: nextMessage.role, text: (nextMessage as any)[lang] }]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
        const timer = setTimeout(() => {
           onComplete();
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete, lang]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[650px] w-full max-w-2xl mx-auto bg-card rounded-2xl shadow-2xl border overflow-hidden">
      <div className="bg-primary/10 p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={scholarAvatar} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-serif font-bold text-lg">Scholar Ahmed</h3>
            <p className="text-xs text-muted-foreground">Online • Connection Protocol</p>
          </div>
        </div>
        
        {/* Language Selector */}
        <select 
          className="text-xs bg-background border rounded px-1 py-1"
          value={lang}
          onChange={(e) => {
            setLang(e.target.value);
            setMessages([]);
            setCurrentIndex(0);
          }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="ru">Русский</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <ScrollArea className="flex-1 p-6 bg-muted/20">
        <div className="flex flex-col gap-6">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-card border rounded-tl-none font-serif text-lg leading-relaxed'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="bg-card border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
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
        <div className="flex gap-2 opacity-50">
          <Input placeholder="Automatic demonstration active..." disabled className="bg-background" />
          <Button disabled size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
