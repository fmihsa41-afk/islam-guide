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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {archivedCourses?.map((course) => (
                            <div key={course.id} className="relative group opacity-80 hover:opacity-100 transition-opacity">
                                <div className="relative overflow-hidden rounded-[2rem] bg-card border border-border/50 shadow-sm transition-all duration-300">
                                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                        {course.coverImage && (
                                            <img
                                                src={course.coverImage}
                                                alt={course.title}
                                                className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-bold font-serif leading-tight">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                                        <div className="flex items-center gap-4 pt-2 text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>{course.lessons} Lessons</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg" onClick={() => unarchiveMutation.mutate(course.id)}>
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-lg" onClick={() => {
                                            if (confirm('This will explicitly delete the course. Are you sure?')) deleteMutation.mutate(course.id);
                                        }}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
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
