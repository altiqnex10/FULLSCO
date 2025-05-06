import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { scholarships, categories, levels, countries } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    // التأكد من أن المعرف صالح
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid scholarship ID' });
    }
    
    const scholarshipId = parseInt(id);
    
    if (isNaN(scholarshipId)) {
      return res.status(400).json({ error: 'Invalid scholarship ID format' });
    }
    
    if (req.method === 'GET') {
      // الحصول على المنحة بواسطة المعرف
      const scholarship = await db.query.scholarships.findFirst({
        where: eq(scholarships.id, scholarshipId)
      });
      
      if (!scholarship) {
        return res.status(404).json({ error: 'Scholarship not found' });
      }
      
      // الحصول على بيانات العلاقات (الفئة، المستوى، الدولة)
      const category = scholarship.categoryId 
        ? await db.query.categories.findFirst({
            where: eq(categories.id, scholarship.categoryId)
          })
        : null;
        
      const level = scholarship.levelId
        ? await db.query.levels.findFirst({
            where: eq(levels.id, scholarship.levelId)
          })
        : null;
        
      const country = scholarship.countryId
        ? await db.query.countries.findFirst({
            where: eq(countries.id, scholarship.countryId)
          })
        : null;
      
      // إرجاع المنحة مع بيانات العلاقات
      return res.status(200).json({
        ...scholarship,
        category,
        level,
        country
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching scholarship:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}