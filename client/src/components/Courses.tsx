import { motion } from 'framer-motion';
import { BookOpen, Star, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
// @ts-ignore
import cover1 from '@assets/image_1767335873225.png';
// @ts-ignore
import cover2 from '@assets/generated_images/mosque_silhouette_sunset_minimal.png';
// @ts-ignore
import quranCover from '@assets/Quran_1767336376737.jpg';

const courses = [
  {
    title: "Faith Essentials",
    description: "Understanding the 5 Pillars of Islam in depth.",
    image: cover1,
    lessons: 12,
    duration: "4h 30m"
  },
  {
    title: "Prayer Guide",
    description: "Step-by-step guide to performing Salah perfectly.",
    image: cover2,
    lessons: 8,
    duration: "2h 15m"
  },
  {
    title: "Quranic Studies",
    description: "Introduction to reading and understanding the Quran.",
    image: quranCover,
    lessons: 20,
    duration: "10h 00m"
  },
  {
      title: "Life of Prophet Muhammad",
      description: "Learning from the Seerah of the final messenger.",
      image: cover2,
      lessons: 15,
      duration: "6h 45m"
  }
];

export function Courses() {
  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight">Congratulations!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to the family. Your journey of knowledge begins here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + (i * 0.2) }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
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
        
        {/* Shadow out effect at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
      </motion.div>
    </div>
  );
}
