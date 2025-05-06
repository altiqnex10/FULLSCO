import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { useSiteSettings } from '@/contexts/site-settings-context';
import { db } from '@/db';
import { scholarships, categories, countries, levels, users } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';
import { Calendar, GraduationCap, Globe, Book, Clock, Award, Share2 } from 'lucide-react';

// نوع البيانات للمنحة الدراسية
interface ScholarshipDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  featured: boolean;
  deadline: string;
  fundingType: string;
  studyDestination: string;
  eligibilityCriteria: string;
  applicationProcess: string;
  benefits: string;
  requirements: string;
  categoryId?: number;
  countryId?: number;
  levelId?: number;
  publisherId?: number;
  categoryName?: string;
  countryName?: string;
  levelName?: string;
  publisherName?: string;
  createdAt: string;
  updatedAt: string;
}

// نوع البيانات للمنح ذات الصلة
interface RelatedScholarship {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string;
  deadline: string;
}

interface ScholarshipDetailPageProps {
  scholarship: ScholarshipDetail;
  relatedScholarships: RelatedScholarship[];
}

export default function ScholarshipDetailPage({ 
  scholarship, 
  relatedScholarships 
}: ScholarshipDetailPageProps) {
  const router = useRouter();
  const { siteSettings } = useSiteSettings();
  
  // إذا لم يتم العثور على المنحة، عرض رسالة خطأ
  if (!scholarship) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">لم يتم العثور على المنحة</h1>
          <p className="mb-6">المنحة الدراسية التي تبحث عنها غير موجودة أو تم حذفها.</p>
          <Link href="/scholarships">
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              العودة إلى قائمة المنح
            </button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  // تنسيق التاريخ
  const formattedDeadline = new Date(scholarship.deadline).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // التحقق مما إذا كانت المنحة منتهية
  const isExpired = new Date(scholarship.deadline) < new Date();
  
  // مشاركة المنحة
  const shareScholarship = () => {
    if (navigator.share) {
      navigator.share({
        title: scholarship.title,
        text: `تحقق من هذه المنحة الدراسية: ${scholarship.title}`,
        url: window.location.href
      });
    } else {
      // نسخ الرابط إذا كانت مشاركة الويب غير مدعومة
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط إلى الحافظة');
    }
  };
  
  return (
    <>
      <Head>
        <title>{`${scholarship.title} | ${siteSettings?.siteName || 'منصة المنح الدراسية'}`}</title>
        <meta 
          name="description" 
          content={`${scholarship.description?.substring(0, 160)}...`}
        />
        <meta property="og:title" content={scholarship.title} />
        <meta property="og:description" content={scholarship.description?.substring(0, 160)} />
        {scholarship.thumbnail && <meta property="og:image" content={scholarship.thumbnail} />}
      </Head>
      
      <MainLayout>
        {/* شريط التنقل */}
        <div className="bg-gray-100 dark:bg-gray-800 py-3 border-b">
          <div className="container">
            <nav className="flex text-sm">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:underline">
                الرئيسية
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/scholarships" className="text-gray-600 dark:text-gray-400 hover:underline">
                المنح الدراسية
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-primary font-medium truncate">
                {scholarship.title}
              </span>
            </nav>
          </div>
        </div>
        
        {/* رأس المنحة */}
        <div className={`py-8 text-white ${isExpired ? 'bg-gray-700' : 'bg-gradient-brand'}`}>
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{scholarship.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {scholarship.categoryName && (
                    <span className="bg-blue-600/30 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Book className="w-4 h-4 mr-1" />
                      {scholarship.categoryName}
                    </span>
                  )}
                  {scholarship.countryName && (
                    <span className="bg-green-600/30 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {scholarship.countryName}
                    </span>
                  )}
                  {scholarship.levelName && (
                    <span className="bg-purple-600/30 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      {scholarship.levelName}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm opacity-90">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>آخر موعد للتقديم: </span>
                  <span className={`font-semibold mr-1 ${isExpired ? 'text-red-300' : 'text-white'}`}>
                    {formattedDeadline}
                  </span>
                  {isExpired && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded mr-2">
                      منتهية
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={shareScholarship}
                  className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  مشاركة
                </button>
                {!isExpired && (
                  <a
                    href="#apply"
                    className="flex items-center px-4 py-2 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    التقدم للمنحة
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* المحتوى الرئيسي */}
            <div className="w-full lg:w-2/3">
              {/* صورة المنحة */}
              {scholarship.thumbnail && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img 
                    src={scholarship.thumbnail} 
                    alt={scholarship.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              {/* الوصف */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">نبذة عن المنحة</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none" 
                  dangerouslySetInnerHTML={{ __html: scholarship.description }}
                />
              </section>
              
              {/* المزايا */}
              {scholarship.benefits && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">المزايا</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none" 
                    dangerouslySetInnerHTML={{ __html: scholarship.benefits }}
                  />
                </section>
              )}
              
              {/* معايير الأهلية */}
              {scholarship.eligibilityCriteria && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">معايير الأهلية</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none" 
                    dangerouslySetInnerHTML={{ __html: scholarship.eligibilityCriteria }}
                  />
                </section>
              )}
              
              {/* المتطلبات */}
              {scholarship.requirements && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">المتطلبات</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none" 
                    dangerouslySetInnerHTML={{ __html: scholarship.requirements }}
                  />
                </section>
              )}
              
              {/* عملية التقديم */}
              {scholarship.applicationProcess && (
                <section className="mb-8" id="apply">
                  <h2 className="text-2xl font-bold mb-4">كيفية التقديم</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none" 
                    dangerouslySetInnerHTML={{ __html: scholarship.applicationProcess }}
                  />
                </section>
              )}
            </div>
            
            {/* الشريط الجانبي */}
            <div className="w-full lg:w-1/3">
              {/* بطاقة معلومات المنحة */}
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  معلومات المنحة
                </h3>
                
                <ul className="divide-y dark:divide-gray-700">
                  <li className="py-3 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">نوع التمويل</span>
                    <span className="font-medium">{scholarship.fundingType}</span>
                  </li>
                  <li className="py-3 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">وجهة الدراسة</span>
                    <span className="font-medium">{scholarship.studyDestination}</span>
                  </li>
                  {scholarship.countryName && (
                    <li className="py-3 flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">الدولة</span>
                      <span className="font-medium">{scholarship.countryName}</span>
                    </li>
                  )}
                  {scholarship.levelName && (
                    <li className="py-3 flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">المستوى الدراسي</span>
                      <span className="font-medium">{scholarship.levelName}</span>
                    </li>
                  )}
                  {scholarship.categoryName && (
                    <li className="py-3 flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">التخصص</span>
                      <span className="font-medium">{scholarship.categoryName}</span>
                    </li>
                  )}
                  <li className="py-3 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">آخر موعد للتقديم</span>
                    <span className={`font-medium ${isExpired ? 'text-red-500' : ''}`}>
                      {formattedDeadline}
                    </span>
                  </li>
                </ul>
                
                {!isExpired && (
                  <a
                    href="#apply"
                    className="mt-4 w-full block text-center bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    التقدم للمنحة
                  </a>
                )}
              </div>
              
              {/* المنح ذات الصلة */}
              {relatedScholarships.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border">
                  <h3 className="text-xl font-bold mb-4">منح ذات صلة</h3>
                  
                  <div className="space-y-4">
                    {relatedScholarships.map((related) => (
                      <Link href={`/scholarships/${related.slug}`} key={related.id}>
                        <div className="flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                          {related.thumbnail ? (
                            <img
                              src={related.thumbnail}
                              alt={related.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <Award className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-2">{related.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                              <Clock className="w-3 h-3 ml-1" />
                              {new Date(related.deadline).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <Link href="/scholarships">
                    <button className="mt-4 w-full text-center border border-primary text-primary py-2 rounded-lg hover:bg-primary/5 transition-colors">
                      عرض جميع المنح
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    
    // الحصول على بيانات المنحة الدراسية
    const [scholarshipData] = await db
      .select({
        id: scholarships.id,
        title: scholarships.title,
        slug: scholarships.slug,
        description: scholarships.description,
        thumbnail: scholarships.thumbnail,
        featured: scholarships.featured,
        deadline: scholarships.deadline,
        fundingType: scholarships.fundingType,
        studyDestination: scholarships.studyDestination,
        eligibilityCriteria: scholarships.eligibilityCriteria,
        applicationProcess: scholarships.applicationProcess,
        benefits: scholarships.benefits,
        requirements: scholarships.requirements,
        categoryId: scholarships.categoryId,
        countryId: scholarships.countryId,
        levelId: scholarships.levelId,
        publisherId: scholarships.publisherId,
        categoryName: categories.name,
        countryName: countries.name,
        levelName: levels.name,
        publisherName: users.name,
        createdAt: scholarships.createdAt,
        updatedAt: scholarships.updatedAt,
      })
      .from(scholarships)
      .leftJoin(categories, eq(scholarships.categoryId, categories.id))
      .leftJoin(countries, eq(scholarships.countryId, countries.id))
      .leftJoin(levels, eq(scholarships.levelId, levels.id))
      .leftJoin(users, eq(scholarships.publisherId, users.id))
      .where(eq(scholarships.slug, slug));
    
    // إذا لم يتم العثور على المنحة، إرجاع بيانات فارغة
    if (!scholarshipData) {
      return {
        props: {
          scholarship: null,
          relatedScholarships: [],
        },
      };
    }
    
    // الحصول على المنح ذات الصلة (نفس الفئة أو المستوى أو الدولة)
    const relatedScholarshipsData = await db
      .select({
        id: scholarships.id,
        title: scholarships.title,
        slug: scholarships.slug,
        thumbnail: scholarships.thumbnail,
        deadline: scholarships.deadline,
      })
      .from(scholarships)
      .where(
        sql`(
          ${scholarships.categoryId} = ${scholarshipData.categoryId} OR
          ${scholarships.levelId} = ${scholarshipData.levelId} OR
          ${scholarships.countryId} = ${scholarshipData.countryId}
        ) AND ${scholarships.id} != ${scholarshipData.id}`
      )
      .limit(3);
    
    // إرجاع البيانات كخصائص للصفحة
    return {
      props: {
        scholarship: JSON.parse(JSON.stringify(scholarshipData)),
        relatedScholarships: JSON.parse(JSON.stringify(relatedScholarshipsData)),
      },
    };
  } catch (error) {
    console.error('Error fetching scholarship details:', error);
    
    // إرجاع بيانات فارغة في حالة حدوث خطأ
    return {
      props: {
        scholarship: null,
        relatedScholarships: [],
      },
    };
  }
};