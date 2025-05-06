import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { scholarships, categories, countries, levels } from '@/shared/schema';
import { desc, eq, like, and, SQL, sql } from 'drizzle-orm';
import { z } from 'zod';

// مخطط للتحقق من معلمات الاستعلام
const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional(),
  category: z.string().optional(),
  country: z.string().optional(),
  level: z.string().optional(),
  fundingType: z.string().optional(),
  sortBy: z.enum(['newest', 'deadline', 'popularity', 'relevance']).optional().default('newest'),
  featured: z.enum(['true', 'false']).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // التحقق من معلمات الاستعلام
    const queryParams = querySchema.parse(req.query);
    const { page, limit, search, category, country, level, fundingType, sortBy, featured } = queryParams;
    
    // حساب الإزاحة
    const offset = (page - 1) * limit;
    
    // بناء شروط WHERE
    const whereConditions: SQL[] = [];
    
    // البحث عن نص
    if (search) {
      whereConditions.push(
        sql`(${scholarships.title} ILIKE ${`%${search}%`} OR ${scholarships.description} ILIKE ${`%${search}%`})`
      );
    }
    
    // التصفية حسب الفئة
    if (category) {
      // البحث عن معرف الفئة بناءً على الاسم المستعار
      const categoryData = await db.select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);
      
      if (categoryData.length > 0) {
        whereConditions.push(eq(scholarships.categoryId, categoryData[0].id));
      }
    }
    
    // التصفية حسب الدولة
    if (country) {
      // البحث عن معرف الدولة بناءً على الاسم المستعار
      const countryData = await db.select({ id: countries.id })
        .from(countries)
        .where(eq(countries.slug, country))
        .limit(1);
      
      if (countryData.length > 0) {
        whereConditions.push(eq(scholarships.countryId, countryData[0].id));
      }
    }
    
    // التصفية حسب المستوى
    if (level) {
      // البحث عن معرف المستوى بناءً على الاسم المستعار
      const levelData = await db.select({ id: levels.id })
        .from(levels)
        .where(eq(levels.slug, level))
        .limit(1);
      
      if (levelData.length > 0) {
        whereConditions.push(eq(scholarships.levelId, levelData[0].id));
      }
    }
    
    // التصفية حسب نوع التمويل
    if (fundingType) {
      whereConditions.push(eq(scholarships.fundingType, fundingType));
    }
    
    // التصفية حسب الميزة
    if (featured === 'true') {
      whereConditions.push(eq(scholarships.isFeatured, true));
    }
    
    // استعلام العدد الإجمالي
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(scholarships);
    
    if (whereConditions.length > 0) {
      countQuery = countQuery.where(and(...whereConditions));
    }
    
    const totalResult = await countQuery;
    const totalScholarships = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(totalScholarships / limit);
    
    // استعلام البيانات
    let dataQuery = db.select({
      id: scholarships.id,
      title: scholarships.title,
      slug: scholarships.slug,
      description: scholarships.description,
      deadline: scholarships.deadline,
      isFeatured: scholarships.isFeatured,
      fundingType: scholarships.fundingType,
      categoryId: scholarships.categoryId,
      countryId: scholarships.countryId,
      levelId: scholarships.levelId,
      createdAt: scholarships.createdAt,
      updatedAt: scholarships.updatedAt,
      thumbnailUrl: scholarships.thumbnailUrl
    }).from(scholarships);
    
    if (whereConditions.length > 0) {
      dataQuery = dataQuery.where(and(...whereConditions));
    }
    
    // الترتيب
    switch (sortBy) {
      case 'deadline':
        dataQuery = dataQuery.orderBy(scholarships.deadline);
        break;
      case 'popularity':
        dataQuery = dataQuery.orderBy(desc(scholarships.views));
        break;
      case 'relevance':
        // إذا كان هناك بحث، يتم ترتيب النتائج حسب الصلة
        if (search) {
          dataQuery = dataQuery.orderBy(sql`
            CASE
              WHEN ${scholarships.title} ILIKE ${`%${search}%`} THEN 1
              WHEN ${scholarships.description} ILIKE ${`%${search}%`} THEN 2
              ELSE 3
            END
          `);
        } else {
          dataQuery = dataQuery.orderBy(desc(scholarships.createdAt));
        }
        break;
      case 'newest':
      default:
        dataQuery = dataQuery.orderBy(desc(scholarships.createdAt));
        break;
    }
    
    // التصفح
    dataQuery = dataQuery.limit(limit).offset(offset);
    
    const scholarshipsData = await dataQuery;
    
    // إضافة معلومات العلاقات للمنح
    const enhancedScholarships = await Promise.all(scholarshipsData.map(async (scholarship) => {
      // الحصول على معلومات الفئة إذا كان هناك معرف فئة
      let categoryInfo = null;
      if (scholarship.categoryId) {
        const categoryData = await db.select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug
        })
        .from(categories)
        .where(eq(categories.id, scholarship.categoryId))
        .limit(1);
        
        if (categoryData.length > 0) {
          categoryInfo = categoryData[0];
        }
      }
      
      // الحصول على معلومات الدولة إذا كان هناك معرف دولة
      let countryInfo = null;
      if (scholarship.countryId) {
        const countryData = await db.select({
          id: countries.id,
          name: countries.name,
          slug: countries.slug
        })
        .from(countries)
        .where(eq(countries.id, scholarship.countryId))
        .limit(1);
        
        if (countryData.length > 0) {
          countryInfo = countryData[0];
        }
      }
      
      // الحصول على معلومات المستوى إذا كان هناك معرف مستوى
      let levelInfo = null;
      if (scholarship.levelId) {
        const levelData = await db.select({
          id: levels.id,
          name: levels.name,
          slug: levels.slug
        })
        .from(levels)
        .where(eq(levels.id, scholarship.levelId))
        .limit(1);
        
        if (levelData.length > 0) {
          levelInfo = levelData[0];
        }
      }
      
      return {
        ...scholarship,
        category: categoryInfo,
        country: countryInfo,
        level: levelInfo
      };
    }));
    
    // الحصول على خيارات التصفية
    const categoriesData = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug
    }).from(categories).orderBy(categories.name);
    
    const countriesData = await db.select({
      id: countries.id,
      name: countries.name,
      slug: countries.slug
    }).from(countries).orderBy(countries.name);
    
    const levelsData = await db.select({
      id: levels.id,
      name: levels.name,
      slug: levels.slug
    }).from(levels).orderBy(levels.name);
    
    const filterOptions = {
      categories: categoriesData,
      countries: countriesData,
      levels: levelsData
    };
    
    // إرجاع النتائج
    return res.status(200).json({
      success: true,
      scholarships: enhancedScholarships,
      meta: {
        pagination: {
          total: totalScholarships,
          page,
          limit,
          totalPages
        },
        filters: filterOptions
      }
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'خطأ في معلمات الاستعلام',
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المنح الدراسية',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
}