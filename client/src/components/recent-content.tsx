import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { FileText, Video, FileCode, Pencil } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Content } from '@/lib/types';

type RecentContentProps = {
  content: Content[];
};

function getContentIcon(content: Content) {
  // Simplified logic - in a real app, would be based on content type or category
  const titleLower = content.title.toLowerCase();
  
  if (titleLower.includes('video') || titleLower.includes('فيديو')) {
    return <Video className="h-5 w-5 text-neutral-500" />;
  } else if (
    titleLower.includes('code') || 
    titleLower.includes('api') || 
    titleLower.includes('كود')
  ) {
    return <FileCode className="h-5 w-5 text-neutral-500" />;
  }
  
  return <FileText className="h-5 w-5 text-neutral-500" />;
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `منذ ${diffDay} ${diffDay === 1 ? 'يوم' : 'أيام'}`;
  }
  if (diffHour > 0) {
    return `منذ ${diffHour} ${diffHour === 1 ? 'ساعة' : 'ساعات'}`;
  }
  if (diffMin > 0) {
    return `منذ ${diffMin} ${diffMin === 1 ? 'دقيقة' : 'دقائق'}`;
  }
  return 'الآن';
}

export function RecentContent({ content }: RecentContentProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await apiRequest('GET', `/api/content/${contentId}`);
      return response.json();
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: `تعذر تحميل المحتوى: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="text-lg font-medium text-neutral-800">
          المحتوى الحديث
        </CardTitle>
        <Link href="/content" className="text-sm font-medium text-primary hover:text-primary-dark">
          عرض الكل
        </Link>
      </CardHeader>
      
      <CardContent className="p-4">
        <ul className="divide-y divide-neutral-200">
          {content.length === 0 ? (
            <li className="py-4 text-center text-neutral-500">
              لا يوجد محتوى حتى الآن
            </li>
          ) : (
            content.map((item) => (
              <li key={item.id} className="py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded bg-neutral-100 flex items-center justify-center">
                    {getContentIcon(item)}
                  </div>
                  <div className="mr-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">{item.title}</p>
                    <p className="text-xs text-neutral-500">تم التحديث: {formatTime(item.updatedAt)}</p>
                  </div>
                  <div className="flex-shrink-0 flex">
                    <Link href={`/content/edit/${item.id}`}>
                      <button 
                        className="p-1 text-neutral-400 hover:text-neutral-500"
                        onClick={() => editMutation.mutate(item.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
