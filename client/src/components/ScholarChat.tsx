import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MultiLangText } from './MultiLangText';
// @ts-ignore
import scholarAvatar from '@assets/generated_images/warm_friendly_scholar_avatar.png';

interface ScholarChatProps {
  onComplete: () => void;
}

const chatScript = [
  { 
    role: 'user', 
    translations: [
      { lang: 'English', text: "I’ve been curious about Islam and what it really teaches." },
      { lang: 'Spanish', text: "He tenido curiosidad sobre el Islam y lo que realmente enseña." },
      { lang: 'French', text: "J'ai été curieux de l'Islam et de ce qu'il enseigne réellement." },
      { lang: 'Russian', text: "Мне было любопытно узнать об Исламе и о том, чему он на самом деле учит." },
      { lang: 'German', text: "Ich war neugierig auf den Islam und was er wirklich lehrt." }
    ]
  },
  { 
    role: 'scholar', 
    translations: [
      { lang: 'English', text: "Islam teaches belief in one God, Allah, living with purpose, and following Allah’s guidance as revealed in the Qur’an and through the Prophet Muhammad." },
      { lang: 'Spanish', text: "El Islam enseña la creencia en un solo Dios, Allah, vivir con un propósito y seguir la guía de Allah revelada en el Corán y a través del Profeta Muhammad." },
      { lang: 'French', text: "L'Islam enseigne la croyance en un seul Dieu, Allah, le fait de vivre avec un but et de suivre la guidance d'Allah telle qu'elle a été révélée dans le Coran et par le Prophète Muhammad." },
      { lang: 'Russian', text: "Ислам учит вере в единого Бога, Аллаха, жизни с целью и следованию руководству Аллаха, ниспосланному в Коране и через Пророка Мухаммада." },
      { lang: 'German', text: "Der Islam lehrt den Glauben an einen Gott, Allah, ein Leben mit Sinn und das Befolgen der Führung Allahs, wie sie im Koran und durch den Propheten Muhammad offenbart wurde." }
    ]
  },
  { 
    role: 'user', 
    translations: [
      { lang: 'English', text: "Is Islam only about rules, or is there more to it?" },
      { lang: 'Spanish', text: "¿El Islam se trata solo de reglas, o hay más?" },
      { lang: 'French', text: "L'Islam n'est-il fait que de règles, ou y a-t-il plus que cela ?" },
      { lang: 'Russian', text: "Ислам — это только правила, или в нем есть что-то большее?" },
      { lang: 'German', text: "Geht es im Islam nur um Regeln oder steckt mehr dahinter?" }
    ]
  },
  { 
    role: 'scholar', 
    translations: [
      { lang: 'English', text: "It’s more than rules—it’s about faith, character, mercy, justice, prayer, and a personal relationship with Allah." },
      { lang: 'Spanish', text: "Es más que reglas: se trata de fe, carácter, misericordia, justicia, oración y una relación personal con Allah." },
      { lang: 'French', text: "C'est plus que des règles : c'est une question de foi, de caractère, de miséricorde, de justice, de prière et d'une relation personnelle avec Allah." },
      { lang: 'Russian', text: "Это не только правила — это вера, характер, милосердие, справедливость, молитва и личные отношения с Аллахом." },
      { lang: 'German', text: "Es ist mehr als nur Regeln – es geht um Glauben, Charakter, Barmherzigkeit, Gerechtigkeit, Gebet und eine persönliche Beziehung zu Allah." }
    ]
  },
  { 
    role: 'user', 
    translations: [
      { lang: 'English', text: "Do you believe Islam is for everyone?" },
      { lang: 'Spanish', text: "¿Crees que el Islam es para todos?" },
      { lang: 'French', text: "Croyez-vous que l'Islam est pour tout le monde ?" },
      { lang: 'Russian', text: "Верите ли вы, что Ислам для всех?" },
      { lang: 'German', text: "Glauben Sie, dass der Islam für jeden ist?" }
    ]
  },
  { 
    role: 'scholar', 
    translations: [
      { lang: 'English', text: "Yes, Islam teaches that its message is for all people, regardless of background or culture." },
      { lang: 'Spanish', text: "Sí, el Islam enseña que su mensaje es para todas las personas, independientemente de su origen o cultura." },
      { lang: 'French', text: "Oui, l'Islam enseigne que son message s'adresse à tous, quels que soient leur origine ou leur culture." },
      { lang: 'Russian', text: "Да, Ислам учит, что его послание предназначено для всех людей, независимо от происхождения или культуры." },
      { lang: 'German', text: "Ja, der Islam lehrt, dass seine Botschaft für alle Menschen ist, unabhängig von Hintergrund oder Kultur." }
    ]
  },
  { 
    role: 'user', 
    translations: [
      { lang: 'English', text: "What if someone believes in one God, Allah, and accepts Muhammad as His messenger—what does that mean?" },
      { lang: 'Spanish', text: "¿Qué pasa si alguien cree en un solo Dios, Allah, y acepta a Muhammad como Su mensajero? ¿Qué significa eso?", },
      { lang: 'French', text: "Et si quelqu'un croit en un seul Dieu, Allah, et accepte Muhammad comme Son messager, qu'est-ce que cela signifie ?", },
      { lang: 'Russian', text: "Что если кто-то верит в единого Бога, Аллаха, и признает Мухаммада Его посланником — что это значит?", },
      { lang: 'German', text: "Was ist, wenn jemand an einen Gott, Allah, glaubt und Muhammad als Seinen Gesandten akzeptiert – was bedeutet das?" }
    ]
  },
  { 
    role: 'scholar', 
    translations: [
      { lang: 'English', text: "That means they accept the core belief of Islam. Entering Islam begins with sincerely declaring that belief." },
      { lang: 'Spanish', text: "Eso significa que aceptan la creencia central del Islam. Entrar al Islam comienza con declarar sinceramente esa creencia." },
      { lang: 'French', text: "Cela signifie qu'ils acceptent la croyance fondamentale de l'Islam. Entrer dans l'Islam commence par la déclaration sincère de cette croyance." },
      { lang: 'Russian', text: "Это означает, что они принимают основное убеждение Ислама. Вхождение в Ислам начинается с искреннего провозглашения этой веры." },
      { lang: 'German', text: "Das bedeutet, dass sie den Kerngelauben des Islam akzeptieren. Der Eintritt in den Islam beginnt mit der aufrichtigen Erklärung dieses Glaubens." }
    ]
  },
  { 
    role: 'user', 
    translations: [
      { lang: 'English', text: "I feel convinced and want to become a Muslim. What should I do?" },
      { lang: 'Spanish', text: "Me siento convencido y quiero ser musulmán. ¿Qué debo hacer?" },
      { lang: 'French', text: "Je suis convaincu et je veux devenir musulman. Que dois-je faire ?" },
      { lang: 'Russian', text: "Я чувствую убежденность и хочу стать мусульманином. Что мне делать?" },
      { lang: 'German', text: "Ich bin überzeugt und möchte Muslim werden. Was soll ich tun?" }
    ]
  },
  { 
    role: 'scholar', 
    translations: [
      { lang: 'English', text: "That’s a beautiful decision. If you’d like, we can join a call together so you can say the Shahadah (the declaration of faith) and officially become Muslim." },
      { lang: 'Spanish', text: "Es una decisión hermosa. Si quieres, podemos unirnos a una llamada juntos para que puedas decir la Shahadah (la declaración de fe) y convertirte oficialmente en musulmán." },
      { lang: 'French', text: "C'est une belle décision. Si vous le souhaitez, nous pouvons nous rejoindre en appel pour que vous puissiez prononcer la Shahadah (la déclaration de foi) et devenir officiellement musulman." },
      { lang: 'Russian', text: "Это прекрасное решение. Если хотите, мы можем созвониться, чтобы вы могли произнести Шахаду (свидетельство веры) и официально стать мусульманином." },
      { lang: 'German', text: "Das ist eine schöne Entscheidung. Wenn du möchtest, können wir gemeinsam telefonieren, damit du die Schahadah (das Glaubensbekenntnis) sprechen und offiziell Muslim werden kannst." }
    ]
  }
];

export function ScholarChat({ onComplete }: ScholarChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < chatScript.length) {
      const nextMessage = chatScript[currentIndex];
      const delay = nextMessage.role === 'scholar' ? 7000 : 5000; // Longer delay to allow translation cycle
      
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
        const timer = setTimeout(() => {
           onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete]);

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
            <p className="text-xs text-muted-foreground">Online • Translating in Real-time</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 bg-muted/20">
        <div className="flex flex-col gap-8 pb-10">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-card border rounded-tl-none font-serif text-lg leading-relaxed'
              }`}>
                <MultiLangText translations={msg.translations} />
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
          <Input placeholder="Multilingual chat demo..." disabled className="bg-background" />
          <Button disabled size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
