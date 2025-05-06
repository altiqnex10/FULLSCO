import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Globe, Award, GraduationCap } from 'lucide-react';
import { Scholarship } from '@/shared/schema';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isCompact?: boolean;
}

/**
 * مكون يعرض بطاقة منحة دراسية
 * @param scholarship بيانات المنحة الدراسية
 * @param isCompact ما إذا كان العرض مختصر أم كامل
 */
export function ScholarshipCard({ scholarship, isCompact = false }: ScholarshipCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      href={`/scholarships/${scholarship.slug}`}
      className={`group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
        isHovered ? 'ring-2 ring-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {scholarship.thumbnailUrl ? (
          <Image
            src={scholarship.thumbnailUrl}
            alt={scholarship.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-gray-800">
            <GraduationCap className="h-16 w-16 text-blue-300 dark:text-blue-700" />
          </div>
        )}
        
        {/* طبقة التدرج */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        
        {/* شارة المنح المميزة */}
        {scholarship.isFeatured && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            منحة مميزة
          </div>
        )}
        
        {/* معلومات سريعة على الصورة */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center text-sm font-medium">
            <Globe className="w-4 h-4 ml-1 rtl:ml-1 rtl:mr-0" />
            {scholarship.country?.name || scholarship.studyDestination || 'دولي'}
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {scholarship.title}
        </h3>
        
        {!isCompact && (
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-sm">
            {scholarship.description?.substring(0, 120)}...
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {scholarship.categoryId && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
              {scholarship.category?.name || scholarship.fundingType || 'منحة دراسية'}
            </span>
          )}
          
          {scholarship.levelId && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded-full">
              {scholarship.level?.name || 'جميع المستويات'}
            </span>
          )}
          
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full">
            <Award className="inline-block w-3 h-3 mr-1" />
            ممولة
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(scholarship.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
          </span>
          
          <span className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
            <Calendar className="w-4 h-4 ml-1" />
            آخر موعد: {new Date(scholarship.deadline).toLocaleDateString('ar-EG')}
          </span>
        </div>
      </div>
    </Link>
  );
}