import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { scholarships, categories, countries, levels } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const slug = req.query.slug as string;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير معرف المنحة الدراسية'
      });
    }
    
    // الحصول على المنحة الدراسية بناءً على الاسم المستعار (slug)
    const scholarshipData = await db.select().from(scholarships)
      .where(eq(scholarships.slug, slug))
      .limit(1);
    
    if (!scholarshipData || scholarshipData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المنحة الدراسية'
      });
    }
    
    const scholarship = scholarshipData[0];
    
    // زيادة عدد المشاهدات
    await db.update(scholarships)
      .set({ views: sql`${scholarships.views} + 1` })
      .where(eq(scholarships.id, scholarship.id));
    
    // الحصول على معلومات إضافية
    let categoryInfo = null;
    if (scholarship.categoryId) {
      const categoryData = await db.select().from(categories)
        .where(eq(categories.id, scholarship.categoryId))
        .limit(1);
      
      if (categoryData.length > 0) {
        categoryInfo = categoryData[0];
      }
    }
    
    let countryInfo = null;
    if (scholarship.countryId) {
      const countryData = await db.select().from(countries)
        .where(eq(countries.id, scholarship.countryId))
        .limit(1);
      
      if (countryData.length > 0) {
        countryInfo = countryData[0];
      }
    }
    
    let levelInfo = null;
    if (scholarship.levelId) {
      const levelData = await db.select().from(levels)
        .where(eq(levels.id, scholarship.levelId))
        .limit(1);
      
      if (levelData.length > 0) {
        levelInfo = levelData[0];
      }
    }
    
    // الحصول على منح ذات صلة
    let relatedScholarships: any[] = [];
    
    if (scholarship.categoryId) {
      relatedScholarships = await db.select({
        id: scholarships.id,
        title: scholarships.title,
        slug: scholarships.slug,
        deadline: scholarships.deadline,
        thumbnailUrl: scholarships.thumbnailUrl,
        isFeatured: scholarships.isFeatured
      })
      .from(scholarships)
      .where(eq(scholarships.categoryId, scholarship.categoryId))
      .where(sql`${scholarships.id} != ${scholarship.id}`)
      .orderBy(sql`RANDOM()`)
      .limit(3);
    }
    
    // إذا لم يتم العثور على منح ذات صلة بناءً على الفئة
    if (relatedScholarships.length === 0) {
      relatedScholarships = await db.select({
        id: scholarships.id,
        title: scholarships.title,
        slug: scholarships.slug,
        deadline: scholarships.deadline,
        thumbnailUrl: scholarships.thumbnailUrl,
        isFeatured: scholarships.isFeatured
      })
      .from(scholarships)
      .where(sql`${scholarships.id} != ${scholarship.id}`)
      .orderBy(sql`RANDOM()`)
      .limit(3);
    }
    
    // إرجاع البيانات
    return res.status(200).json({
      success: true,
      scholarship: {
        ...scholarship,
        category: categoryInfo,
        country: countryInfo,
        level: levelInfo
      },
      relatedScholarships
    });
  } catch (error) {
    console.error('Error fetching scholarship details:', error);
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب تفاصيل المنحة الدراسية',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
}