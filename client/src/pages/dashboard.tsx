import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { DashboardStats } from '@/components/dashboard-stats';
import { ContentEditor } from '@/components/content-editor';
import { RecentContent } from '@/components/recent-content';
import { DraftContent } from '@/components/draft-content';
import { StatsWidget } from '@/components/stats-widget';
import { Stats, Content, User, Category, Notification } from '@/lib/types';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/auth/user'],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: recentContent, isLoading: isLoadingRecentContent } = useQuery<Content[]>({
    queryKey: ['/api/content/recent'],
  });

  const { data: drafts, isLoading: isLoadingDrafts } = useQuery<Content[]>({
    queryKey: ['/api/content/drafts'],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoadingUser || isLoadingStats || isLoadingCategories || isLoadingRecentContent || isLoadingDrafts) {
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
            <div className="mb-6">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user || !stats || !categories || !recentContent || !drafts) {
    return <div>Failed to load data</div>;
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
          <DashboardStats stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContentEditor categories={categories} />
            </div>
            
            <div className="space-y-6">
              <RecentContent content={recentContent} />
              <DraftContent drafts={drafts} />
              <StatsWidget stats={stats} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
