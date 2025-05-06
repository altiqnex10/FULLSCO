import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  BookOpen, 
  Users, 
  BarChart, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/lib/types';

type SidebarProps = {
  user: User;
  recentContent: { id: number; title: string }[];
};

export function Sidebar({ user, recentContent }: SidebarProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: <Home size={18} /> },
    { path: '/content', label: 'المحتوى', icon: <BookOpen size={18} /> },
    { path: '/users', label: 'المستخدمين', icon: <Users size={18} /> },
    { path: '/stats', label: 'الإحصائيات', icon: <BarChart size={18} /> },
    { path: '/settings', label: 'الإعدادات', icon: <Settings size={18} /> },
  ];

  return (
    <div 
      id="sidebar" 
      className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col bg-white border-l border-neutral-200 h-full w-64 flex-shrink-0`}
    >
      <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-200">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <i className="fas fa-graduation-cap text-white"></i>
          </div>
          <h1 className="text-lg font-bold text-neutral-800">منصة التعليم</h1>
        </div>
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-neutral-500 hover:text-neutral-700"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location === item.path 
                  ? 'bg-primary-light/10 text-primary' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <span className={`w-6 ml-3 ${
                location === item.path ? 'text-primary' : 'text-neutral-400'
              }`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="px-4 mt-8">
          <h2 className="px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">المحتوى الحديث</h2>
          <div className="mt-2 space-y-1">
            {recentContent.map((item) => (
              <Link 
                key={item.id}
                href={`/content/edit/${item.id}`}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-neutral-600 hover:bg-neutral-100"
              >
                <span className="truncate">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mr-3">
            <p className="text-sm font-medium text-neutral-800">{user.name || user.username}</p>
            <p className="text-xs text-neutral-500">{user.role || 'مستخدم'}</p>
          </div>
          <button className="mr-auto text-neutral-400 hover:text-neutral-600">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
