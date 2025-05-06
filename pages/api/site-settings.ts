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
        siteName: settings.site_name,
        siteDescription: settings.site_description || '',
        siteTagline: settings.site_tagline || '',
        siteEmail: settings.email || '',
        sitePhone: settings.phone || '',
        siteAddress: settings.address || '',
        logoUrl: settings.logo || '/logo.png',
        logoDarkUrl: settings.logo_dark || '/logo-dark.png',
        faviconUrl: settings.favicon || '/favicon.ico',
        theme: {
          primaryColor: settings.primary_color || '#3b82f6',
          secondaryColor: settings.secondary_color || '#8b5cf6',
          accentColor: settings.accent_color || '#10b981',
          enableDarkMode: settings.enable_dark_mode || false,
          rtlDirection: settings.rtl_direction || false,
        },
        socialMedia: {
          facebook: settings.facebook || '',
          twitter: settings.twitter || '',
          instagram: settings.instagram || '',
          linkedin: settings.linkedin || '',
          youtube: settings.youtube || '',
          whatsapp: settings.whatsapp || '',
        },
        layout: {
          homePageLayout: settings.home_page_layout || 'default',
          scholarshipPageLayout: settings.scholarship_page_layout || 'default',
          articlePageLayout: settings.article_page_layout || 'default',
        },
        sections: {
          showHeroSection: settings.show_hero_section || true,
          showFeaturedScholarships: settings.show_featured_scholarships || true,
          showSearchSection: settings.show_search_section || true,
          showCategoriesSection: settings.show_categories_section || true,
          showCountriesSection: settings.show_countries_section || true,
          showLatestArticles: settings.show_latest_articles || true,
          showSuccessStories: settings.show_success_stories || true,
          showNewsletterSection: settings.show_newsletter_section || true,
          showStatisticsSection: settings.show_statistics_section || true,
          showPartnersSection: settings.show_partners_section || true,
        },
        customCss: settings.custom_css || '',
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