import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../db';
import { siteSettings } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // الحصول على إعدادات الموقع
      // في هذه الحالة نفترض أن لدينا سجل واحد فقط (id=1) في جدول إعدادات الموقع
      const settings = await db.query.siteSettings.findFirst({
        where: eq(siteSettings.id, 1)
      });

      if (!settings) {
        return res.status(404).json({ error: 'Site settings not found' });
      }

      // إعادة تنسيق البيانات لتناسب واجهة SiteSettings المتوقعة في الـ context
      const formattedSettings = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription || '',
        siteUrl: settings.siteUrl || '',
        siteEmail: settings.email || '',
        sitePhone: settings.phone || '',
        siteAddress: settings.address || '',
        logoUrl: settings.logo || '/logo.png',
        faviconUrl: settings.favicon || '/favicon.ico',
        theme: {
          primaryColor: settings.primaryColor || '#3b82f6',
          secondaryColor: settings.secondaryColor || '#8b5cf6',
          textColor: '#1f2937',
          backgroundColor: '#f9fafb',
        },
        socialMedia: {
          facebook: settings.facebook || '',
          twitter: settings.twitter || '',
          instagram: settings.instagram || '',
          linkedin: settings.linkedin || '',
          youtube: settings.youtube || '',
        },
      };

      return res.status(200).json(formattedSettings);
    } else if (req.method === 'PUT') {
      // تحديث إعدادات الموقع (للمسؤولين فقط)
      // يجب إضافة التحقق من صلاحيات المستخدم هنا
      
      // التنفيذ سيتم لاحقاً عند إضافة مصادقة المستخدم
      return res.status(401).json({ error: 'Unauthorized' });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling site settings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}