import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { CalendarClock, MapPin, GraduationCap, BookOpen, Briefcase, Clock, AlertCircle, Award, DollarSign, School, FileText, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/contexts/site-settings-context';

// تعريف واجهة تفاصيل المنحة الدراسية
interface ScholarshipDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
  deadline: string;
  fundingType: string;
  studyDestination?: string;
  eligibilityCriteria?: string;
  applicationProcess?: string;
  benefits?: string;
  requirements?: string;
  categoryId?: number;
  countryId?: number;
  levelId?: number;
  category?: { id: number; name: string; slug: string };
  country?: { id: number; name: string; slug: string };
  level?: { id: number; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

// تعريف واجهة المنح ذات الصلة
interface RelatedScholarship {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  deadline: string;
  isFeatured: boolean;
}

// تعريف واجهة خصائص صفحة تفاصيل المنحة
interface ScholarshipDetailPageProps {
  scholarship: ScholarshipDetail;
  relatedScholarships: RelatedScholarship[];
}

// مكون صفحة تفاصيل المنحة
export default function ScholarshipDetailPage({ 
  scholarship,
  relatedScholarships
}: ScholarshipDetailPageProps) {
  const router = useRouter();
  const { siteSettings } = useSiteSettings();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // الوظائف
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // يمكن هنا تنفيذ المنطق الخاص بحفظ المنحة في قائمة المحفوظات
  };
  
  const shareScholarship = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: scholarship.title,
          text: scholarship.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // نسخ الرابط إلى الحافظة إذا كانت ميزة المشاركة غير متوفرة
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };
  
  // تنسيق التاريخ
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'غير محدد';
    }
  };
  
  // إذا كانت الصفحة قيد التحميل
  if (router.isFallback) {
    return (
      <MainLayout title="جاري التحميل..." description="جاري تحميل تفاصيل المنحة الدراسية">
        <div className="container py-12">
          <div className="flex justify-center items-center h-80">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-xl font-bold">جاري تحميل تفاصيل المنحة...</h2>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title={`${scholarship.title} | ${siteSettings?.siteName || 'FULLSCO'}`} description={scholarship.description}>
      <Head>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/scholarships/${scholarship.slug}`} />
        <meta property="og:title" content={scholarship.title} />
        <meta property="og:description" content={scholarship.description} />
        {scholarship.thumbnailUrl && (
          <meta property="og:image" content={scholarship.thumbnailUrl} />
        )}
        <meta property="article:published_time" content={scholarship.createdAt} />
        <meta property="article:modified_time" content={scholarship.updatedAt} />
      </Head>
      
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="container">
          <nav className="flex mb-6 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 space-x-reverse">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-primary">
                  الرئيسية
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <Link href="/scholarships" className="hover:text-primary">
                  المنح الدراسية
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300" aria-current="page">
                  {scholarship.title.length > 30 ? `${scholarship.title.substring(0, 30)}...` : scholarship.title}
                </span>
              </li>
            </ol>
          </nav>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              {scholarship.isFeatured && (
                <div className="inline-block bg-amber-500 text-white text-sm px-3 py-1 rounded-full mb-4">
                  منحة مميزة
                </div>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {scholarship.title}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                {scholarship.description}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {scholarship.category && (
                  <Link href={`/scholarships?category=${scholarship.category.slug}`} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    {scholarship.category.name}
                  </Link>
                )}
                
                {scholarship.level && (
                  <Link href={`/scholarships?level=${scholarship.level.slug}`} className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                    <GraduationCap className="w-4 h-4" />
                    {scholarship.level.name}
                  </Link>
                )}
                
                {scholarship.country && (
                  <Link href={`/scholarships?country=${scholarship.country.slug}`} className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <MapPin className="w-4 h-4" />
                    {scholarship.country.name}
                  </Link>
                )}
                
                {scholarship.fundingType && (
                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-full text-sm">
                    <Award className="w-4 h-4" />
                    {scholarship.fundingType}
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-80 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    الموعد النهائي
                  </h3>
                  <div className="text-lg font-medium text-red-600 dark:text-red-400">
                    {formatDate(scholarship.deadline)}
                  </div>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">بلد الدراسة:</span>
                      <span className="font-medium">{scholarship.country?.name || scholarship.studyDestination || 'غير محدد'}</span>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <School className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">المستوى الدراسي:</span>
                      <span className="font-medium">{scholarship.level?.name || 'جميع المستويات'}</span>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <Award className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">نوع التمويل:</span>
                      <span className="font-medium">{scholarship.fundingType}</span>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">تغطي المنحة:</span>
                      <span className="font-medium">الرسوم الدراسية، المعيشة، السكن، السفر</span>
                    </div>
                  </li>
                </ul>
                
                <div className="border-t border-gray-200 dark:border-gray-700 mt-5 pt-5">
                  <a 
                    href="#apply" 
                    className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    تقديم طلب
                  </a>
                  
                  <div className="flex mt-3 gap-2">
                    <button
                      onClick={toggleBookmark}
                      className={`flex-1 flex justify-center items-center gap-2 border ${
                        isBookmarked 
                          ? 'border-primary text-primary' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      } py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                    >
                      <Bookmark className="w-5 h-5" />
                      {isBookmarked ? 'محفوظة' : 'حفظ'}
                    </button>
                    
                    <button
                      onClick={shareScholarship}
                      className="flex-1 flex justify-center items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      مشاركة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* محتوى المنحة */}
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* المحتوى الرئيسي */}
          <div className="flex-1">
            {/* صورة المنحة */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-8 h-96 relative">
              {scholarship.thumbnailUrl ? (
                <Image
                  src={scholarship.thumbnailUrl}
                  alt={scholarship.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                  <School className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* تفاصيل المنحة */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <h2>نظرة عامة</h2>
              <div dangerouslySetInnerHTML={{ __html: scholarship.content || scholarship.description }} />
              
              {scholarship.eligibilityCriteria && (
                <>
                  <h2>معايير الأهلية</h2>
                  <div dangerouslySetInnerHTML={{ __html: scholarship.eligibilityCriteria }} />
                </>
              )}
              
              {scholarship.benefits && (
                <>
                  <h2>المميزات والفوائد</h2>
                  <div dangerouslySetInnerHTML={{ __html: scholarship.benefits }} />
                </>
              )}
              
              {scholarship.requirements && (
                <>
                  <h2>المتطلبات والمستندات</h2>
                  <div dangerouslySetInnerHTML={{ __html: scholarship.requirements }} />
                </>
              )}
              
              {scholarship.applicationProcess && (
                <>
                  <h2 id="apply">كيفية التقديم</h2>
                  <div dangerouslySetInnerHTML={{ __html: scholarship.applicationProcess }} />
                </>
              )}
            </div>
            
            {/* رابط التقديم */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">للتقديم على المنحة</h3>
              <p className="mb-4">
                يرجى زيارة الموقع الرسمي للمنحة للاطلاع على كافة التفاصيل وتقديم طلبك قبل انتهاء الموعد النهائي.
              </p>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary text-white font-medium rounded-lg px-6 py-3 inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                التقديم الآن
                <ExternalLink className="w-5 h-5" />
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                <AlertCircle className="w-4 h-4 inline-block mr-1" />
                آخر موعد للتقديم: {formatDate(scholarship.deadline)}
              </p>
            </div>
          </div>
          
          {/* الشريط الجانبي */}
          <div className="md:w-80 md:flex-shrink-0">
            {/* المنح ذات الصلة */}
            {relatedScholarships.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-5">منح ذات صلة</h3>
                <div className="space-y-4">
                  {relatedScholarships.map(relatedScholarship => (
                    <div key={relatedScholarship.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <Link href={`/scholarships/${relatedScholarship.slug}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="p-4">
                          <h4 className="font-bold mb-2 line-clamp-2">{relatedScholarship.title}</h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              آخر موعد: {formatDate(relatedScholarship.deadline)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link 
                    href="/scholarships" 
                    className="text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    عرض جميع المنح
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5"/>
                      <path d="M12 19l-7-7 7-7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            )}
            
            {/* معلومات إضافية */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
              <h3 className="text-xl font-bold mb-4">معلومات إضافية</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">التصنيف:</span>
                    <span className="font-medium">
                      {scholarship.category ? (
                        <Link 
                          href={`/scholarships?category=${scholarship.category.slug}`} 
                          className="text-primary hover:underline"
                        >
                          {scholarship.category.name}
                        </Link>
                      ) : (
                        'غير مصنف'
                      )}
                    </span>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <CalendarClock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">تاريخ النشر:</span>
                    <time className="font-medium">
                      {formatDate(scholarship.createdAt)}
                    </time>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">التخصصات:</span>
                    <span className="font-medium">جميع التخصصات</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// جلب البيانات من الخادم
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    
    if (!slug) {
      return {
        notFound: true
      };
    }
    
    // استدعاء API لجلب تفاصيل المنحة 
    // استخدام كائن URL بدلاً من التسلسل المباشر، مع ضمان التعامل السليم مع الأحرف العربية
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const apiUrl = new URL('/api/scholarships/by-slug', baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`);
    apiUrl.searchParams.append('slug', slug);
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error(`حدث خطأ أثناء جلب تفاصيل المنحة: ${response.status}`);
    }
    
    const data = await response.json();
    
    // التحقق من وجود المنحة
    if (!data.scholarship) {
      return {
        notFound: true
      };
    }
    
    return {
      props: {
        scholarship: data.scholarship,
        relatedScholarships: data.relatedScholarships || []
      }
    };
  } catch (error) {
    console.error('Error fetching scholarship details:', error);
    
    return {
      notFound: true
    };
  }
}