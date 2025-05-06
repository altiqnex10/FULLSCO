import { 
  Users,
  Book,
  Eye,
  Clock
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Stats } from '@/lib/types';

type DashboardStatsProps = {
  stats: Stats;
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers.toLocaleString(),
      icon: <Users className="h-5 w-5 text-primary" />,
      change: stats.weeklyChanges.users,
      bgColor: 'bg-primary-light/10',
    },
    {
      title: 'إجمالي المحتوى',
      value: stats.totalContent.toLocaleString(),
      icon: <Book className="h-5 w-5 text-secondary" />,
      change: stats.weeklyChanges.content,
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'إجمالي المشاهدات',
      value: stats.totalViews.toLocaleString(),
      icon: <Eye className="h-5 w-5 text-accent" />,
      change: stats.weeklyChanges.views,
      bgColor: 'bg-accent/10',
    },
    {
      title: 'متوسط الوقت',
      value: stats.avgTime,
      icon: <Clock className="h-5 w-5 text-yellow-600" />,
      change: stats.weeklyChanges.time,
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">لوحة التحكم</h1>
        <div className="flex space-x-2 space-x-reverse">
          <button className="bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50">
            <i className="fas fa-calendar-alt ml-1"></i>
            الأسبوع الحالي
          </button>
          <button className="bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50">
            <i className="fas fa-download ml-1"></i>
            تصدير
          </button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${item.bgColor} rounded-md p-3`}>
                  {item.icon}
                </div>
                <div className="mr-5">
                  <div className="text-sm font-medium text-neutral-500">{item.title}</div>
                  <div className="mt-1 text-2xl font-semibold text-neutral-800">{item.value}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-500">هذا الأسبوع</div>
                  <div className={`text-sm font-medium ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <i className={`fas fa-arrow-${item.change >= 0 ? 'up' : 'down'} ml-1`}></i>
                    {Math.abs(item.change)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
