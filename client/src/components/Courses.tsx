import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, PlayCircle, Plus, Edit, Trash2, Archive, Loader2, ArrowRight, GraduationCap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { InsertCourse } from '@shared/schema';

export function Courses() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.getCourses(false),
  });

  const createMutation = useMutation({
    mutationFn: api.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
      toast({ title: "Course created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: Partial<InsertCourse> }) => api.updateCourse(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
      setEditingCourse(null);
      toast({ title: "Course updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Course deleted successfully" });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: number) => api.updateCourse(id, { isArchived: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Course archived" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      slug: (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-'),
      coverImage: formData.get('coverImage') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
      duration: formData.get('duration') as string,
      lessons: parseInt(formData.get('lessons') as string) || 0,
    };

    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif">Islamic Courses</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingCourse(null);
        }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingCourse?.title} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingCourse?.description} required />
              </div>
              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input id="coverImage" name="coverImage" defaultValue={editingCourse?.coverImage} />
              </div>
              <div>
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input id="youtubeUrl" name="youtubeUrl" defaultValue={editingCourse?.youtubeUrl} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" defaultValue={editingCourse?.duration} />
                </div>
                <div>
                  <Label htmlFor="lessons">Lessons</Label>
                  <Input id="lessons" name="lessons" type="number" defaultValue={editingCourse?.lessons} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
        {courses?.map((course) => (
          <div
            key={course.id}
            className="group flex flex-col gap-3 cursor-pointer"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              if (course.slug) {
                navigate(`/courses/${course.slug}`);
              } else {
                toast({ title: "Course link invalid", variant: "destructive" });
              }
            }}
          >
            {/* Thumbnail aspect-video */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#0F0F0F] hover:rounded-none transition-all duration-300 shadow-md">
              {course.coverImage ? (
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <PlayCircle className="w-12 h-12 text-zinc-700" />
                </div>
              )}

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-sm p-4 rounded-full scale-90 group-hover:scale-100 transition-transform">
                  <PlayCircle className="w-8 h-8 text-white fill-white/10" />
                </div>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="flex gap-3 mt-1">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-6 relative">
                <h3 className="text-sm font-bold leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <div className="flex flex-col text-[12px] text-muted-foreground font-medium">
                  <div className="flex items-center gap-1">
                    <span>Islamic Guidance</span>
                    <span>•</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 opacity-80">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Inline Action Buttons (YouTube behavior) */}
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1 items-center">
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-secondary" onClick={(e) => {
                      e.stopPropagation();
                      setEditingCourse(course);
                      setIsDialogOpen(true);
                    }}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10" onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this course?')) deleteMutation.mutate(course.id);
                    }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
