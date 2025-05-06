import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { useSiteSettings } from '@/contexts/site-settings-context';
import { db } from '@/db';
import { scholarships, categories, countries, levels } from '@/shared/schema';
import { eq, desc, sql } from 'drizzle-orm';

// نوع البيانات للمنح الدراسية
interface ScholarshipData {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  featured: boolean;
  deadline: string;
  fundingType: string;
  studyDestination: string;
  categoryName?: string;
  countryName?: string;
  levelName?: string;
}

// نوع البيانات لخيارات التصفية
interface FilterOptions {
  categories: { id: number; name: string }[];
  countries: { id: number; name: string }[];
  levels: { id: number; name: string }[];
}

interface ScholarshipsPageProps {
  scholarshipsData: ScholarshipData[];
  filterOptions: FilterOptions;
  totalScholarships: number;
}

export default function ScholarshipsPage({ 
  scholarshipsData, 
  filterOptions, 
  totalScholarships 
}: ScholarshipsPageProps) {
  const router = useRouter();
  const { siteSettings } = useSiteSettings();
  
  // حالة التصفية
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // تحديث المسار بناءً على التصفية
  const applyFilters = () => {
    const query: any = {};
    
    if (selectedCategory) query.category = selectedCategory;
    if (selectedCountry) query.country = selectedCountry;
    if (selectedLevel) query.level = selectedLevel;
    if (searchQuery) query.search = searchQuery;
    
    router.push({
      pathname: '/scholarships',
      query
    });
  };
  
  return (
    <>
      <Head>
        <title>{siteSettings?.siteName ? `المنح الدراسية | ${siteSettings.siteName}` : 'المنح الدراسية'}</title>
        <meta 
          name="description" 
          content={`استكشف أحدث المنح الدراسية المتاحة. فرص تعليمية في مختلف التخصصات والدول.`} 
        />
      </Head>
      
      <MainLayout>
        {/* قسم العنوان الرئيسي */}
        <div className="bg-gradient-brand py-12 text-white">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">المنح الدراسية</h1>
            <p className="text-lg opacity-90">
              استكشف أحدث المنح الدراسية المتاحة في مختلف التخصصات والدول
            </p>
            <div className="mt-6">
              <p className="text-sm opacity-80">
                إجمالي المنح المتاحة: <span className="font-bold">{totalScholarships}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* قسم البحث والتصفية */}
        <div className="bg-gray-50 dark:bg-gray-900 py-6 border-b">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* مربع البحث */}
              <div className="w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="ابحث عن منح دراسية..."
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* التصفية حسب الفئة */}
              <div className="w-full md:w-1/5">
                <select 
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">جميع التخصصات</option>
                  {filterOptions.categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* التصفية حسب الدولة */}
              <div className="w-full md:w-1/5">
                <select 
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">جميع الدول</option>
                  {filterOptions.countries.map((country) => (
                    <option key={country.id} value={String(country.id)}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* التصفية حسب المستوى */}
              <div className="w-full md:w-1/5">
                <select 
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="">جميع المستويات</option>
                  {filterOptions.levels.map((level) => (
                    <option key={level.id} value={String(level.id)}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* زر البحث */}
              <button 
                className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                onClick={applyFilters}
              >
                تصفية
              </button>
            </div>
          </div>
        </div>
        
        {/* قائمة المنح الدراسية */}
        <div className="container py-12">
          {scholarshipsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarshipsData.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                لم يتم العثور على منح دراسية تطابق معايير البحث
              </p>
              <button 
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => router.push('/scholarships')}
              >
                عرض جميع المنح
              </button>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
}

// بطاقة المنحة الدراسية
function ScholarshipCard({ scholarship }: { scholarship: ScholarshipData }) {
  const router = useRouter();
  const deadline = new Date(scholarship.deadline);
  const isExpired = deadline < new Date();
  
  // حساب الوقت المتبقي للتقديم
  const daysRemaining = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 cursor-pointer card-hover"
      onClick={() => router.push(`/scholarships/${scholarship.slug}`)}
    >
      {/* صورة المنحة */}
      <div className="h-48 relative">
        {scholarship.thumbnail ? (
          <img 
            src={scholarship.thumbnail} 
            alt={scholarship.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">لا توجد صورة</span>
          </div>
        )}
        
        {/* شارة المنح المميزة */}
        {scholarship.featured && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            منحة مميزة
          </div>
        )}
        
        {/* شارة حالة المنحة */}
        <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${
          isExpired 
            ? 'bg-red-500' 
            : daysRemaining <= 7 
              ? 'bg-amber-500' 
              : 'bg-green-500'
        }`}>
          {isExpired 
            ? 'انتهت' 
            : daysRemaining <= 7 
              ? `${daysRemaining} أيام متبقية` 
              : 'متاحة للتقديم'}
        </div>
      </div>
      
      {/* محتوى المنحة */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{scholarship.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {scholarship.categoryName && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
              {scholarship.categoryName}
            </span>
          )}
          {scholarship.countryName && (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded">
              {scholarship.countryName}
            </span>
          )}
          {scholarship.levelName && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded">
              {scholarship.levelName}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {scholarship.description}
        </p>
        
        <div className="flex justify-between items-center text-sm border-t pt-3">
          <span>
            نوع التمويل: <span className="font-medium">{scholarship.fundingType}</span>
          </span>
          <span>
            آخر موعد: <span className="font-medium">{new Date(scholarship.deadline).toLocaleDateString('ar-EG')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    // الحصول على معلمات التصفية من الاستعلام
    const categoryId = query.category ? Number(query.category) : undefined;
    const countryId = query.country ? Number(query.country) : undefined;
    const levelId = query.level ? Number(query.level) : undefined;
    const searchQuery = query.search as string | undefined;
    
    // استعلام للحصول على خيارات التصفية
    const categoriesData = await db.select({ id: categories.id, name: categories.name }).from(categories);
    const countriesData = await db.select({ id: countries.id, name: countries.name }).from(countries);
    const levelsData = await db.select({ id: levels.id, name: levels.name }).from(levels);
    
    // بناء استعلام المنح الدراسية مع المرشحات
    let scholarshipsQuery = db
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
        categoryName: categories.name,
        countryName: countries.name,
        levelName: levels.name,
      })
      .from(scholarships)
      .leftJoin(categories, eq(scholarships.categoryId, categories.id))
      .leftJoin(countries, eq(scholarships.countryId, countries.id))
      .leftJoin(levels, eq(scholarships.levelId, levels.id))
      .orderBy(desc(scholarships.featured), desc(scholarships.createdAt));
    
    // إضافة مرشحات إذا تم تحديدها
    if (categoryId) {
      scholarshipsQuery = scholarshipsQuery.where(eq(scholarships.categoryId, categoryId));
    }
    
    if (countryId) {
      scholarshipsQuery = scholarshipsQuery.where(eq(scholarships.countryId, countryId));
    }
    
    if (levelId) {
      scholarshipsQuery = scholarshipsQuery.where(eq(scholarships.levelId, levelId));
    }
    
    if (searchQuery) {
      scholarshipsQuery = scholarshipsQuery.where(
        sql`${scholarships.title} ILIKE ${'%' + searchQuery + '%'} OR ${scholarships.description} ILIKE ${'%' + searchQuery + '%'}`
      );
    }
    
    // تنفيذ الاستعلام
    const scholarshipsData = await scholarshipsQuery;
    
    // الحصول على إجمالي عدد المنح
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(scholarships);
    
    // إرجاع البيانات كخصائص للصفحة
    return {
      props: {
        scholarshipsData: JSON.parse(JSON.stringify(scholarshipsData)),
        filterOptions: {
          categories: categoriesData,
          countries: countriesData,
          levels: levelsData,
        },
        totalScholarships: count,
      },
    };
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    
    // إرجاع بيانات فارغة في حالة حدوث خطأ
    return {
      props: {
        scholarshipsData: [],
        filterOptions: {
          categories: [],
          countries: [],
          levels: [],
        },
        totalScholarships: 0,
      },
    };
  }
};