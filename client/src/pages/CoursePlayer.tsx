// client/src/pages/CoursePlayer.tsx
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const courseVideos: Record<string, { title: string; youtubeUrl: string }> = {
  "faith-essentials": {
    title: "Faith Essentials",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_1",
  },
  "prayer-guide": {
    title: "Prayer Guide",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_2",
  },
  "quranic-studies": {
    title: "Quranic Studies",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_3",
  },
  "life-of-prophet-muhammad": {
    title: "Life of Prophet Muhammad",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_4",
  },
};

export default function CoursePlayer() {
  const [, params] = useRoute("/courses/:slug");
  const slug = params?.slug || "";
  const course = courseVideos[slug];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-lg font-semibold ml-2">{course.title}</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <iframe
            className="w-full h-full"
            src={course.youtubeUrl}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </main>
    </div>
  );
}
