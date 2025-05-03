import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // توجيه المستخدم إلى صفحة إعدادات الموقع الرئيسية
  useEffect(() => {
    toast({
      title: "تم نقلك",
      description: "تم توحيد صفحات الإعدادات، وتم نقلك إلى الصفحة الرئيسية للإعدادات"
    });
    
    // توجيه المستخدم إلى صفحة إعدادات الموقع (site-settings)
    navigate('/admin/site-settings');
  }, [navigate, toast]);
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <p>جاري توجيهك إلى صفحة الإعدادات...</p>
    </div>
  );
}