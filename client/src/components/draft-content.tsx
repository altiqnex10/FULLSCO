import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { File, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { Content } from '@/lib/types';

type DraftContentProps = {
  drafts: Content[];
};

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

export function DraftContent({ drafts }: DraftContentProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await apiRequest('DELETE', `/api/content/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المسودة بنجاح',
      });
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: `فشل في حذف المسودة: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">
          المسودات
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <ul className="divide-y divide-neutral-200">
          {drafts.length === 0 ? (
            <li className="py-4 text-center text-neutral-500">
              لا توجد مسودات حتى الآن
            </li>
          ) : (
            drafts.map((draft) => (
              <li key={draft.id} className="py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded bg-yellow-50 flex items-center justify-center text-yellow-600">
                    <File className="h-5 w-5" />
                  </div>
                  <div className="mr-4 flex-1 min-w-0">
                    <Link href={`/content/edit/${draft.id}`}>
                      <p className="text-sm font-medium text-neutral-800 truncate cursor-pointer hover:text-primary">
                        {draft.title}
                      </p>
                    </Link>
                    <p className="text-xs text-neutral-500">تم التعديل: {formatTime(draft.updatedAt)}</p>
                  </div>
                  <div className="flex-shrink-0 flex">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1 text-neutral-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد من حذف هذه المسودة؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المسودة بشكل دائم من سجلات النظام.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteMutation.mutate(draft.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
