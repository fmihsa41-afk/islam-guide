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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {archivedCourses?.map((course) => (
                            <Card key={course.id} className="opacity-75 hover:opacity-100 transition-opacity">
                                <div className="aspect-video relative overflow-hidden bg-muted">
                                    {course.coverImage && (
                                        <img
                                            src={course.coverImage}
                                            alt={course.title}
                                            className="w-full h-full object-cover grayscale"
                                        />
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle>{course.title}</CardTitle>
                                    <CardDescription className="mt-2 line-clamp-2">{course.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-1" />
                                        <span>{course.lessons} Lessons</span>
                                    </div>
                                </CardFooter>
                                <CardFooter className="justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => unarchiveMutation.mutate(course.id)}>
                                        <RefreshCw className="w-4 h-4 mr-2" /> Restore
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => {
                                        if (confirm('This will explicitly delete the course. Are you sure?')) deleteMutation.mutate(course.id);
                                    }}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
