import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

// نوع بيانات إعدادات الموقع
export interface SiteSettings {
  id: number;
  siteName: string;
  siteTagline?: string;
  siteDescription?: string;
  rtlDirection: boolean;
  enableDarkMode: boolean;
  defaultLanguage: string;
  // الحقول الأخرى التي نحتاجها
  [key: string]: any;
}

// إنشاء سياق إعدادات الموقع
const SiteSettingsContext = createContext<{
  siteSettings: SiteSettings | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<any>;
  setRtlDirection: (value: boolean) => void;
}>({
  siteSettings: null,
  isLoading: true,
  isError: false,
  refetch: async () => {},
  setRtlDirection: () => {},
});

// ثوابت لاستخدامها في localStorage
const LOCAL_STORAGE_KEY = 'site_settings';
const RTL_STORAGE_KEY = 'rtl_direction';

// مزود إعدادات الموقع
export const SiteSettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // استعلام للحصول على إعدادات الموقع من الخادم
  const { 
    data: settings, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) throw new Error('فشل في استلام إعدادات الموقع');
        return response.json();
      } catch (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
    },
  });
  
  // معالجة القيمة من السيرفر
  const siteSettings = settings || null;

  // وظيفة لتغيير اتجاه RTL
  const setRtlDirection = (value: boolean) => {
    if (!siteSettings) return;
    
    // تحديث الاتجاه في المستند
    document.dir = value ? 'rtl' : 'ltr';
    
    // حفظ الإعداد في localStorage
    localStorage.setItem(RTL_STORAGE_KEY, String(value));
    
    console.log('RTL direction updated to:', value);
  };

  // تطبيق إعدادات RTL وألوان الموقع عند تحميل الإعدادات
  useEffect(() => {
    if (siteSettings) {
      // تحديث localStorage بالإعدادات
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(siteSettings));
      
      // تطبيق إعدادات RTL
      const rtlDirection = siteSettings.rtlDirection;
      document.dir = rtlDirection ? 'rtl' : 'ltr';
      console.log('RTL direction set from API:', rtlDirection);
      
      // تطبيق ألوان الموقع من إعدادات الموقع
      if (siteSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary', hexToHSL(siteSettings.primaryColor));
        console.log('Primary color set:', siteSettings.primaryColor);
      }
      
      if (siteSettings.secondaryColor) {
        document.documentElement.style.setProperty('--accent', hexToHSL(siteSettings.secondaryColor));
        console.log('Secondary color set:', siteSettings.secondaryColor);
      }
      
      if (siteSettings.accentColor) {
        // يمكن استخدام لون accentColor كلون ثالث للتمييز
        document.documentElement.style.setProperty('--info', hexToHSL(siteSettings.accentColor));
        console.log('Accent color set:', siteSettings.accentColor);
      }
    }
  }, [siteSettings]);
  
  // دالة لتحويل اللون من HEX إلى HSL (هو التنسيق المستخدم في متغيرات CSS)
  function hexToHSL(hex: string): string {
    // التأكد من أن اللون يبدأ بـ #
    if (hex.charAt(0) !== '#') {
      hex = '#' + hex;
    }
    
    // تحويل HEX إلى RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  }

  // استرجاع إعدادات RTL من localStorage عند تشغيل التطبيق
  useEffect(() => {
    // إذا كان هناك إعداد RTL في localStorage، استخدمه مباشرةً قبل استجابة API
    const storedRtl = localStorage.getItem(RTL_STORAGE_KEY);
    if (storedRtl !== null) {
      const rtlValue = storedRtl === 'true';
      document.dir = rtlValue ? 'rtl' : 'ltr';
      console.log('RTL direction set from localStorage:', rtlValue);
    }

    // راقب تغييرات localStorage من نوافذ أخرى
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RTL_STORAGE_KEY && e.newValue !== null) {
        const rtlValue = e.newValue === 'true';
        document.dir = rtlValue ? 'rtl' : 'ltr';
        console.log('RTL direction updated from another tab:', rtlValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ 
      siteSettings, 
      isLoading, 
      isError, 
      refetch,
      setRtlDirection
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

// هوك لاستخدام إعدادات الموقع
export const useSiteSettings = () => useContext(SiteSettingsContext);

export default useSiteSettings;