import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { scholarships, categories, levels, countries } from '../../../shared/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // استخراج معايير البحث ومعلومات الصفحات من الاستعلام
      const { 
        categoryId, levelId, countryId, 
        featured, fullyFunded, search,
        page = 1, limit = 10 
      } = req.query;
      
      // تحويل النصوص إلى أرقام للصفحات والحدود
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      
      // التأكد من صحة الأرقام
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
      }
      
      // حساب قيمة الإزاحة
      const offset = (pageNumber - 1) * limitNumber;
      
      // بناء استعلام الفلترة
      let query = db.select().from(scholarships);
      
      // تطبيق الفلاتر إذا كانت موجودة
      const conditions = [];
      
      // فلترة بواسطة الفئة
      if (categoryId) {
        conditions.push(eq(scholarships.categoryId, Number(categoryId)));
      }
      
      // فلترة بواسطة المستوى
      if (levelId) {
        conditions.push(eq(scholarships.levelId, Number(levelId)));
      }
      
      // فلترة بواسطة الدولة
      if (countryId) {
        conditions.push(eq(scholarships.countryId, Number(countryId)));
      }
      
      // فلترة المنح المميزة
      if (featured === 'true') {
        conditions.push(eq(scholarships.isFeatured, true));
      }
      
      // فلترة المنح الممولة بالكامل
      if (fullyFunded === 'true') {
        conditions.push(eq(scholarships.isFullyFunded, true));
      }
      
      // فلترة بواسطة البحث
      if (search && typeof search === 'string') {
        conditions.push(
          sql`${scholarships.title} ILIKE ${'%' + search + '%'} OR ${scholarships.description} ILIKE ${'%' + search + '%'}`
        );
      }
      
      // تطبيق جميع الشروط إذا كانت موجودة
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      // تنفيذ استعلام لحساب العدد الإجمالي للنتائج
      const countResult = await db.select({ count: sql<number>`count(*)` })
        .from(scholarships)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      const totalCount = countResult[0].count;
      const totalPages = Math.ceil(totalCount / limitNumber);
      
      // تنفيذ الاستعلام الرئيسي مع الصفحات
      const results = await query
        .orderBy(desc(scholarships.createdAt))
        .limit(limitNumber)
        .offset(offset);
      
      // الحصول على بيانات العلاقات (الفئات، المستويات، الدول) للمنح
      const scholarshipIds = results.map(s => s.id);
      
      // الحصول على الفئات المرتبطة
      const relatedCategories = scholarshipIds.length > 0 
        ? await db.query.categories.findMany({
            where: sql`${categories.id} IN (${scholarshipIds.map(id => 
              sql`(SELECT ${scholarships.categoryId} FROM ${scholarships} WHERE ${scholarships.id} = ${id})`
            )})`
          })
        : [];
      
      // الحصول على المستويات المرتبطة
      const relatedLevels = scholarshipIds.length > 0 
        ? await db.query.levels.findMany({
            where: sql`${levels.id} IN (${scholarshipIds.map(id => 
              sql`(SELECT ${scholarships.levelId} FROM ${scholarships} WHERE ${scholarships.id} = ${id})`
            )})`
          })
        : [];
      
      // الحصول على الدول المرتبطة
      const relatedCountries = scholarshipIds.length > 0 
        ? await db.query.countries.findMany({
            where: sql`${countries.id} IN (${scholarshipIds.map(id => 
              sql`(SELECT ${scholarships.countryId} FROM ${scholarships} WHERE ${scholarships.id} = ${id})`
            )})`
          })
        : [];
      
      // إنشاء خريطة للعلاقات
      const categoriesMap = relatedCategories.reduce((map, cat) => {
        map[cat.id] = cat;
        return map;
      }, {} as Record<number, typeof relatedCategories[0]>);
      
      const levelsMap = relatedLevels.reduce((map, level) => {
        map[level.id] = level;
        return map;
      }, {} as Record<number, typeof relatedLevels[0]>);
      
      const countriesMap = relatedCountries.reduce((map, country) => {
        map[country.id] = country;
        return map;
      }, {} as Record<number, typeof relatedCountries[0]>);
      
      // تجميع البيانات ليتم إرجاعها
      const enrichedResults = results.map(scholarship => ({
        ...scholarship,
        category: scholarship.categoryId ? categoriesMap[scholarship.categoryId] : null,
        level: scholarship.levelId ? levelsMap[scholarship.levelId] : null,
        country: scholarship.countryId ? countriesMap[scholarship.countryId] : null,
      }));
      
      return res.status(200).json({
        data: enrichedResults,
        pagination: {
          total: totalCount,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
        }
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}