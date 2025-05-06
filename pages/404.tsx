import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteSettingsProvider } from '@/contexts/site-settings-context';
import MainLayout from '@/components/layout/MainLayout';

export default function NotFoundPage() {
  return (
    <SiteSettingsProvider>
      <MainLayout
        title="الصفحة غير موجودة - 404"
        description="عذراً، الصفحة التي تبحث عنها غير موجودة"
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center">
          <div className="space-y-8 max-w-md">
            <div className="space-y-4">
              <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
              <h2 className="text-3xl font-bold text-primary">الصفحة غير موجودة</h2>
              <p className="text-gray-600 dark:text-gray-400">
                عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تم نقلها أو حذفها.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/">العودة للصفحة الرئيسية</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/scholarships">استكشاف المنح الدراسية</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    </SiteSettingsProvider>
  );
}