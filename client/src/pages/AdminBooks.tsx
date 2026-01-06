// client/src/pages/AdminBooks.tsx - ADMIN DASHBOARD FOR BOOKS
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Edit3, Trash2, Download, Eye, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  level: string;
  fileUrl: string;
  fileName: string;
  size: string;
  rating: number;
  createdAt: string;
};

const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The Noble Quran',
    author: 'Dr. Hilali',
    description: 'Complete English translation',
    category: 'Quran',
    level: 'All Levels',
    fileUrl: '/books/quran.pdf',
    fileName: 'quran-english.pdf',
    size: '12MB',
    rating: 5,
    createdAt: '2026-01-01',
  },
];

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // NEW: preview modal state
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'Quran',
    level: 'All Levels',
  });

  const categories = ['Quran', 'Hadith', 'Seerah', 'Fiqh', 'Aqeedah', 'Tafsir', 'Duas'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const size = (selectedFile.size / 1024 / 1024).toFixed(1) + 'MB';
      console.log('File selected:', selectedFile.name, size);
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !file) return;

    const newBook: Book = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      description: formData.description || 'No description',
      category: formData.category,
      level: formData.level,
      fileUrl: `/books/${file!.name}`,
      fileName: file!.name,
      size: (file!.size / 1024 / 1024).toFixed(1) + 'MB',
      rating: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBooks(prev => [...prev, newBook]);
    setShowAddModal(false);
    setFormData({
      title: '',
      author: '',
      description: '',
      category: 'Quran',
      level: 'All Levels',
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      level: book.level,
    });
    setShowAddModal(true);
  };

  const handleUpdateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !formData.title || !formData.author) return;

    setBooks(prev =>
      prev.map(b =>
        b.id === editingBook.id
          ? {
              ...b,
              ...formData,
            }
          : b,
      ),
    );
    setShowAddModal(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      category: 'Quran',
      level: 'All Levels',
    });
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  // Reliable download helper
  const handleDownload = (book: Book) => {
    // This assumes fileUrl points to a static file under public/books
    fetch(book.fileUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('File not found');
        }
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = book.fileName || 'download.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Download error:', err);
        alert('Could not download this file. Make sure it exists under public/books.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Admin Books
                </h1>
                <p className="text-xl text-muted-foreground">Manage Islamic library</p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowAddModal(true)}
              className="shadow-xl hover:shadow-2xl h-12 px-8 font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Book
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <Card className="mb-8 border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                className="pl-12 h-14 rounded-2xl bg-background/50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 mb-12">
          {filteredBooks.map(book => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="group bg-white/70 backdrop-blur-sm rounded-3xl border border-border/50 hover:border-primary/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-primary/90">
                      {book.category}
                    </Badge>
                    <Badge variant="outline">{book.level}</Badge>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                      onClick={() => handleEditBook(book)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold mt-4 line-clamp-2">
                  {book.title}
                </CardTitle>
                <CardDescription className="text-lg mt-1">{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <p className="text-muted-foreground mb-6 line-clamp-3">{book.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{book.size}</span>
                    <span>{book.fileName}</span>
                  </div>
                  <div className="flex gap-2">
                    {/* PREVIEW BUTTON -> opens centered modal with PDF */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-4"
                      onClick={() => setPreviewBook(book)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    {/* DOWNLOAD BUTTON -> reliable fetch + download */}
                    <Button
                      size="sm"
                      className="h-10 px-4 bg-primary hover:bg-primary/90"
                      onClick={() => handleDownload(book)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-border">
                <h2 className="text-3xl font-bold">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
              </div>

              <form
                onSubmit={editingBook ? handleUpdateBook : handleAddBook}
                className="p-8 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      className="h-14 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      required
                      value={formData.author}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          author: e.target.value,
                        })
                      }
                      className="h-14 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={v =>
                        setFormData({
                          ...formData,
                          category: v,
                        })
                      }
                    >
                      <SelectTrigger className="h-14 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={v =>
                        setFormData({
                          ...formData,
                          level: v,
                        })
                      }
                    >
                      <SelectTrigger className="h-14 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map(lvl => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="min-h-[120px] rounded-2xl resize-vertical"
                    placeholder="Write a brief description of the book..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">
                    Upload PDF File {editingBook ? '(Optional)' : '*'}
                  </Label>
                  <div className="flex items-center gap-4 p-6 border-2 border-dashed border-border rounded-2xl hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {file ? (
                        <div className="space-y-1">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Click to select PDF file (max 50MB)
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-6"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={handleFileUpload}
                      required={!editingBook}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl"
                  >
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* PREVIEW MODAL */}
        <AnimatePresence>
          {previewBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              onClick={() => setPreviewBook(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div>
                    <h3 className="text-lg font-semibold">{previewBook.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {previewBook.author} • {previewBook.fileName}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewBook(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="flex-1 bg-slate-100">
                  <iframe
                    src={previewBook.fileUrl}
                    title={previewBook.title}
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
