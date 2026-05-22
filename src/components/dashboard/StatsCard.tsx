import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
  badgeText?: string;
  badgeClassName?: string;
  bgShapeClassName?: string;
}

export function StatsCard({ title, value, icon: Icon, iconClassName, className, badgeText, badgeClassName, bgShapeClassName }: StatsCardProps) {
  // If bgShapeClassName is provided, it means we are using the new UI style
  const isNewStyle = !!bgShapeClassName;

  if (isNewStyle) {
    return (
      <div className={cn("bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300", className)}>
        <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110", bgShapeClassName)}></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconClassName)}>
              <Icon className="w-6 h-6" />
            </div>
            {badgeText && (
              <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", badgeClassName)}>
                {badgeText}
              </span>
            )}
          </div>
          <div className="mt-auto">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-4xl font-bold text-gray-900 tracking-tight">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to original style for backwards compatibility if no bgShapeClassName
  return (
    <div className={cn("bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4", className)}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconClassName)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
