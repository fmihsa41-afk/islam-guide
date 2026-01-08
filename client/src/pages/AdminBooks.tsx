import { useState } from 'react';
import { BookOpen, Plus, Edit3, Trash2, Download, Eye, Upload, Search, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { InsertBook } from '@shared/schema';

type UploadState = {
  isUploading: boolean;
  fileUrl?: string;
  fileName?: string;
};

export default function AdminBooks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [uploadState, setUploadState] = useState<UploadState>({ isUploading: false });

  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: api.getBooks,
  });

  const [viewingBook, setViewingBook] = useState<any>(null);

  const createMutation = useMutation({
    mutationFn: api.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Book added successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: Partial<InsertBook> }) => api.updateBook(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsDialogOpen(false);
      setEditingBook(null);
      resetForm();
      toast({ title: "Book updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({ title: "Book deleted successfully" });
    },
  });

  const resetForm = () => {
    setUploadState({ isUploading: false });
    setEditingBook(null);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState(prev => ({ ...prev, isUploading: true }));
    try {
      const res = await api.uploadFile(file);
      setUploadState({
        isUploading: false,
        fileUrl: res.url,
        fileName: res.fileName
      });
      toast({ title: "File uploaded successfully" });
    } catch (error) {
      setUploadState(prev => ({ ...prev, isUploading: false }));
      toast({ title: "Upload failed", variant: "destructive" });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // If we have an uploaded file URL, use it. Otherwise keep existing (if editing)
    const fileUrl = uploadState.fileUrl || editingBook?.fileUrl;
    const fileName = uploadState.fileName || editingBook?.fileName;

    const data: any = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as string,
      fileUrl,
      fileName,
    };

    if (editingBook) {
      updateMutation.mutate({ id: editingBook.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredBooks = books?.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingBook} onOpenChange={(open) => { if (!open) setViewingBook(null); }}>
        <DialogContent className="max-w-7xl w-[98vw] h-[96vh] p-0 overflow-hidden bg-black flex flex-col border-none ring-0 shadow-none">
          <div className="flex flex-col h-full w-full">
            <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between flex-shrink-0">
              <h3 className="text-zinc-100 font-medium truncate text-sm">{viewingBook?.title}</h3>
              <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white" onClick={() => setViewingBook(null)}>Close</Button>
            </div>
            <div className="flex-1 w-full bg-zinc-900 overflow-hidden">
              {viewingBook?.fileUrl ? (
                <iframe
                  src={`${viewingBook.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-none"
                  title={viewingBook.title}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">
                  <p>Preview not available.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-primary/5 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold font-serif">Islamic Library</h1>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-white/50"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingBook?.title} required />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" name="author" defaultValue={editingBook?.author} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue={editingBook?.category || "General"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quran">Quran</SelectItem>
                        <SelectItem value="Hadith">Hadith</SelectItem>
                        <SelectItem value="Fiqh">Fiqh</SelectItem>
                        <SelectItem value="Aqeedah">Aqeedah</SelectItem>
                        <SelectItem value="Seerah">Seerah</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select name="level" defaultValue={editingBook?.level || "Beginner"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" name="description" defaultValue={editingBook?.description} />
                </div>

                <div>
                  <Label>PDF File</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <Input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploadState.isUploading} />
                    {uploadState.isUploading && <Loader2 className="animate-spin w-4 h-4" />}
                  </div>
                  {(uploadState.fileName || editingBook?.fileName) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {uploadState.fileName || editingBook?.fileName}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending || uploadState.isUploading}>
                  {editingBook ? 'Update Book' : 'Add Book'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks?.map((book) => (
          <Card key={book.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full mb-2 inline-block">
                    {book.category}
                  </span>
                  <CardTitle className="font-serif text-xl line-clamp-1">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">
                {book.description || "No description provided."}
              </p>
              <div className="flex gap-2">
                {book.fileUrl && (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewingBook(book)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                      const link = document.createElement('a');
                      link.href = book.fileUrl!;
                      link.download = book.fileName || 'download.pdf';
                      link.click();
                    }}>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2 border-t bg-muted/20 pt-4">
              <Button variant="ghost" size="sm" onClick={() => {
                setEditingBook(book);
                setIsDialogOpen(true);
              }}>
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {
                if (confirm('Delete this book?')) deleteMutation.mutate(book.id);
              }}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
