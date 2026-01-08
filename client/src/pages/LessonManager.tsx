// client/src/pages/LessonManager.tsx
import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Play, Edit, Trash2, Loader2 } from 'lucide-react';
import type { InsertLesson } from '@shared/schema';

export default function LessonManager() {
    const [, params] = useRoute('/courses/:slug');
    const [, navigate] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const slug = params?.slug || '';

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<any>(null);
    const [playingLesson, setPlayingLesson] = useState<any>(null);

    const { data: course, isLoading: courseLoading } = useQuery({
        queryKey: ['course', slug],
        queryFn: () => api.getCourseBySlug(slug),
        enabled: !!slug,
    });

    const { data: lessons, isLoading: lessonsLoading } = useQuery({
        queryKey: ['lessons', course?.id],
        queryFn: () => api.getLessonsByCourse(course!.id),
        enabled: !!course?.id,
    });

    const createMutation = useMutation({
        mutationFn: (data: Omit<InsertLesson, 'courseId'>) => api.createLesson(course!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons', course?.id] });
            setIsDialogOpen(false);
            toast({ title: 'Lesson added successfully' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: number; data: Partial<InsertLesson> }) =>
            api.updateLesson(data.id, data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons', course?.id] });
            setIsDialogOpen(false);
            setEditingLesson(null);
            toast({ title: 'Lesson updated successfully' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: api.deleteLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons', course?.id] });
            toast({ title: 'Lesson deleted successfully' });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title') as string,
            youtubeUrl: formData.get('youtubeUrl') as string,
            order: lessons?.length || 0,
        };

        if (editingLesson) {
            updateMutation.mutate({ id: editingLesson.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('youtube.com/embed/')) return url;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return url;
    };

    if (courseLoading || lessonsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Course not found.</p>
                    <Button onClick={() => navigate('/')}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/40 px-4 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold font-serif">{course.title}</h1>
                            <p className="text-sm text-muted-foreground">{lessons?.length || 0} lessons</p>
                        </div>
                    </div>

                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) setEditingLesson(null);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Lesson
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Lesson Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        defaultValue={editingLesson?.title}
                                        placeholder="e.g., Introduction to Prayer"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                                    <Input
                                        id="youtubeUrl"
                                        name="youtubeUrl"
                                        defaultValue={editingLesson?.youtubeUrl}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {editingLesson ? 'Update Lesson' : 'Add Lesson'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Lessons List */}
                    <div className="lg:col-span-1 space-y-3">
                        <h2 className="text-lg font-semibold mb-4">Lessons</h2>
                        {lessons && lessons.length > 0 ? (
                            lessons.map((lesson, index) => (
                                <div
                                    key={lesson.id}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer ${playingLesson?.id === lesson.id
                                            ? 'bg-primary/10 border-primary'
                                            : 'bg-card border-border/50 hover:border-primary/50'
                                        }`}
                                    onClick={() => setPlayingLesson(lesson)}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                                                <Play className="w-3 h-3 text-primary" />
                                            </div>
                                            <h3 className="font-semibold text-sm leading-tight line-clamp-2">{lesson.title}</h3>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingLesson(lesson);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Delete this lesson?')) deleteMutation.mutate(lesson.id);
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="mb-4">No lessons yet</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Lesson
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Video Player */}
                    <div className="lg:col-span-2">
                        {playingLesson ? (
                            <div className="space-y-4">
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                                    <iframe
                                        className="w-full h-full"
                                        src={getEmbedUrl(playingLesson.youtubeUrl)}
                                        title={playingLesson.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold font-serif mb-2">{playingLesson.title}</h2>
                                    <p className="text-muted-foreground">Part of {course.title}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video bg-muted/30 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                                <Play className="w-16 h-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Select a lesson to start learning</h3>
                                <p className="text-sm text-muted-foreground">
                                    {lessons && lessons.length > 0
                                        ? 'Click on any lesson from the list'
                                        : 'Add your first lesson to get started'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
