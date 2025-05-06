import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { levels } from '../../../shared/schema';
import { asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // الحصول على جميع المستويات مرتبة حسب الاسم
      const allLevels = await db.query.levels.findMany({
        orderBy: asc(levels.name)
      });
      
      return res.status(200).json(allLevels);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching levels:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}