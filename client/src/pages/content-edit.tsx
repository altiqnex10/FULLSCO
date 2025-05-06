import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { ContentEditor } from '@/components/content-editor';
import { User, Content, Category, Notification } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContentEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const isNew = !id;

  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/user'],
  });

  const { data: content, isLoading: isLoadingContent } = useQuery<Content>({
    queryKey: ['/api/content', id],
    enabled: !!id,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: recentContent = [] } = useQuery<Content[]>({
    queryKey: ['/api/content/recent'],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user || isLoadingCategories || (!isNew && isLoadingContent)) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex md:w-64 flex-shrink-0 flex-col bg-white border-l border-neutral-200 h-full">
          <div className="p-6">
            <Skeleton className="h-6 w-32 mb-8" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow-sm border-b border-neutral-200 h-16"></div>
          <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6">
            <Skeleton className="h-96 w-full" />
          </main>
        </div>
      </div>
    );
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
            <h1 className="text-2xl font-bold text-neutral-800">
              {isNew ? 'إضافة محتوى جديد' : 'تعديل المحتوى'}
            </h1>
            
            <div className="mt-6">
              <ContentEditor 
                content={isNew ? undefined : content} 
                categories={categories} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
