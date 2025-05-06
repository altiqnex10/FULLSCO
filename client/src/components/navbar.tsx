import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle, 
  Plus 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Notification } from '@/lib/types';

type NavbarProps = {
  onToggleSidebar: () => void;
  notifications: Notification[];
};

export function Navbar({ onToggleSidebar, notifications }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            id="mobile-menu-button"
            className="md:hidden -mr-2"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">فتح القائمة</span>
          </Button>
          
          <form 
            onSubmit={handleSearch} 
            className="relative w-64 mx-4"
          >
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <Input
              type="text"
              className="block w-full pr-10 py-2 bg-neutral-50 placeholder:text-neutral-400"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 left-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
            <span className="sr-only">الإشعارات</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">المساعدة</span>
          </Button>
          
          <Link href="/content/new" className="mr-3">
            <Button 
              variant="outline" 
              className="bg-primary-light/10 border-primary-light text-primary"
            >
              <Plus className="h-4 w-4 ml-1" />
              محتوى جديد
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
