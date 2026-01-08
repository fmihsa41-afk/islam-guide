import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, PlayCircle, Plus, Edit, Trash2, Archive, Loader2, ArrowRight } from 'lucide-react';
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            onClick={(e) => {
              // Prevent navigation if clicking action buttons
              if ((e.target as HTMLElement).closest('button')) return;
              navigate(`/courses/${course.slug}`);
            }}
          >
            <div className="aspect-video relative overflow-hidden bg-muted">
              {course.coverImage ? (
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <PlayCircle className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="font-serif">{course.title}</CardTitle>
              <CardDescription className="mt-2 line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{course.lessons} Lessons</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.duration}</span>
              </div>
            </CardFooter>
            {/* Admin Controls */}
            <div className="px-6 pb-4 flex justify-end gap-2">
              <Button size="icon" variant="ghost" onClick={() => {
                setEditingCourse(course);
                setIsDialogOpen(true);
              }}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => archiveMutation.mutate(course.id)}>
                <Archive className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                if (confirm('Are you sure?')) deleteMutation.mutate(course.id);
              }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
