import { useState, useEffect } from 'react';
import { useLocation, Link, Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '@/components/admin/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Loader2,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Sun,
  Moon,
  Home,
  Plus,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from '@/components/notifications/notification-provider';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}

const AdminLayout = ({ children, title, actions, breadcrumbs }: AdminLayoutProps) => {
  const { isLoading: authLoading, isAuthenticated, isAdmin, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    } else if (!authLoading && isAuthenticated && !isAdmin) {
      // إذا كان المستخدم مسجل دخول ولكن ليس لديه صلاحية مدير
      navigate('/');
    }

    // تحقق من وضع السمة (theme)
    const savedTheme = localStorage.getItem('admin-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  // تبديل وضع السمة
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // في حالة جاري التحميل
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-gray-900">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <p className="text-muted-foreground animate-pulse font-medium">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  // في حالة عدم تسجيل الدخول أو ليس مدير
  if (!isAuthenticated || !isAdmin) {
    return null; // سيتم التوجيه بواسطة useEffect
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // تم إزالة قائمة الإجراءات السريعة حيث أصبحت أزرار الإضافة موجودة داخل كل صفحة

  return (
    <div className={`min-h-screen bg-background dark:bg-gray-900 flex text-foreground dark:text-gray-100`}>
      {/* السايدبار - الإصدار الحالي */}
      <Sidebar 
        isMobileOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* المحتوى الرئيسي */}
      <main 
        className={cn(
          "flex-1 min-h-screen transition-all duration-300 flex flex-col",
          !isMobile && (document.dir === "rtl" ? "mr-64" : "ml-64"),
          "w-full max-w-full" // إضافة عرض كامل للشاشة
        )}
      >
        {/* الهيدر */}
        <header className="sticky top-0 z-30 border-b bg-background/95 dark:bg-gray-900/95 backdrop-blur supports-backdrop-blur:bg-background/60 py-3 px-3 md:px-4 shadow-sm w-full">
          <div className="flex items-center justify-between w-full mx-auto">
            <div className="flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={document.dir === "rtl" ? "ml-2" : "mr-2"}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="فتح القائمة"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">  
              {/* زر تبديل الثيم */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="md:ml-1"
                title={theme === 'light' ? 'الوضع المظلم' : 'الوضع المضيء'}
              >
                {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
              
              {/* قائمة المستخدم */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user && typeof user === 'object' ? (user.username || 'AD').substring(0, 2).toUpperCase() : 'AD'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={document.dir === "rtl" ? "end" : "start"} className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user && typeof user === 'object' && user.fullName ? user.fullName : 'مدير النظام'}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {user && typeof user === 'object' && user.email ? user.email : 'admin@fullsco.com'}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate('/admin/profile')}
                  >
                    <User className={`${document.dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate('/admin/site-settings')}
                  >
                    <Settings className={`${document.dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    إعدادات الموقع
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center cursor-pointer">
                      <Home className={`${document.dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                      العودة للموقع
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center text-red-500 hover:text-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className={`${document.dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* زر وشريط الإجراءات - إذا كانت موجودة */}
              {actions && (
                <>
                  <Separator orientation="vertical" className="h-6 mx-1 md:mx-2 hidden sm:block" />
                  <div className="flex items-center sm:gap-2">
                    {actions}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* مسار التنقل */}
        {breadcrumbs && (
          <div className="bg-muted/30 dark:bg-gray-800/30 px-3 md:px-4 py-2 text-sm text-muted-foreground">
            {breadcrumbs}
          </div>
        )}

        {/* ناڤ بار مبسط للجوال */}
        {isMobile && (
          <div className="fixed bottom-0 right-0 left-0 z-30 bg-background/95 dark:bg-gray-900/95 backdrop-blur supports-backdrop-blur:bg-background/60 border-t py-2 px-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center justify-center h-auto py-1 px-3 gap-1"
                onClick={() => navigate('/admin')}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-xs">الرئيسية</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center justify-center h-auto py-1 px-3 gap-1"
                onClick={() => navigate('/admin/scholarships')}
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-xs">المنح</span>
              </Button>
              
              <div className="-mt-8">
                <Button 
                  size="lg" 
                  className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
                  onClick={() => navigate('/admin/scholarships/create')}
                >
                  <Plus className="h-7 w-7" />
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center justify-center h-auto py-1 px-3 gap-1"
                onClick={() => navigate('/admin/posts')}
              >
                <Bell className="h-5 w-5" />
                <span className="text-xs">المقالات</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center justify-center h-auto py-1 px-3 gap-1"
                onClick={() => navigate('/admin/site-settings')}
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs">الإعدادات</span>
              </Button>
            </div>
          </div>
        )}

        {/* المحتوى */}
        <div className={cn(
          "flex-grow p-0 md:p-4 lg:p-6 overflow-x-hidden max-w-full w-full",
          // إضافة مساحة أسفل الصفحة عند وجود شريط التنقل السفلي للجوال
          isMobile && "pb-20"
        )}>
          <div className="w-full max-w-full min-w-0 mx-auto">
            {children}
          </div>
        </div>
        
        {/* تذييل الصفحة */}
        <footer className={cn(
          "py-3 px-6 text-center border-t text-sm text-muted-foreground",
          // إخفاء تذييل الصفحة على الجوال لتوفير مساحة
          isMobile && "hidden"
        )}>
          <p>© {new Date().getFullYear()} FULLSCO. جميع الحقوق محفوظة.</p>
        </footer>
      </main>
      
      {/* مكون الإشعارات */}
      <Toaster />
    </div>
  );
};

export default AdminLayout;