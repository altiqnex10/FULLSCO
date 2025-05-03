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

  // تطبيق إعدادات RTL عند تحميل الإعدادات
  useEffect(() => {
    if (siteSettings) {
      // تحديث localStorage بالإعدادات
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(siteSettings));
      
      // تطبيق إعدادات RTL
      const rtlDirection = siteSettings.rtlDirection;
      document.dir = rtlDirection ? 'rtl' : 'ltr';
      console.log('RTL direction set from API:', rtlDirection);
    }
  }, [siteSettings]);

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