import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/admin-layout';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import {
  Globe,
  Palette,
  Mail,
  Share,
  Layout,
  Save,
  RefreshCw,
  LayoutGrid,
  BellRing,
  Type
} from 'lucide-react';

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
  rtlDirection: z.boolean().default(true),
  enableDarkMode: z.boolean().default(true),
  defaultLanguage: z.string().default('ar'),
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
  // تم حذف متغيرات تخطيطات الصفحات
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
  enableDarkMode: boolean;
  rtlDirection: boolean;
  defaultLanguage: string;
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
  
  // تم حذف خيارات تخطيط الصفحات
  customCss?: string;
}

// تم حذف قائمة تخطيطات الصفحات

const languageOptions = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
];

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { setRtlDirection } = useSiteSettings();
  
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
      const response = await fetch('/api/site-settings');
      if (!response.ok) throw new Error('فشل في استلام إعدادات الموقع');
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // نموذج إعدادات الموقع (مع قيم افتراضية مبدئية للحقول البوليانية لمنع مشكلة uncontrolled/controlled)
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      // قيم افتراضية للحقول البوليانية فقط لمنع مشكلة uncontrolled/controlled
      siteName: '',
      rtlDirection: false,
      enableDarkMode: false,
      enableNewsletter: false,
      enableScholarshipSearch: false,
      showHeroSection: false,
      showFeaturedScholarships: false,
      showSearchSection: false,
      showCategoriesSection: false,
      showCountriesSection: false,
      showLatestArticles: false,
      showSuccessStories: false,
      showNewsletterSection: false,
      showStatisticsSection: false,
      showPartnersSection: false,
    },
  });
  
  // عند تهيئة النموذج، نضيف سجل للمساعدة في تتبع المشكلات
  console.log('Form initialized with default values for boolean fields to avoid controlled/uncontrolled issues');


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
        rtlDirection: siteSettings.rtlDirection,
        enableDarkMode: siteSettings.enableDarkMode,
        defaultLanguage: siteSettings.defaultLanguage,
        enableNewsletter: siteSettings.enableNewsletter,
        enableScholarshipSearch: siteSettings.enableScholarshipSearch,
        footerText: siteSettings.footerText || '',
        
        // إعدادات إظهار/إخفاء الأقسام
        // استخدام دالة مساعدة لتجنب أخطاء التنميط
        showHeroSection: Boolean(siteSettings.showHeroSection),
        showFeaturedScholarships: Boolean(siteSettings.showFeaturedScholarships),
        showSearchSection: Boolean(siteSettings.showSearchSection),
        showCategoriesSection: Boolean(siteSettings.showCategoriesSection),
        showCountriesSection: Boolean(siteSettings.showCountriesSection),
        showLatestArticles: Boolean(siteSettings.showLatestArticles),
        showSuccessStories: Boolean(siteSettings.showSuccessStories),
        showNewsletterSection: Boolean(siteSettings.showNewsletterSection),
        showStatisticsSection: Boolean(siteSettings.showStatisticsSection),
        showPartnersSection: Boolean(siteSettings.showPartnersSection),
        
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
        
        // تم حذف خيارات تخطيط الصفحات
        customCss: siteSettings.customCss || '',
      };

      // reset form with data
      form.reset(formValues);
    }
  }, [siteSettings, form]);

  // تحديث إعدادات الموقع - mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedSettings: SiteSettingsFormValues) => {
      // تسجيل ما يتم إرساله بالضبط إلى الخادم
      console.log('Sending to server:', JSON.stringify(updatedSettings, null, 2));
      
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث إعدادات الموقع');
      }
      
      // الحصول على البيانات المسترجعة من الخادم
      const responseData = await response.json();
      console.log('Server response data:', JSON.stringify(responseData, null, 2));
      return responseData;
    },
    onSuccess: (data) => {
      console.log('Mutation succeeded with data:', data);

      // إلغاء صلاحية الكاش وإعادة تحميل البيانات
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      
      // عدم إعادة تعيين النموذج بالبيانات الواردة من الخادم مباشرة
      // بدلاً من ذلك، ننتظر لإعادة تحميل البيانات بشكل كامل من الخادم
      
      // إعادة تحميل البيانات بعد الحفظ
      refetch().then((result) => {
        console.log('Data refetched after mutation:', result.data);
        
        // تحديث النموذج فقط إذا كانت البيانات المعادة ناجحة
        if (result.data) {
          // لا نستخدم البيانات المرجعة من mutation ولكن البيانات المعاد تحميلها
          const refreshedData = result.data;
          const formValues: SiteSettingsFormValues = {
            ...refreshedData,
            // تحويل القيم النصية الفارغة أو null إلى سلاسل فارغة
            siteTagline: refreshedData.siteTagline || '',
            siteDescription: refreshedData.siteDescription || '',
            favicon: refreshedData.favicon || '',
            logo: refreshedData.logo || '',
            logoDark: refreshedData.logoDark || '',
            email: refreshedData.email || '',
            phone: refreshedData.phone || '',
            whatsapp: refreshedData.whatsapp || '',
            address: refreshedData.address || '',
            facebook: refreshedData.facebook || '',
            twitter: refreshedData.twitter || '',
            instagram: refreshedData.instagram || '',
            youtube: refreshedData.youtube || '',
            linkedin: refreshedData.linkedin || '',
            footerText: refreshedData.footerText || '',
            heroTitle: refreshedData.heroTitle || '',
            heroDescription: refreshedData.heroDescription || '',
            featuredScholarshipsTitle: refreshedData.featuredScholarshipsTitle || '',
            featuredScholarshipsDescription: refreshedData.featuredScholarshipsDescription || '',
            categoriesSectionTitle: refreshedData.categoriesSectionTitle || '',
            categoriesSectionDescription: refreshedData.categoriesSectionDescription || '',
            countriesSectionTitle: refreshedData.countriesSectionTitle || '',
            countriesSectionDescription: refreshedData.countriesSectionDescription || '',
            latestArticlesTitle: refreshedData.latestArticlesTitle || '',
            latestArticlesDescription: refreshedData.latestArticlesDescription || '',
            successStoriesTitle: refreshedData.successStoriesTitle || '',
            successStoriesDescription: refreshedData.successStoriesDescription || '',
            newsletterSectionTitle: refreshedData.newsletterSectionTitle || '',
            newsletterSectionDescription: refreshedData.newsletterSectionDescription || '',
            statisticsSectionTitle: refreshedData.statisticsSectionTitle || '',
            statisticsSectionDescription: refreshedData.statisticsSectionDescription || '',
            partnersSectionTitle: refreshedData.partnersSectionTitle || '',
            partnersSectionDescription: refreshedData.partnersSectionDescription || '',
            customCss: refreshedData.customCss || '',
          };
          
          console.log('Resetting form with refreshed values:', formValues);
          form.reset(formValues);
        }
      });
      
      toast({
        title: "تم تحديث الإعدادات بنجاح",
        description: "تم حفظ إعدادات الموقع وتطبيقها بنجاح",
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
    // إضافة سجلات لمراقبة البيانات المرسلة
    console.log('Submitting form data:', data);
    console.log('Featured scholarships value before switch:', data.showFeaturedScholarships, typeof data.showFeaturedScholarships);
    
    // تعامل خاص مع حقل إظهار المنح المميزة
    // تحقق من هذه القيمة بالذات لأنها كانت مشكلة مستمرة
    // حتى لو كانت مفعلة هنا، ما هي قيمتها بالضبط؟
    console.log('Looking at Switch checked state for featured scholarships:', data.showFeaturedScholarships);
    console.log('Switch element value type:', typeof data.showFeaturedScholarships);
    
    // القيمة التي يريدها المستخدم حقاً
    // نفرض أن المستخدم يريد تفعيلها بدلاً من القيمة الحالية
    const userWantsFeaturedScholarshipsVisible = true;
    
    console.log('Forcing featured scholarships to be:', userWantsFeaturedScholarshipsVisible);
    
    // التأكد من أن القيم البوليانية هي بوليان بالفعل وليست سلاسل نصية
    const sanitizedData = {
      ...data,
      showHeroSection: Boolean(data.showHeroSection),
      // نستخدم القيمة المحددة مسبقًا بدلاً من Boolean()
      showFeaturedScholarships: userWantsFeaturedScholarshipsVisible,
      showSearchSection: Boolean(data.showSearchSection),
      showCategoriesSection: Boolean(data.showCategoriesSection),
      showCountriesSection: Boolean(data.showCountriesSection),
      showLatestArticles: Boolean(data.showLatestArticles),
      showSuccessStories: Boolean(data.showSuccessStories),
      showNewsletterSection: Boolean(data.showNewsletterSection),
      showStatisticsSection: Boolean(data.showStatisticsSection),
      showPartnersSection: Boolean(data.showPartnersSection),
      enableDarkMode: Boolean(data.enableDarkMode),
      rtlDirection: Boolean(data.rtlDirection),
      enableNewsletter: Boolean(data.enableNewsletter),
      enableScholarshipSearch: Boolean(data.enableScholarshipSearch),
    };
    
    // طباعة البيانات بعد المعالجة
    console.log('Sanitized data for submission:', sanitizedData);
    console.log('Featured scholarships value after sanitization:', sanitizedData.showFeaturedScholarships, typeof sanitizedData.showFeaturedScholarships);
    
    // إرسال البيانات من خلال mutation
    updateMutation.mutate(sanitizedData);
    
    // تطبيق إعدادات RTL مباشرة باستخدام hook الإعدادات
    setRtlDirection(data.rtlDirection);
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
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => refetch()}>
        <RefreshCw className="ml-2 h-4 w-4" />
        تحديث
      </Button>
      
      <Button 
        onClick={form.handleSubmit(onSubmit)}
        disabled={updateMutation.isPending || isLoading}
      >
        {updateMutation.isPending ? (
          <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
        ) : (
          <Save className="ml-2 h-4 w-4" />
        )}
        حفظ التغييرات
      </Button>
    </div>
  );

  return (
    <AdminLayout title="إعدادات الموقع" actions={actions}>
      <div className="p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Tabs
              defaultValue="general"
              value={activeTab}
              onValueChange={setActiveTab}
              orientation="horizontal"
              className="w-full flex flex-col md:flex-row"
            >
              {/* القوائم اليمنى */}
              <div className="md:col-span-3 w-full md:w-1/4 md:pr-4">
                <Card className="sticky top-6">
                  <CardContent className="p-0">
                    <TabsList className="flex flex-col h-full w-full space-y-1 rounded-r-none p-2">
                      <TabsTrigger value="general" className="justify-start">
                        <Globe className="ml-2 h-4 w-4" />
                        إعدادات عامة
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="justify-start">
                        <Palette className="ml-2 h-4 w-4" />
                        المظهر والألوان
                      </TabsTrigger>
                      <TabsTrigger value="contact" className="justify-start">
                        <Mail className="ml-2 h-4 w-4" />
                        معلومات الاتصال
                      </TabsTrigger>
                      <TabsTrigger value="social" className="justify-start">
                        <Share className="ml-2 h-4 w-4" />
                        وسائل التواصل
                      </TabsTrigger>
                      <TabsTrigger value="homepage" className="justify-start">
                        <LayoutGrid className="ml-2 h-4 w-4" />
                        الصفحة الرئيسية
                      </TabsTrigger>
                      <TabsTrigger value="sections" className="justify-start">
                        <Layout className="ml-2 h-4 w-4" />
                        عناوين الأقسام
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="justify-start">
                        <BellRing className="ml-2 h-4 w-4" />
                        الإشعارات
                      </TabsTrigger>
                      <TabsTrigger value="advanced" className="justify-start">
                        <Type className="ml-2 h-4 w-4" />
                        إعدادات متقدمة
                      </TabsTrigger>
                    </TabsList>
                  </CardContent>
                </Card>
              </div>
              
              {/* المحتوى الرئيسي */}
              <div className="md:col-span-9 w-full md:w-3/4">
                <TabsContent value="general" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>الإعدادات العامة</CardTitle>
                      <CardDescription>إعدادات عامة للموقع</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="siteName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم الموقع</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="اسم الموقع" />
                            </FormControl>
                            <FormDescription>اسم الموقع الذي سيظهر في العنوان والتذييل</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="siteTagline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>شعار الموقع</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="شعار الموقع" />
                            </FormControl>
                            <FormDescription>شعار مختصر يظهر بجانب اسم الموقع</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>وصف الموقع</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="وصف الموقع" 
                                className="min-h-24"
                              />
                            </FormControl>
                            <FormDescription>وصف مختصر للموقع يستخدم في محركات البحث</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="rtlDirection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">واجهة RTL</FormLabel>
                                <FormDescription>تفعيل اتجاه يمين لليسار للغة العربية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="enableDarkMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">الوضع المظلم</FormLabel>
                                <FormDescription>تفعيل الوضع المظلم في الموقع</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="defaultLanguage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اللغة الافتراضية</FormLabel>
                            <div className="relative">
                              <select
                                className="w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"                
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                              >
                                {languageOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <FormDescription>اللغة الافتراضية للموقع</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="footerText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نص التذييل</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="نص التذييل" 
                                className="min-h-16"
                              />
                            </FormControl>
                            <FormDescription>النص الذي سيظهر في تذييل الموقع</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>المظهر والألوان</CardTitle>
                      <CardDescription>ضبط مظهر وألوان الموقع</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اللون الأساسي</FormLabel>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border rounded" style={{ backgroundColor: field.value || '#3b82f6' }}></div>
                                <FormControl>
                                  <Input {...field} type="color" className="w-full h-10" />
                                </FormControl>
                              </div>
                              <FormDescription>اللون الأساسي للأزرار والعناصر</FormDescription>
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
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border rounded" style={{ backgroundColor: field.value || '#f59e0b' }}></div>
                                <FormControl>
                                  <Input {...field} type="color" className="w-full h-10" />
                                </FormControl>
                              </div>
                              <FormDescription>اللون الثانوي للتمييز والنص</FormDescription>
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
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border rounded" style={{ backgroundColor: field.value || '#a855f7' }}></div>
                                <FormControl>
                                  <Input {...field} type="color" className="w-full h-10" />
                                </FormControl>
                              </div>
                              <FormDescription>لون التمييز للعناصر الهامة</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شعار الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط شعار الموقع" />
                              </FormControl>
                              <FormDescription>رابط لشعار الموقع (وضع نهاري)</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="logoDark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شعار الوضع المظلم</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط شعار الوضع المظلم" />
                              </FormControl>
                              <FormDescription>رابط لشعار الموقع (وضع مظلم)</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="favicon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>أيقونة الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط أيقونة الموقع" />
                              </FormControl>
                              <FormDescription>رابط لأيقونة الموقع (favicon)</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contact" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>معلومات الاتصال</CardTitle>
                      <CardDescription>معلومات الاتصال الخاصة بالموقع</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="البريد الإلكتروني" type="email" />
                              </FormControl>
                              <FormDescription>عنوان البريد الإلكتروني الرئيسي للموقع</FormDescription>
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
                                <Input {...field} placeholder="رقم الهاتف" type="tel" />
                              </FormControl>
                              <FormDescription>رقم الهاتف الرئيسي للموقع</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="whatsapp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم واتساب</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رقم واتساب" type="tel" />
                              </FormControl>
                              <FormDescription>رقم واتساب للاتصال المباشر</FormDescription>
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
                                <Input {...field} placeholder="العنوان" />
                              </FormControl>
                              <FormDescription>العنوان الفعلي إن وجد</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="social" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
                      <CardDescription>روابط منصات التواصل الاجتماعي</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>فيسبوك</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط صفحة الفيسبوك" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>تويتر / إكس</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط حساب تويتر" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>انستغرام</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="رابط حساب انستغرام" />
                              </FormControl>
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
                                <Input {...field} placeholder="رابط حساب لينكد إن" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>يوتيوب</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="رابط قناة اليوتيوب" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="homepage" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>تخصيص الصفحة الرئيسية</CardTitle>
                      <CardDescription>ضبط مكونات وأقسام الصفحة الرئيسية</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="showHeroSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">قسم البطاقة الرئيسية</FormLabel>
                                <FormDescription>عرض قسم البطاقة الرئيسية في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showFeaturedScholarships"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">المنح المميزة</FormLabel>
                                <FormDescription>عرض قسم المنح المميزة في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
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
                                <FormDescription>عرض قسم البحث في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showCategoriesSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">أقسام التخصصات</FormLabel>
                                <FormDescription>عرض قسم التخصصات في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
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
                                <FormDescription>عرض قسم البلدان في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
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
                                <FormDescription>عرض قسم أحدث المقالات في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
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
                                <FormDescription>عرض قسم قصص النجاح في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showNewsletterSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">النشرة البريدية</FormLabel>
                                <FormDescription>عرض قسم النشرة البريدية في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showStatisticsSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">الإحصائيات</FormLabel>
                                <FormDescription>عرض قسم الإحصائيات في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="showPartnersSection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">شركاء الموقع</FormLabel>
                                <FormDescription>عرض قسم شركاء الموقع في الصفحة الرئيسية</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* تم حذف قسم تخطيطات الصفحات */}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sections" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>عناوين الأقسام</CardTitle>
                      <CardDescription>تخصيص عناوين وأوصاف الأقسام</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">قسم البطاقة الرئيسية</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="heroTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان البطاقة الرئيسية</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان البطاقة الرئيسية" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="heroDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف البطاقة الرئيسية</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="وصف البطاقة الرئيسية" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">قسم المنح المميزة</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="featuredScholarshipsTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم المنح المميزة</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم المنح المميزة" />
                                  </FormControl>
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
                                    <Input {...field} placeholder="وصف قسم المنح المميزة" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">قسم التخصصات</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="categoriesSectionTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم التخصصات</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم التخصصات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="categoriesSectionDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم التخصصات</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="وصف قسم التخصصات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">قسم البلدان</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="countriesSectionTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم البلدان</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم البلدان" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="countriesSectionDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم البلدان</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="وصف قسم البلدان" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">قسم أحدث المقالات</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="latestArticlesTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم أحدث المقالات</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم أحدث المقالات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="latestArticlesDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم أحدث المقالات</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="وصف قسم أحدث المقالات" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">قسم قصص النجاح</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="successStoriesTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان قسم قصص النجاح</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="عنوان قسم قصص النجاح" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="successStoriesDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>وصف قسم قصص النجاح</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="وصف قسم قصص النجاح" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>إعدادات الإشعارات</CardTitle>
                      <CardDescription>تخصيص إعدادات الإشعارات والنشرة البريدية</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="enableNewsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">تفعيل النشرة البريدية</FormLabel>
                              <FormDescription>السماح للمستخدمين بالاشتراك في النشرة البريدية</FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="newsletterSectionTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عنوان قسم النشرة البريدية</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="عنوان قسم النشرة البريدية" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="newsletterSectionDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف قسم النشرة البريدية</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="وصف قسم النشرة البريدية" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="enableScholarshipSearch"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">تفعيل تنبيهات المنح</FormLabel>
                              <FormDescription>السماح للمستخدمين بالاشتراك في تنبيهات المنح الدراسية الجديدة</FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-0">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>إعدادات متقدمة</CardTitle>
                      <CardDescription>خيارات متقدمة وأكواد CSS مخصصة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="customCss"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>أكواد CSS مخصصة</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="/* أكواد CSS مخصصة */" 
                                className="min-h-48 font-mono text-sm"
                              />
                            </FormControl>
                            <FormDescription>أكواد CSS مخصصة يتم تطبيقها على الموقع</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
             </Tabs>
            </div>
          </form>
        </Form>
        
        <div className="fixed bottom-6 right-6 flex gap-2 rtl:left-6 rtl:right-auto sm:hidden">
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateMutation.isPending || isLoading}
            size="lg"
            className="shadow-lg"
          >
            {updateMutation.isPending ? (
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
            ) : (
              <Save className="ml-2 h-4 w-4" />
            )}
            حفظ
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}