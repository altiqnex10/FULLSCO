import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { countries } from '../../../shared/schema';
import { asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // الحصول على جميع الدول مرتبة حسب الاسم
      const allCountries = await db.query.countries.findMany({
        orderBy: asc(countries.name)
      });
      
      return res.status(200).json(allCountries);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}