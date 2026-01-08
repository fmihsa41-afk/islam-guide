import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Loader2, BookOpen, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ArchivedResources() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: archivedCourses, isLoading } = useQuery({
        queryKey: ['courses', 'archived'],
        queryFn: () => api.getCourses(true),
    });

    const unarchiveMutation = useMutation({
        mutationFn: (id: number) => api.updateCourse(id, { isArchived: false }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast({ title: "Course unarchived" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: api.deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast({ title: "Course permanently deleted" });
        },
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold font-serif text-center">Archived Resources</h1>

            <section>
                <h2 className="text-xl font-semibold mb-4">Archived Courses</h2>
                {archivedCourses?.length === 0 ? (
                    <p className="text-muted-foreground text-center">No archived courses.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                        {archivedCourses?.map((course) => (
                            <div key={course.id} className="group flex flex-col gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900">
                                    {course.coverImage && (
                                        <img
                                            src={course.coverImage}
                                            alt={course.title}
                                            className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                </div>
                                <div className="flex gap-3 mt-1">
                                    <div className="flex-shrink-0">
                                        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center ring-1 ring-zinc-700">
                                            <BookOpen className="w-5 h-5 text-zinc-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 relative">
                                        <h3 className="text-sm font-bold leading-tight line-clamp-2 mb-1">{course.title}</h3>
                                        <div className="text-[12px] text-muted-foreground">
                                            <span>Archived Course • {course.lessons} lessons</span>
                                        </div>

                                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-black/60 hover:bg-black/80" onClick={() => unarchiveMutation.mutate(course.id)}>
                                                <RefreshCw className="w-3.5 h-3.5 text-white" />
                                            </Button>
                                            <Button size="icon" variant="destructive" className="h-7 w-7 rounded-full" onClick={() => {
                                                if (confirm('Permanently delete?')) deleteMutation.mutate(course.id);
                                            }}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
