import React from 'react';
import { useFormContext } from 'react-hook-form';

export interface ToggleSettingProps {
  icon: React.ElementType;
  title: string;
  name: string;
  iconClassName?: string;
  activeBgClass?: string;
  wrapperClassName?: string;
  disabled?: boolean;
}

export function ToggleSetting({ 
  icon: Icon, 
  title, 
  name, 
  iconClassName = "text-indigo-600", 
  activeBgClass = "peer-checked:bg-indigo-600",
  wrapperClassName = "", 
  disabled = false 
}: ToggleSettingProps) {
  const { register } = useFormContext();
  
  return (
    <div className={`flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200/50 shadow-sm ${wrapperClassName}`}>
      <div className="pr-6">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconClassName}`} />
          <h3 className="text-[16px] text-gray-900 font-semibold">{title}</h3>
        </div>
      </div>
      <div className="pt-1">
        <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input 
            type="checkbox" 
            className="sr-only peer" 
            {...register(name)}
            disabled={disabled}
          />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${activeBgClass}`}></div>
        </label>
      </div>
    </div>
  );
}
