import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  bgClassName?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actions,
  bgClassName = 'bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/10 dark:to-primary/5'
}) => {
  return (
    <div className={cn('py-8 md:py-12', bgClassName)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            {description && (
              <p className="text-lg text-muted-foreground mt-2 max-w-3xl">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="md:ml-auto mt-4 md:mt-0 flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;