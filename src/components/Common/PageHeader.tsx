import React from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    icon: React.ElementType;
    text: string;
  };
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, subtitle, badge, rightContent }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-3xl text-gray-900 tracking-tight">{title}</h1>
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              <badge.icon className="w-3 h-3" />
              {badge.text}
            </div>
          )}
        </div>
        {subtitle && <p className="text-sm font-normal text-gray-500 mt-2">{subtitle}</p>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
}
