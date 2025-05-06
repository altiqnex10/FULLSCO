import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { SiteSettingsProvider } from '../contexts/site-settings-context';
import { Button } from '../components/ui/button';
import Link from 'next/link';

// الصفحة الرئيسية
export default function HomePage() {
  return (
    <SiteSettingsProvider>
      <MainLayout
        title="الرئيسية"
        description="منصة فلسكو للمنح الدراسية - اكتشف آلاف المنح الدراسية المتاحة للطلاب العرب"
      >
        {/* قسم الهيرو */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ابحث عن المنح الدراسية المناسبة لك
              </h1>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                اكتشف الاف المنح الدراسية حول العالم، وقدم على المنحة المناسبة لك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="font-medium text-lg">
                  <Link href="/scholarships">استكشف المنح الدراسية</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-medium text-lg">
                  <Link href="/about">تعرف علينا أكثر</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* قسم الإحصائيات */}
        <section className="py-12 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">1000+</p>
                <p className="text-gray-600 dark:text-gray-400">منحة دراسية</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</p>
                <p className="text-gray-600 dark:text-gray-400">دولة</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</p>
                <p className="text-gray-600 dark:text-gray-400">تخصص دراسي</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">200+</p>
                <p className="text-gray-600 dark:text-gray-400">قصة نجاح</p>
              </div>
            </div>
          </div>
        </section>

        {/* قسم المنح المميزة */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">منح دراسية مميزة</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                أبرز المنح الدراسية المتاحة حالياً في مختلف الدول والتخصصات
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* بطاقة منحة 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg line-clamp-2 mb-1">منحة جامعة هارفارد للطلاب الدوليين</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">ممولة بالكامل</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium">الدولة:</span>
                      <span className="ms-2">الولايات المتحدة</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">المستوى:</span>
                      <span className="ms-2">بكالوريوس، ماجستير، دكتوراه</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">آخر موعد للتقديم:</span>
                      <span className="ms-2">15 ديسمبر 2025</span>
                    </div>
                  </div>
                  <Link href="/scholarships/1">
                    <Button variant="outline" className="w-full">التفاصيل</Button>
                  </Link>
                </div>
              </div>
              
              {/* بطاقة منحة 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="p-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg line-clamp-2 mb-1">منحة جامعة أكسفورد للدراسات العليا</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">ممولة جزئياً</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium">الدولة:</span>
                      <span className="ms-2">المملكة المتحدة</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">المستوى:</span>
                      <span className="ms-2">ماجستير، دكتوراه</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">آخر موعد للتقديم:</span>
                      <span className="ms-2">20 يناير 2026</span>
                    </div>
                  </div>
                  <Link href="/scholarships/2">
                    <Button variant="outline" className="w-full">التفاصيل</Button>
                  </Link>
                </div>
              </div>
              
              {/* بطاقة منحة 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="p-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg line-clamp-2 mb-1">منحة جامعة طوكيو للعلوم والتكنولوجيا</h3>
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-300">ممولة بالكامل</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium">الدولة:</span>
                      <span className="ms-2">اليابان</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">المستوى:</span>
                      <span className="ms-2">بكالوريوس، ماجستير</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">آخر موعد للتقديم:</span>
                      <span className="ms-2">5 مارس 2026</span>
                    </div>
                  </div>
                  <Link href="/scholarships/3">
                    <Button variant="outline" className="w-full">التفاصيل</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button asChild variant="default">
                <Link href="/scholarships">عرض جميع المنح الدراسية</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* قسم الدول والتخصصات */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* الدول */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">تصفح حسب الدولة</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    اكتشف المنح الدراسية المتاحة في مختلف البلدان حول العالم
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['الولايات المتحدة', 'المملكة المتحدة', 'كندا', 'أستراليا', 'ألمانيا', 'فرنسا'].map((country, index) => (
                    <Link 
                      key={index} 
                      href={`/countries/${index + 1}`}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-shadow"
                    >
                      <span className="block font-medium">{country}</span>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button asChild variant="link">
                    <Link href="/countries">عرض جميع الدول</Link>
                  </Button>
                </div>
              </div>
              
              {/* التخصصات */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">تصفح حسب التخصص</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    اختر من بين مجموعة واسعة من التخصصات الدراسية المتاحة
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['هندسة', 'طب', 'علوم حاسوب', 'إدارة أعمال', 'علوم', 'آداب'].map((category, index) => (
                    <Link 
                      key={index} 
                      href={`/categories/${index + 1}`}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-shadow"
                    >
                      <span className="block font-medium">{category}</span>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button asChild variant="link">
                    <Link href="/categories">عرض جميع التخصصات</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* قسم النشرة البريدية */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">النشرة البريدية</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                اشترك في النشرة البريدية ليصلك أحدث المنح الدراسية والفرص التعليمية
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  required
                  className="flex-1 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Button type="submit" size="lg">اشتراك</Button>
              </form>
            </div>
          </div>
        </section>
      </MainLayout>
    </SiteSettingsProvider>
  );
}