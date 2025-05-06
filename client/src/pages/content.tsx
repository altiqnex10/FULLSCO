import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { User, Content, Category, Notification } from '@/lib/types';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ContentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/user'],
  });

  const { data: allContent = [] } = useQuery<Content[]>({
    queryKey: ['/api/content'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: recentContent = [] } = useQuery<Content[]>({
    queryKey: ['/api/content/recent'],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  const filteredContent = allContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || content.categoryId.toString() === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">منشور</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300">مسودة</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">مجدول</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <Sidebar 
          user={user} 
          recentContent={recentContent.slice(0, 3).map(c => ({ id: c.id, title: c.title }))} 
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          onToggleSidebar={toggleSidebar} 
          notifications={notifications}
        />
        
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-neutral-800">إدارة المحتوى</h1>
              <Link href="/content/new">
                <Button>
                  <Plus className="h-4 w-4 ml-1" />
                  محتوى جديد
                </Button>
              </Link>
            </div>
            
            <Card className="mt-6">
              <CardHeader className="px-6 py-4 border-b border-neutral-200">
                <CardTitle className="text-lg font-medium text-neutral-800">
                  جميع المحتويات
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse mb-6">
                  <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Search className="h-4 w-4 text-neutral-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="بحث في المحتوى..."
                      className="pr-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="scheduled">مجدول</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التصنيفات</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">العنوان</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>آخر تحديث</TableHead>
                        <TableHead className="text-left">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContent.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-neutral-500">
                            لا يوجد محتوى مطابق للبحث
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContent.map((content) => (
                          <TableRow key={content.id}>
                            <TableCell className="font-medium">{content.title}</TableCell>
                            <TableCell>
                              {categories.find(c => c.id === content.categoryId)?.name || '-'}
                            </TableCell>
                            <TableCell>{getStatusBadge(content.status)}</TableCell>
                            <TableCell>{formatDate(content.updatedAt)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Link href={`/content/edit/${content.id}`}>
                                  <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </Link>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>هل أنت متأكد من حذف هذا المحتوى؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المحتوى بشكل دائم من سجلات النظام.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                        حذف
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
