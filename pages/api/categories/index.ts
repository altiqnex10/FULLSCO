import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { categories } from '../../../shared/schema';
import { asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // الحصول على جميع الفئات مرتبة حسب الاسم
      const allCategories = await db.query.categories.findMany({
        orderBy: asc(categories.name)
      });
      
      return res.status(200).json(allCategories);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}