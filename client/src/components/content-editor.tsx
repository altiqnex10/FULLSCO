import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Content, Category } from '@/lib/types';

import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const contentFormSchema = z.object({
  title: z.string().min(3, { message: 'العنوان يجب أن يكون 3 أحرف على الأقل' }),
  categoryId: z.string().min(1, { message: 'يرجى اختيار تصنيف' }),
  body: z.string().min(10, { message: 'المحتوى يجب أن يكون 10 أحرف على الأقل' }),
  status: z.enum(['draft', 'published', 'scheduled']),
  visibility: z.enum(['public', 'private', 'members']),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

type ContentEditorProps = {
  content?: Content;
  categories: Category[];
};

export function ContentEditor({ content, categories }: ContentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const defaultValues: ContentFormValues = content 
    ? {
        title: content.title,
        categoryId: content.categoryId.toString(),
        body: content.body,
        status: content.status,
        visibility: content.visibility,
      }
    : {
        title: '',
        categoryId: '',
        body: '',
        status: 'draft',
        visibility: 'public',
      };

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContentFormValues) => {
      const response = await apiRequest(
        'POST', 
        '/api/content', 
        {
          ...data,
          categoryId: parseInt(data.categoryId),
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: 'تم إنشاء المحتوى بنجاح',
        description: 'تم إضافة المحتوى الجديد',
      });
      navigate('/content');
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: `فشل في إنشاء المحتوى: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ContentFormValues) => {
      const response = await apiRequest(
        'PATCH', 
        `/api/content/${content?.id}`, 
        {
          ...data,
          categoryId: parseInt(data.categoryId),
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      queryClient.invalidateQueries({ queryKey: ['/api/content', content?.id.toString()] });
      toast({
        title: 'تم تحديث المحتوى بنجاح',
        description: 'تم حفظ التغييرات',
      });
      navigate('/content');
    },
    onError: (error) => {
      toast({
        title: 'خطأ',
        description: `فشل في تحديث المحتوى: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ContentFormValues) => {
    if (content?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSaveAsDraft = () => {
    const currentValues = form.getValues();
    form.setValue('status', 'draft');
    onSubmit({
      ...currentValues,
      status: 'draft',
    });
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">
          {content ? 'تعديل المحتوى' : 'إنشاء محتوى جديد'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-neutral-700">عنوان المحتوى</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل عنوان المحتوى..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-neutral-700">التصنيف</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-neutral-700">المحتوى</FormLabel>
                  <FormControl>
                    <TiptapEditor 
                      content={field.value} 
                      onChange={field.onChange}
                      placeholder="ابدأ بكتابة المحتوى الخاص بك هنا..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex flex-wrap gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium text-neutral-700">الحالة</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="published">منشور</SelectItem>
                        <SelectItem value="scheduled">مجدول</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium text-neutral-700">ظهور المحتوى</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر ظهور المحتوى..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">عام</SelectItem>
                        <SelectItem value="private">خاص</SelectItem>
                        <SelectItem value="members">للأعضاء فقط</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                حفظ كمسودة
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? 'جاري الحفظ...' 
                  : content ? 'تحديث المحتوى' : 'نشر المحتوى'
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
