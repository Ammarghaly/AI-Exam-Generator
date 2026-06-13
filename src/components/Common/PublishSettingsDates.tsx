import { Controller, useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';

const getTimeString = (date: Date | undefined) => {
  if (!date) return "12:00";
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const updateDateWithTime = (date: Date | undefined, timeString: string) => {
  if (!date) return undefined;
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const handleDateSelect = (newDate: Date | undefined, field: any) => {
  if (!newDate) {
    field.onChange(undefined);
    return;
  }
  if (field.value) {
    const finalDate = new Date(newDate);
    finalDate.setHours(field.value.getHours(), field.value.getMinutes(), 0, 0);
    field.onChange(finalDate);
  } else {
    newDate.setHours(12, 0, 0, 0); // Default to 12:00 PM
    field.onChange(newDate);
  }
};

export function PublishSettingsDates() {
  const { formState: { errors } } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Available From</label>
        <Controller
          name="availableFrom"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center bg-white border rounded-lg py-3 px-4 text-[16px] transition-all justify-start text-left font-normal",
                    errors.availableFrom ? 'border-rose-500 text-gray-900' : 'border-gray-200 text-gray-900',
                    !field.value && "text-gray-500",
                    "focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                  {field.value ? format(field.value, "PPP p") : <span>Pick a date & time</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => handleDateSelect(date, field)}
                />
                {field.value && (
                  <div className="p-3 border-t border-gray-100 flex items-center justify-between gap-2 bg-slate-50">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={getTimeString(field.value)}
                      onChange={(e) => field.onChange(updateDateWithTime(field.value, e.target.value))}
                      className="text-sm bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.availableFrom && (
          <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.availableFrom.message as string}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Deadline</label>
        <Controller
          name="deadline"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center bg-white border rounded-lg py-3 px-4 text-[16px] transition-all justify-start text-left font-normal",
                    errors.deadline ? 'border-rose-500 text-gray-900' : 'border-gray-200 text-gray-900',
                    !field.value && "text-gray-500",
                    "focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                  {field.value ? format(field.value, "PPP p") : <span>Pick a date & time</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => handleDateSelect(date, field)}
                />
                {field.value && (
                  <div className="p-3 border-t border-gray-100 flex items-center justify-between gap-2 bg-slate-50">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={getTimeString(field.value)}
                      onChange={(e) => field.onChange(updateDateWithTime(field.value, e.target.value))}
                      className="text-sm bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.deadline && (
          <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.deadline.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
