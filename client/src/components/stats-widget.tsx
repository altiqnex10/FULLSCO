import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link } from 'wouter';
import { Stats } from '@/lib/types';

type StatsWidgetProps = {
  stats: Stats;
};

export function StatsWidget({ stats }: StatsWidgetProps) {
  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">
          إحصائيات المحتوى
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-600">المحتوى المنشور</span>
              <span className="text-sm font-medium text-neutral-900">{stats.contentStats.published}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2" 
                style={{ width: `${stats.contentStats.published}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-600">المسودات</span>
              <span className="text-sm font-medium text-neutral-900">{stats.contentStats.drafts}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 rounded-full h-2" 
                style={{ width: `${stats.contentStats.drafts}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-600">التفاعل</span>
              <span className="text-sm font-medium text-neutral-900">{stats.contentStats.interaction}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-accent rounded-full h-2" 
                style={{ width: `${stats.contentStats.interaction}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link href="/stats" className="text-sm font-medium text-primary hover:text-primary-dark">
            عرض تقرير مفصل
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
