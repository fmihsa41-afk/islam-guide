import { motion } from 'framer-motion';
import { BookOpen, Star, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from "wouter";

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
    slug: "faith-essentials",
    description: "Understanding the 5 Pillars of Islam in depth.",
    image: tawheedCover,
    lessons: 12,
    duration: "4h 30m"
  },
  {
    title: "Prayer Guide",
    slug: "prayer-guide",
    description: "Step-by-step guide to performing Salah perfectly.",
    image: prayerCover,
    lessons: 8,
    duration: "2h 15m"
  },
  {
    title: "Quranic Studies",
    slug: "quranic-studies",
    description: "Introduction to reading and understanding the Quran.",
    image: quranCover,
    lessons: 20,
    duration: "10h 00m"
  },
  {
    title: "Life of Prophet Muhammad",
    slug: "life-of-prophet-muhammad",
    description: "Learning from the Seerah of the final messenger.",
    image: prophetCover,
    lessons: 15,
    duration: "6h 45m"
  }
];

export function Courses() {
  const [, navigate] = useLocation();

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

          <h1 className="text-4xl font-bold font-serif">Where you begin!</h1>

          <p className="max-w-2xl mx-auto text-muted-foreground italic">
            Ibn Sirin said, “This knowledge is a religion, so consider from whom you receive your religion.”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course, i) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
            >
              <Card
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group h-full flex flex-col cursor-pointer"
                onClick={() => navigate(`/courses/${course.slug}`)}
              >
                <div className="relative h-48 overflow-hidden bg-black">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-serif">{course.title}</CardTitle>
                  <CardDescription className="mt-2">{course.description}</CardDescription>
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
