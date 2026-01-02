import { motion } from 'framer-motion';
import { BookOpen, Star, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageCycler } from './LanguageCycler';

// @ts-ignore
import cover1 from '@assets/image_1767335873225.png';
// @ts-ignore
import cover2 from '@assets/generated_images/mosque_silhouette_sunset_minimal.png';
// @ts-ignore
import quranCover from '@assets/Quran_1767336376737.jpg';
// @ts-ignore
import prophetCover from '@assets/prohpet_1767336455374.jpg';
// @ts-ignore
import prayerCover from '@assets/prayer_1767336536787.jpg';
// @ts-ignore
import tawheedCover from '@assets/tawheed_1767336638053.jpg';

const coursesData = [
  {
    title: "Faith Essentials",
    titleTranslations: [
      { lang: 'English', text: "Faith Essentials" },
      { lang: 'Spanish', text: "Esenciales de la Fe" },
      { lang: 'French', text: "Essentiels de la Foi" },
      { lang: 'Russian', text: "Основы Веры" },
      { lang: 'German', text: "Grundlagen des Glaubens" },
      { lang: 'Arabic', text: "أساسيات الإيمان", font: "font-arabic" }
    ],
    description: "Understanding the 5 Pillars of Islam in depth.",
    image: tawheedCover,
    lessons: 12,
    duration: "4h 30m"
  },
  {
    title: "Prayer Guide",
    titleTranslations: [
      { lang: 'English', text: "Prayer Guide" },
      { lang: 'Spanish', text: "Guía de Oración" },
      { lang: 'French', text: "Guide de Prière" },
      { lang: 'Russian', text: "Руководство по Молитве" },
      { lang: 'German', text: "Gebetsleitfaden" },
      { lang: 'Arabic', text: "دليل الصلاة", font: "font-arabic" }
    ],
    description: "Step-by-step guide to performing Salah perfectly.",
    image: prayerCover,
    lessons: 8,
    duration: "2h 15m"
  },
  {
    title: "Quranic Studies",
    titleTranslations: [
      { lang: 'English', text: "Quranic Studies" },
      { lang: 'Spanish', text: "Estudios Coránicos" },
      { lang: 'French', text: "Études Coraniques" },
      { lang: 'Russian', text: "Изучение Корана" },
      { lang: 'German', text: "Koranstudien" },
      { lang: 'Arabic', text: "الدراسات القرآنية", font: "font-arabic" }
    ],
    description: "Introduction to reading and understanding the Quran.",
    image: quranCover,
    lessons: 20,
    duration: "10h 00m"
  },
  {
    title: "Life of Prophet Muhammad",
    titleTranslations: [
      { lang: 'English', text: "Life of Prophet Muhammad" },
      { lang: 'Spanish', text: "Vida del Profeta Muhammad" },
      { lang: 'French', text: "Vie du Prophète Muhammad" },
      { lang: 'Russian', text: "Жизнь Пророка Мухаммада" },
      { lang: 'German', text: "Leben des Propheten Muhammad" },
      { lang: 'Arabic', text: "سيرة النبي محمد", font: "font-arabic" }
    ],
    description: "Learning from the Seerah of the final messenger.",
    image: prophetCover,
    lessons: 15,
    duration: "6h 45m"
  }
];

export function Courses() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-16 space-y-12"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="inline-block p-4 rounded-full bg-primary/10 mb-4"
          >
            <Star className="h-12 w-12 text-primary fill-primary" />
          </motion.div>
          <div className="max-w-2xl mx-auto h-12">
            <LanguageCycler 
              customTranslations={[
                { lang: 'English', text: "Where you begin!" },
                { lang: 'Spanish', text: "¡Donde comienzas!" },
                { lang: 'French', text: "Où vous commencez !" },
                { lang: 'Russian', text: "Где вы начинаете!" },
                { lang: 'German', text: "Wo du beginnst!" },
                { lang: 'Arabic', text: "من هنا تبدأ!", font: "font-arabic" }
              ]}
            />
          </div>
          <div className="max-w-3xl mx-auto mt-8 min-h-[80px]">
            <LanguageCycler 
              customTranslations={[
                { lang: 'English', text: "Ibn Sirin said, “This knowledge is a religion, so consider from whom you receive your religion.”" },
                { lang: 'Spanish', text: "Ibn Sirin dijo: “Este conocimiento es una religión, así que considera de quién recibes tu religión”." },
                { lang: 'French', text: "Ibn Sirin a dit : « Cette connaissance est une religion, alors considérez de qui vous recevez votre religion »." },
                { lang: 'Russian', text: "Ибн Сирин сказал: «Эти знания — религия, поэтому смотрите, от кого вы принимаете свою религию»." },
                { lang: 'German', text: "Ibn Sirin sagte: „Dieses Wissen ist eine Religion, also achte darauf, von wem du deine Religion annimmst.“" },
                { lang: 'Arabic', text: "قال ابن سيرين: «إن هذا العلم دين، فانظروا عمن تأخذون دينكم».", font: "font-arabic" }
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden bg-black">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="min-h-[120px]">
                  <div className="h-8">
                    <LanguageCycler customTranslations={course.titleTranslations} />
                  </div>
                  <CardDescription className="mt-4">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
