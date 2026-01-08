// client/src/pages/CoursePlayer.tsx
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function CoursePlayer() {
  const [, params] = useRoute("/courses/:slug");
  const slug = params?.slug || "";

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => api.getCourseBySlug(slug),
    enabled: !!slug
  });

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('youtube.com/embed/')) return url;

    // Convert watch?v= format to embed/
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Course not found.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(course.youtubeUrl || "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 px-4 py-3 flex items-center gap-3 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-lg font-semibold ml-2 font-serif truncate">{course.title}</h1>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-5xl mx-auto w-full">
        <motion.div
          className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-border/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {embedUrl ? (
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
              <p>No video available for this course.</p>
            </div>
          )}
        </motion.div>

        <div className="w-full mt-8 space-y-4">
          <h2 className="text-2xl font-bold font-serif">{course.title}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-border/10">
            <div className="bg-secondary/50 px-4 py-2 rounded-xl text-sm font-medium">
              {course.lessons} Lessons
            </div>
            <div className="bg-secondary/50 px-4 py-2 rounded-xl text-sm font-medium">
              {course.duration}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
