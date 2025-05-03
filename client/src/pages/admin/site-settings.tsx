import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, RefreshCw, Palette, Globe, Bell, Mail, Share, Layout, ToggleLeft, Type } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/admin-layout';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// زودج سكيما للتحقق من صحة البيانات
const siteSettingsSchema = z.object({
  siteName: z.string().min(2, 'اسم الموقع يجب أن يكون على الأقل حرفين'),
  siteTagline: z.string().optional(),
  siteDescription: z.string().optional(),
  favicon: z.string().optional(),
  logo: z.string().optional(),
  logoDark: z.string().optional(),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  // تم الاحتفاظ بخيار RTL وحذف الوضع المظلم واللغة الافتراضية
  rtlDirection: z.boolean().default(true),
  enableNewsletter: z.boolean().default(true),
  enableScholarshipSearch: z.boolean().default(true),
  footerText: z.string().optional(),
  
  // إعدادات إظهار/إخفاء الأقسام
  showHeroSection: z.boolean().default(true),
  showFeaturedScholarships: z.boolean().default(true),
  showSearchSection: z.boolean().default(true),
  showCategoriesSection: z.boolean().default(true),
  showCountriesSection: z.boolean().default(true),
  showLatestArticles: z.boolean().default(true),
  showSuccessStories: z.boolean().default(true),
  showNewsletterSection: z.boolean().default(true),
  showStatisticsSection: z.boolean().default(true),
  showPartnersSection: z.boolean().default(true),
  
  // عناوين وأوصاف الأقسام
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  featuredScholarshipsTitle: z.string().optional(),
  featuredScholarshipsDescription: z.string().optional(),
  categoriesSectionTitle: z.string().optional(),
  categoriesSectionDescription: z.string().optional(),
  countriesSectionTitle: z.string().optional(),
  countriesSectionDescription: z.string().optional(),
  latestArticlesTitle: z.string().optional(),
  latestArticlesDescription: z.string().optional(),
  successStoriesTitle: z.string().optional(),
  successStoriesDescription: z.string().optional(),
  newsletterSectionTitle: z.string().optional(),
  newsletterSectionDescription: z.string().optional(),
  statisticsSectionTitle: z.string().optional(),
  statisticsSectionDescription: z.string().optional(),
  partnersSectionTitle: z.string().optional(),
  partnersSectionDescription: z.string().optional(),
  
  // خيارات تخطيط الصفحات
  homePageLayout: z.string().default('default'),
  scholarshipPageLayout: z.string().default('default'),
  articlePageLayout: z.string().default('default'),
  customCss: z.string().optional(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

// واجهة لإعدادات الموقع
interface SiteSetting {
  id: number;
  siteName: string;
  siteTagline?: string;
  siteDescription?: string;
  favicon?: string;
  logo?: string;
  logoDark?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  enableDarkMode: boolean;  // لا نزال نحتفظ بها في الواجهة للتعامل مع البيانات القادمة من API
  rtlDirection: boolean;    // لا نزال نحتفظ بها في الواجهة للتعامل مع البيانات القادمة من API
  defaultLanguage: string;  // لا نزال نحتفظ بها في الواجهة للتعامل مع البيانات القادمة من API
  enableNewsletter: boolean;
  enableScholarshipSearch: boolean;
  footerText?: string;
  
  // إعدادات إظهار/إخفاء الأقسام
  showHeroSection?: boolean;
  showFeaturedScholarships?: boolean;
  showSearchSection?: boolean;
  showCategoriesSection?: boolean;
  showCountriesSection?: boolean;
  showLatestArticles?: boolean;
  showSuccessStories?: boolean;
  showNewsletterSection?: boolean;
  showStatisticsSection?: boolean;
  showPartnersSection?: boolean;
  
  // عناوين وأوصاف الأقسام
  heroTitle?: string;
  heroDescription?: string;
  featuredScholarshipsTitle?: string;
  featuredScholarshipsDescription?: string;
  categoriesSectionTitle?: string;
  categoriesSectionDescription?: string;
  countriesSectionTitle?: string;
  countriesSectionDescription?: string;
  latestArticlesTitle?: string;
  latestArticlesDescription?: string;
  successStoriesTitle?: string;
  successStoriesDescription?: string;
  newsletterSectionTitle?: string;
  newsletterSectionDescription?: string;
  statisticsSectionTitle?: string;
  statisticsSectionDescription?: string;
  partnersSectionTitle?: string;
  partnersSectionDescription?: string;
  
  // خيارات تخطيط الصفحات
  homePageLayout?: string;
  scholarshipPageLayout?: string;
  articlePageLayout?: string;
  customCss?: string;
}

// قائمة تخطيطات الصفحة الرئيسية
const homePageLayouts = [
  { value: 'default', label: 'التخطيط الافتراضي' },
  { value: 'modern', label: 'التخطيط الحديث' },
  { value: 'minimal', label: 'التخطيط البسيط' },
];

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // استلام إعدادات الموقع من الخادم
  const { 
    data: siteSettings, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<SiteSetting>({
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
    enabled: isAuthenticated,
  });

  console.log('Site settings loaded:', siteSettings);
  console.log('Show hero section:', siteSettings?.showHeroSection);
  console.log('Show categories section:', siteSettings?.showCategoriesSection);
  console.log('Show featured scholarships:', siteSettings?.showFeaturedScholarships);

  // نموذج إعدادات الموقع
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: '',
      rtlDirection: true,
      enableNewsletter: true,
      enableScholarshipSearch: true,
      showHeroSection: true,
      showFeaturedScholarships: true,
      showSearchSection: true,
      showCategoriesSection: true,
      showCountriesSection: true,
      showLatestArticles: true,
      showSuccessStories: true,
      showNewsletterSection: true,
      showStatisticsSection: true,
      showPartnersSection: true,
      homePageLayout: 'default',
      scholarshipPageLayout: 'default',
      articlePageLayout: 'default',
    },
  });

  // تحديث قيم النموذج عند استلام البيانات
  useEffect(() => {
    if (siteSettings) {
      // تعيين القيم الافتراضية للحقول التي لم يتم تعيينها في البيانات المستلمة
      const formValues: SiteSettingsFormValues = {
        siteName: siteSettings.siteName,
        siteTagline: siteSettings.siteTagline || '',
        siteDescription: siteSettings.siteDescription || '',
        favicon: siteSettings.favicon || '',
        logo: siteSettings.logo || '',
        logoDark: siteSettings.logoDark || '',
        email: siteSettings.email || '',
        phone: siteSettings.phone || '',
        whatsapp: siteSettings.whatsapp || '',
        address: siteSettings.address || '',
        facebook: siteSettings.facebook || '',
        twitter: siteSettings.twitter || '',
        instagram: siteSettings.instagram || '',
        youtube: siteSettings.youtube || '',
        linkedin: siteSettings.linkedin || '',
        primaryColor: siteSettings.primaryColor || '#3b82f6',
        secondaryColor: siteSettings.secondaryColor || '#f59e0b',
        accentColor: siteSettings.accentColor || '#a855f7',
        // تم الاحتفاظ بخيار RTL وحذف الوضع المظلم واللغة الافتراضية
        rtlDirection: siteSettings.rtlDirection,
        enableNewsletter: siteSettings.enableNewsletter,
        enableScholarshipSearch: siteSettings.enableScholarshipSearch,
        footerText: siteSettings.footerText || '',
        
        // إعدادات إظهار/إخفاء الأقسام
        showHeroSection: siteSettings.showHeroSection ?? true,
        showFeaturedScholarships: siteSettings.showFeaturedScholarships ?? true,
        showSearchSection: siteSettings.showSearchSection ?? true,
        showCategoriesSection: siteSettings.showCategoriesSection ?? true,
        showCountriesSection: siteSettings.showCountriesSection ?? true,
        showLatestArticles: siteSettings.showLatestArticles ?? true,
        showSuccessStories: siteSettings.showSuccessStories ?? true,
        showNewsletterSection: siteSettings.showNewsletterSection ?? true,
        showStatisticsSection: siteSettings.showStatisticsSection ?? true,
        showPartnersSection: siteSettings.showPartnersSection ?? true,
        
        // عناوين وأوصاف الأقسام
        heroTitle: siteSettings.heroTitle || '',
        heroDescription: siteSettings.heroDescription || '',
        featuredScholarshipsTitle: siteSettings.featuredScholarshipsTitle || '',
        featuredScholarshipsDescription: siteSettings.featuredScholarshipsDescription || '',
        categoriesSectionTitle: siteSettings.categoriesSectionTitle || '',
        categoriesSectionDescription: siteSettings.categoriesSectionDescription || '',
        countriesSectionTitle: siteSettings.countriesSectionTitle || '',
        countriesSectionDescription: siteSettings.countriesSectionDescription || '',
        latestArticlesTitle: siteSettings.latestArticlesTitle || '',
        latestArticlesDescription: siteSettings.latestArticlesDescription || '',
        successStoriesTitle: siteSettings.successStoriesTitle || '',
        successStoriesDescription: siteSettings.successStoriesDescription || '',
        newsletterSectionTitle: siteSettings.newsletterSectionTitle || '',
        newsletterSectionDescription: siteSettings.newsletterSectionDescription || '',
        statisticsSectionTitle: siteSettings.statisticsSectionTitle || '',
        statisticsSectionDescription: siteSettings.statisticsSectionDescription || '',
        partnersSectionTitle: siteSettings.partnersSectionTitle || '',
        partnersSectionDescription: siteSettings.partnersSectionDescription || '',
        
        // خيارات تخطيط الصفحات
        homePageLayout: siteSettings.homePageLayout || 'default',
        scholarshipPageLayout: siteSettings.scholarshipPageLayout || 'default',
        articlePageLayout: siteSettings.articlePageLayout || 'default',
        customCss: siteSettings.customCss || '',
      };

      // reset form with data
      form.reset(formValues);
    }
  }, [siteSettings, form]);

  // تحديث إعدادات الموقع - mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedSettings: SiteSettingsFormValues) => {
      // نستخدم القيم المحدثة من النموذج بما في ذلك rtlDirection
      const finalSettings = {
        ...updatedSettings,
        enableDarkMode: siteSettings?.enableDarkMode ?? true,
        defaultLanguage: siteSettings?.defaultLanguage ?? 'ar',
      };
      
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSettings),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث إعدادات الموقع');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "تم تحديث الإعدادات بنجاح",
        description: "تم حفظ إعدادات الموقع بنجاح",
      });
    },
    onError: (error) => {
      console.error('Error updating site settings:', error);
      toast({
        title: "خطأ في تحديث الإعدادات",
        description: "حدث خطأ أثناء محاولة تحديث إعدادات الموقع",
        variant: "destructive",
      });
    },
  });

  // تقديم النموذج
  const onSubmit = (data: SiteSettingsFormValues) => {
    console.log('Form submitted with values:', data);
    console.log('RTL direction setting:', data.rtlDirection);
    
    // إرسال البيانات من خلال mutation
    updateMutation.mutate(data);
    
    // تطبيق إعدادات RTL مباشرة
    if (document.dir !== (data.rtlDirection ? 'rtl' : 'ltr')) {
      console.log('Updating document direction to:', data.rtlDirection ? 'rtl' : 'ltr');
      document.dir = data.rtlDirection ? 'rtl' : 'ltr';
    }
  };
  
  // عرض شاشة التحميل
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        جاري التحميل...
      </div>
    );
  }
  
  // تحضير أزرار الإجراءات لشريط العنوان
  const actions = (
    <>
      <Button variant="outline" onClick={() => refetch()}>
        <RefreshCw className="ml-2 h-4 w-4" />
        تحديث
      </Button>
      
      <Button 
        onClick={form.handleSubmit(onSubmit)}
        disabled={updateMutation.isPending || isLoading}
      >
        {updateMutation.isPending ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
        ) : (
          <Save className="ml-2 h-4 w-4" />
        )}
        حفظ التغييرات
      </Button>
    </>
  );

  return (
    <AdminLayout title="إعدادات الموقع" actions={actions}>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <ScrollArea className="pb-4">
                      <TabsList className="w-full justify-start mb-4 overflow-x-auto">
                        <TabsTrigger value="general">
                          <Globe className="ml-2 h-4 w-4" />
                          إعدادات عامة
                        </TabsTrigger>
                        <TabsTrigger value="appearance">
                          <Palette className="ml-2 h-4 w-4" />
                          المظهر والألوان
                        </TabsTrigger>
                        <TabsTrigger value="contact">
                          <Mail className="ml-2 h-4 w-4" />
                          معلومات الاتصال
                        </TabsTrigger>
                        <TabsTrigger value="social">
                          <Share className="ml-2 h-4 w-4" />
                          التواصل الاجتماعي
                        </TabsTrigger>
                        <TabsTrigger value="homepage">
                          <Layout className="ml-2 h-4 w-4" />
                          الصفحة الرئيسية
                        </TabsTrigger>
                        <TabsTrigger value="sections">
                          <ToggleLeft className="ml-2 h-4 w-4" />
                          الأقسام والمحتوى
                        </TabsTrigger>
                        <TabsTrigger value="advanced">
                          <Type className="ml-2 h-4 w-4" />
                          إعدادات متقدمة
                        </TabsTrigger>
                      </TabsList>
                    </ScrollArea>
                    
                    {/* إعدادات عامة */}
                    <TabsContent value="general" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="siteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اسم الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="أدخل اسم الموقع" />
                              </FormControl>
                              <FormDescription>
                                الاسم الرئيسي للموقع الذي سيظهر للزوار
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="siteTagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شعار الموقع النصي</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="شعار قصير للموقع" />
                              </FormControl>
                              <FormDescription>
                                جملة قصيرة تصف الموقع وتظهر في الهيدر
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>وصف الموقع</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="وصف مختصر للموقع" className="min-h-24" />
                            </FormControl>
                            <FormDescription>
                              وصف للموقع يستخدم في نتائج البحث ووسائل التواصل الاجتماعي
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="rtlDirection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">اتجاه RTL</FormLabel>
                                <FormDescription>
                                  استخدام اتجاه من اليمين إلى اليسار للموقع
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="footerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نص التذييل</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="© 2025 اسم الموقع. جميع الحقوق محفوظة." />
                            </FormControl>
                            <FormDescription>
                              النص الذي سيظهر في تذييل الموقع
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    {/* المظهر والألوان */}
                    <TabsContent value="appearance" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شعار الموقع (الوضع الفاتح)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط صورة الشعار" />
                              </FormControl>
                              <FormDescription>
                                صورة شعار الموقع في الوضع الفاتح
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="logoDark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شعار الموقع (الوضع المظلم)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط صورة الشعار للوضع المظلم" />
                              </FormControl>
                              <FormDescription>
                                صورة شعار الموقع في الوضع المظلم
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="favicon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>أيقونة الموقع (Favicon)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="رابط أيقونة الموقع" />
                            </FormControl>
                            <FormDescription>
                              الأيقونة الصغيرة التي تظهر في علامة التبويب للمتصفح
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اللون الرئيسي</FormLabel>
                              <div className="flex">
                                <FormControl>
                                  <Input {...field} type="text" placeholder="#3b82f6" />
                                </FormControl>
                                <Input
                                  type="color"
                                  value={field.value || '#3b82f6'}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="w-12 p-1 mr-2"
                                />
                              </div>
                              <FormDescription>
                                اللون الرئيسي للعناصر التفاعلية والأزرار
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="secondaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اللون الثانوي</FormLabel>
                              <div className="flex">
                                <FormControl>
                                  <Input {...field} type="text" placeholder="#f59e0b" />
                                </FormControl>
                                <Input
                                  type="color"
                                  value={field.value || '#f59e0b'}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="w-12 p-1 mr-2"
                                />
                              </div>
                              <FormDescription>
                                اللون الثانوي المستخدم للتأكيد والإبراز
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accentColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>لون التمييز</FormLabel>
                              <div className="flex">
                                <FormControl>
                                  <Input {...field} type="text" placeholder="#a855f7" />
                                </FormControl>
                                <Input
                                  type="color"
                                  value={field.value || '#a855f7'}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="w-12 p-1 mr-2"
                                />
                              </div>
                              <FormDescription>
                                لون تمييز إضافي للعناصر المهمة
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="homePageLayout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>تخطيط الصفحة الرئيسية</FormLabel>
                              <div className="space-y-2">
                                {homePageLayouts.map((layout) => (
                                  <div key={layout.value} className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                      <input
                                        type="radio"
                                        id={`home-layout-${layout.value}`}
                                        value={layout.value}
                                        checked={field.value === layout.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="h-4 w-4"
                                      />
                                    </FormControl>
                                    <label
                                      htmlFor={`home-layout-${layout.value}`}
                                      className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                      {layout.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <FormDescription>
                                نمط تخطيط الصفحة الرئيسية
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="scholarshipPageLayout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>تخطيط صفحة المنح</FormLabel>
                              <div className="space-y-2">
                                {homePageLayouts.map((layout) => (
                                  <div key={layout.value} className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                      <input
                                        type="radio"
                                        id={`scholarship-layout-${layout.value}`}
                                        value={layout.value}
                                        checked={field.value === layout.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="h-4 w-4"
                                      />
                                    </FormControl>
                                    <label
                                      htmlFor={`scholarship-layout-${layout.value}`}
                                      className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                      {layout.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <FormDescription>
                                نمط تخطيط صفحة المنح الدراسية
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="articlePageLayout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>تخطيط صفحة المقالات</FormLabel>
                              <div className="space-y-2">
                                {homePageLayouts.map((layout) => (
                                  <div key={layout.value} className="flex items-center space-x-2 space-x-reverse">
                                    <FormControl>
                                      <input
                                        type="radio"
                                        id={`article-layout-${layout.value}`}
                                        value={layout.value}
                                        checked={field.value === layout.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="h-4 w-4"
                                      />
                                    </FormControl>
                                    <label
                                      htmlFor={`article-layout-${layout.value}`}
                                      className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                      {layout.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <FormDescription>
                                نمط تخطيط صفحة المقالات
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    {/* معلومات الاتصال */}
                    <TabsContent value="contact" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="info@example.com" />
                              </FormControl>
                              <FormDescription>
                                البريد الإلكتروني الرسمي للموقع
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم الهاتف</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+123456789" />
                              </FormControl>
                              <FormDescription>
                                رقم الهاتف للتواصل
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="whatsapp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>واتساب</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+123456789" />
                              </FormControl>
                              <FormDescription>
                                رقم واتساب للتواصل (مع رمز البلد)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>العنوان</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="العنوان الفعلي" />
                              </FormControl>
                              <FormDescription>
                                العنوان الفعلي للمكتب أو المقر
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    {/* التواصل الاجتماعي */}
                    <TabsContent value="social" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>فيسبوك</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://facebook.com/username" />
                              </FormControl>
                              <FormDescription>
                                رابط صفحة الفيسبوك
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>تويتر / اكس</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://twitter.com/username" />
                              </FormControl>
                              <FormDescription>
                                رابط حساب تويتر / اكس
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>انستغرام</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://instagram.com/username" />
                              </FormControl>
                              <FormDescription>
                                رابط حساب الانستغرام
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="youtube"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>يوتيوب</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://youtube.com/channel/id" />
                              </FormControl>
                              <FormDescription>
                                رابط قناة اليوتيوب
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>لينكد إن</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://linkedin.com/company/name" />
                              </FormControl>
                              <FormDescription>
                                رابط صفحة لينكد إن
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    {/* الصفحة الرئيسية */}
                    <TabsContent value="homepage" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="heroTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عنوان قسم الهيرو</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="العنوان الرئيسي للصفحة الرئيسية" />
                              </FormControl>
                              <FormDescription>
                                العنوان الرئيسي للصفحة الرئيسية
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="heroDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف قسم الهيرو</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="نص وصفي قصير" className="min-h-20" />
                              </FormControl>
                              <FormDescription>
                                نص وصفي قصير يظهر تحت العنوان في الصفحة الرئيسية
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showHeroSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم الهيرو</FormLabel>
                                <FormDescription>
                                  عرض أو إخفاء قسم الهيرو في الصفحة الرئيسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showSearchSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم البحث</FormLabel>
                                <FormDescription>
                                  عرض أو إخفاء قسم البحث في الصفحة الرئيسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    {/* الأقسام والمحتوى */}
                    <TabsContent value="sections" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="showFeaturedScholarships"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">المنح الدراسية المميزة</FormLabel>
                                <FormDescription>
                                  عرض قسم المنح الدراسية المميزة في الصفحة الرئيسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showCategoriesSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم التصنيفات</FormLabel>
                                <FormDescription>
                                  عرض قسم تصنيفات المنح الدراسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showCountriesSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم البلدان</FormLabel>
                                <FormDescription>
                                  عرض قسم بلدان المنح الدراسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showLatestArticles"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">أحدث المقالات</FormLabel>
                                <FormDescription>
                                  عرض قسم أحدث المقالات في الصفحة الرئيسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showSuccessStories"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قصص النجاح</FormLabel>
                                <FormDescription>
                                  عرض قسم قصص النجاح في الصفحة الرئيسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showNewsletterSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم النشرة البريدية</FormLabel>
                                <FormDescription>
                                  عرض قسم الاشتراك في النشرة البريدية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showStatisticsSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم الإحصائيات</FormLabel>
                                <FormDescription>
                                  عرض قسم الإحصائيات في الصفحة الرئيسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showPartnersSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم الشركاء</FormLabel>
                                <FormDescription>
                                  عرض قسم الشركاء والرعاة في الصفحة الرئيسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                                            
                      <Separator />
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="featuredScholarshipsTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عنوان قسم المنح المميزة</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="المنح الدراسية المميزة" />
                              </FormControl>
                              <FormDescription>
                                عنوان قسم المنح المميزة في الصفحة الرئيسية
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="featuredScholarshipsDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف قسم المنح المميزة</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="أبرز المنح الدراسية المتاحة حالياً" />
                              </FormControl>
                              <FormDescription>
                                وصف قصير لقسم المنح المميزة
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="categoriesSectionTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عنوان قسم التصنيفات</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="تصفح حسب التخصص" />
                              </FormControl>
                              <FormDescription>
                                عنوان قسم التصنيفات في الصفحة الرئيسية
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="categoriesSectionDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف قسم التصنيفات</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="اختر المنح المناسبة حسب مجال دراستك" />
                              </FormControl>
                              <FormDescription>
                                وصف قصير لقسم التصنيفات
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    {/* إعدادات متقدمة */}
                    <TabsContent value="advanced" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-1">
                        <FormField
                          control={form.control}
                          name="enableNewsletter"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">النشرة البريدية</FormLabel>
                                <FormDescription>
                                  تفعيل ميزة النشرة البريدية في الموقع
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="enableScholarshipSearch"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">البحث عن المنح</FormLabel>
                                <FormDescription>
                                  تفعيل ميزة البحث عن المنح الدراسية
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="customCss"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CSS مخصص</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="/* أضف أكواد CSS مخصصة هنا */" className="min-h-32 font-mono" />
                              </FormControl>
                              <FormDescription>
                                أكواد CSS مخصصة للتحكم في مظهر الموقع
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end space-x-4 space-x-reverse">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      disabled={updateMutation.isPending}
                    >
                      إلغاء التغييرات
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                      ) : null}
                      حفظ الإعدادات
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}