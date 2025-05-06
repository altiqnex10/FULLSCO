import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import { useSiteSettings } from '../contexts/site-settings-context';
import { ArrowRight, Search, GraduationCap, Globe, BookOpen, Award, ArrowDown } from 'lucide-react';

export default function HomePage() {
  const { siteSettings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState('');
  
  // مقاطع تمرير للأقسام
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <MainLayout
      title="الرئيسية"
      description="استكشف أفضل المنح الدراسية والفرص التعليمية حول العالم"
    >
      {/* قسم البطل */}
      <section className="relative py-20 md:py-28">
        {/* الخلفية */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
        
        {/* المحتوى */}
        <div className="container relative z-10 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              {siteSettings?.siteTagline || 'اكتشف افضل فرص المنح الدراسية حول العالم'}
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 mb-8 animate-slide-up">
              نقدم مجموعة شاملة من المنح الدراسية للطلاب من جميع أنحاء العالم.
              ابحث عن المنحة المناسبة لك وابدأ رحلتك التعليمية.
            </p>
            
            {/* صندوق البحث */}
            <div className="relative max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <form 
                className="flex flex-col md:flex-row" 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/scholarships?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              >
                <div className="relative flex-grow mb-3 md:mb-0">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full py-4 px-5 pr-14 rounded-lg md:rounded-r-none text-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
                    placeholder="ابحث عن منح دراسية، جامعات، تخصصات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-lg md:rounded-l-none transition-all"
                >
                  بحث
                </button>
              </form>
            </div>
            
            {/* ميزات سريعة */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center">
                <GraduationCap className="h-6 w-6 mr-2" />
                <span>+10,000 منحة دراسية</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-6 w-6 mr-2" />
                <span>+100 دولة حول العالم</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                <span>كافة المستويات الدراسية</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* سهم التمرير لأسفل */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <button
            onClick={() => scrollToSection('categories')}
            className="bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-colors"
            aria-label="تمرير لأسفل"
          >
            <ArrowDown className="h-6 w-6" />
          </button>
        </div>
      </section>
      
      {/* قسم الإحصائيات */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">منحة دراسية</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">110+</div>
              <div className="text-gray-600 dark:text-gray-300">دولة مستضيفة</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">تخصص دراسي</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">25,000+</div>
              <div className="text-gray-600 dark:text-gray-300">طالب مستفيد</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم التصنيفات */}
      <section id="categories" className="py-16 bg-white dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">استكشف حسب التصنيف</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              تصفح المنح الدراسية حسب التصنيفات المختلفة للعثور على الفرصة المناسبة لاحتياجاتك واهتماماتك
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* هذه مثال للتصنيفات، يمكن استبدالها بالبيانات الفعلية */}
            {[
              { name: 'هندسة', icon: '🏗️', count: 458 },
              { name: 'طب', icon: '🏥', count: 312 },
              { name: 'علوم الحاسب', icon: '💻', count: 287 },
              { name: 'إدارة أعمال', icon: '📊', count: 245 },
              { name: 'العلوم الإنسانية', icon: '📚', count: 220 },
              { name: 'العلوم الطبيعية', icon: '🔬', count: 189 },
              { name: 'الفنون', icon: '🎨', count: 156 },
              { name: 'القانون', icon: '⚖️', count: 132 },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/categories/${category.name}`}
                className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow text-center card-hover"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold mb-1">{category.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {category.count} منحة
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              href="/categories"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              عرض جميع التصنيفات
              <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* قسم المنح المميزة */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">أحدث المنح الدراسية</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              استكشف أحدث المنح الدراسية المتاحة لمختلف التخصصات والمستويات الدراسية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* هذه مثال للمنح، يمكن استبدالها بالبيانات الفعلية */}
            {[
              {
                title: 'منحة جامعة هارفارد للطلاب الدوليين',
                country: 'الولايات المتحدة',
                deadline: '2025-08-15',
                featured: true,
                category: 'متعدد التخصصات',
                level: 'بكالوريوس'
              },
              {
                title: 'منحة جامعة أكسفورد للدراسات العليا',
                country: 'المملكة المتحدة',
                deadline: '2025-09-30',
                featured: false,
                category: 'متعدد التخصصات',
                level: 'ماجستير'
              },
              {
                title: 'منحة DAAD للطلاب العرب',
                country: 'ألمانيا',
                deadline: '2025-07-20',
                featured: false,
                category: 'هندسة',
                level: 'دكتوراه'
              },
              {
                title: 'منحة جامعة سنغافورة الوطنية',
                country: 'سنغافورة',
                deadline: '2025-10-05',
                featured: true,
                category: 'علوم الحاسب',
                level: 'بكالوريوس'
              },
              {
                title: 'منحة جامعة كيوتو للبحث العلمي',
                country: 'اليابان',
                deadline: '2025-08-25',
                featured: false,
                category: 'العلوم الطبيعية',
                level: 'دكتوراه'
              },
              {
                title: 'منحة جامعة السوربون',
                country: 'فرنسا',
                deadline: '2025-09-15',
                featured: false,
                category: 'العلوم الإنسانية',
                level: 'ماجستير'
              },
            ].map((scholarship, index) => (
              <Link
                key={index}
                href={`/scholarships/${scholarship.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow card-hover"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  ></div>
                  
                  {scholarship.featured && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                      منحة مميزة
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm font-medium">
                      <Globe className="inline-block w-4 h-4 mr-1" />
                      {scholarship.country}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{scholarship.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                      {scholarship.category}
                    </span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">
                      {scholarship.level}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm border-t pt-3">
                    <span className="text-gray-600 dark:text-gray-400">
                      <Award className="inline-block w-4 h-4 mr-1" />
                      ممولة بالكامل
                    </span>
                    <span>
                      <span className="text-gray-500 dark:text-gray-400">آخر موعد: </span>
                      <span className="font-medium">
                        {new Date(scholarship.deadline).toLocaleDateString('ar-EG')}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              href="/scholarships"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              عرض جميع المنح الدراسية
            </Link>
          </div>
        </div>
      </section>
      
      {/* قسم الدول المميزة */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">الدول الأكثر استضافة للمنح</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              اكتشف أفضل الدول التي توفر فرص تعليمية متميزة للطلاب الدوليين
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* هذه مثال للدول، يمكن استبدالها بالبيانات الفعلية */}
            {[
              { name: 'الولايات المتحدة', flag: '🇺🇸', count: 1240 },
              { name: 'المملكة المتحدة', flag: '🇬🇧', count: 980 },
              { name: 'ألمانيا', flag: '🇩🇪', count: 760 },
              { name: 'كندا', flag: '🇨🇦', count: 620 },
              { name: 'أستراليا', flag: '🇦🇺', count: 540 },
              { name: 'فرنسا', flag: '🇫🇷', count: 480 },
              { name: 'اليابان', flag: '🇯🇵', count: 410 },
              { name: 'هولندا', flag: '🇳🇱', count: 350 },
            ].map((country, index) => (
              <Link
                key={index}
                href={`/countries/${country.name}`}
                className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow text-center card-hover"
              >
                <div className="text-4xl mb-3">{country.flag}</div>
                <h3 className="font-bold mb-1">{country.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {country.count} منحة
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              href="/countries"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              عرض جميع الدول
              <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* قسم دليل المنح */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">دليل التقديم للمنح الدراسية</h2>
              <p className="mb-6 opacity-90">
                اكتشف كيفية التقديم للمنح الدراسية بنجاح. دليلنا الشامل سيساعدك على فهم العملية خطوة بخطوة وزيادة فرصك في الحصول على المنح.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-medium">البحث عن المنح المناسبة</h3>
                    <p className="text-sm opacity-80">تعرف على كيفية البحث عن المنح المناسبة لتخصصك ومؤهلاتك</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-medium">تجهيز المستندات المطلوبة</h3>
                    <p className="text-sm opacity-80">تعرف على المستندات المطلوبة وكيفية تجهيزها بشكل احترافي</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-medium">كتابة مقال تنافسي</h3>
                    <p className="text-sm opacity-80">تعلم كيفية كتابة مقال قوي يزيد من فرصك في الحصول على المنحة</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-medium">اجتياز المقابلة الشخصية</h3>
                    <p className="text-sm opacity-80">نصائح وإرشادات لاجتياز المقابلة الشخصية بنجاح</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/guides/scholarships"
                className="inline-block mt-8 px-6 py-3 bg-white text-blue-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                قراءة الدليل الكامل
              </Link>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">نصائح سريعة للتقديم</h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>ابدأ البحث مبكراً قبل المواعيد النهائية بوقت كاف</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>تأكد من استيفاء جميع الشروط قبل التقديم</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>اطلب خطابات توصية من أساتذة متميزين</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>اكتب مقالاً شخصياً فريداً يعبر عن شخصيتك وأهدافك</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>تدرب على المقابلات الشخصية مع أصدقاء أو أساتذة</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>قم بتقديم طلبات لعدة منح لزيادة فرصك</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم النشرة البريدية */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">اشترك في النشرة البريدية</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              احصل على أحدث المنح الدراسية وفرص التعليم مباشرة في بريدك الإلكتروني
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-grow py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                اشتراك
              </button>
            </form>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              لن نقوم بمشاركة بريدك الإلكتروني مع أي جهة خارجية.
              يمكنك إلغاء الاشتراك في أي وقت.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}