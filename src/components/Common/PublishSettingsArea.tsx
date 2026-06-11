import { useEffect, useState } from 'react';
import { Sparkles, ChevronDown, AlertCircle, CalendarIcon, Eye, Shuffle, Loader2, Lock } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';
import { Clock } from 'lucide-react';
import { ToggleSetting } from './ToggleSetting';
import { useQuery } from '@tanstack/react-query';
import { getMyGroups } from '../../api/groups';
import { useUserStore } from '../../stores/use-user-store';
import toast from 'react-hot-toast';

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

export function PublishSettingsArea({ 
  onBack,
  submitLabel = "🚀 Publish to Students",
  isSubmitting = false
}: { 
  onBack: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const allowReview = watch('allowReview');
  const allowImmediateAI = watch('allowImmediateAI');
  const keepForever = watch('keepForever');

  const { currentUser } = useUserStore();
  const isStudent = currentUser?.role?.toLowerCase() === 'student';
  const isFreePlan = currentUser?.subscription_type === 'free';

  const [isFreeLockModalOpen, setIsFreeLockModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { data: response } = useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });
  const groups = response?.data || [];

  useEffect(() => {
    if (isStudent) {
      setValue('availableFrom', new Date());
      setValue('deadline', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    }
  }, [isStudent, setValue]);

  useEffect(() => {
    if (isStudent && groups.length > 0 && !watch('targetGroup')) {
      setValue('targetGroup', groups[0]._id);
    }
  }, [isStudent, groups, setValue, watch]);

  useEffect(() => {
    if (!allowReview && allowImmediateAI) {
      setValue('allowImmediateAI', false);
    }
  }, [allowReview, allowImmediateAI, setValue]);

  const handleToggleKeepForever = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFreePlan) {
      setIsFreeLockModalOpen(true);
      return;
    }

    if (!keepForever) {
      setIsConfirmModalOpen(true);
    } else {
      setValue('keepForever', false);
    }
  };

  const targetGroupVal = watch('targetGroup');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col pt-8 pb-12">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-[32px] leading-[40px] font-bold text-gray-900 mb-2">Publish Settings</h2>
        <p className="text-[16px] text-gray-500">Configure release parameters and AI assistance options before distributing to your cohort.</p>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(30,64,175,0.05)] border border-gray-200">
        
        {!isStudent && (
          <>
            {/* Target Group */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="target-group">Target Group</label>
              <div className="relative">
                <select 
                  id="target-group"
                  {...register('targetGroup')}
                  className={`w-full bg-white border ${errors.targetGroup ? 'border-rose-500' : 'border-gray-200'} rounded-lg py-3 pl-4 pr-10 text-[16px] text-gray-900 appearance-none focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer`}
                >
                  <option value="" disabled>Select a student group or course...</option>
                  {groups.map((group: any) => (
                    <option key={group._id} value={group._id}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              {errors.targetGroup && (
                <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {errors.targetGroup.message as string}
                </p>
              )}
            </div>

            {/* Dates Row */}
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

            <hr className="border-gray-200 mb-8" />
          </>
        )}

        {/* Toggles */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Keep Exam Forever Toggle */}
          <div 
            onClick={handleToggleKeepForever}
            className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200/50 shadow-sm cursor-pointer hover:bg-slate-50/50 transition-colors"
          >
            <div className="pr-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <h3 className="text-[16px] text-gray-900 font-semibold flex items-center gap-1">
                    Keep Exam Forever
                    {isFreePlan && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {isStudent 
                      ? "Save exam forever (Deducts 10 credits/month. Free exams delete in 1 day)" 
                      : "Save exam forever (Deducts 15 credits/month. Free exams delete in 3 days)"}
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-1">
              <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!!keepForever}
                  readOnly
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          <ToggleSetting 
            icon={Eye} 
            title="Allow students to review answers" 
            name="allowReview" 
          />

          <ToggleSetting 
            icon={Shuffle} 
            title="Randomize questions" 
            name="randomizeQuestions" 
          />

          <ToggleSetting 
            icon={Sparkles} 
            title="Allow immediate AI explanation" 
            name="allowImmediateAI" 
            iconClassName="text-sky-500" 
            activeBgClass="peer-checked:bg-sky-500" 
            wrapperClassName={`transition-opacity ${!allowReview ? 'opacity-50 pointer-events-none' : ''}`}
            disabled={!allowReview}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 pt-4">
          <button 
            type="button"
            onClick={onBack}
            className="w-full md:w-auto text-[14px] font-semibold text-gray-600 bg-transparent border border-gray-300 hover:bg-gray-50 py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
          >
            Back to Edit
          </button> 
          <button 
            type="submit"
            onClick={(e) => {
              if (isStudent && !targetGroupVal) {
                e.preventDefault();
                toast.error("Please join a class group first from your dashboard before generating an exam.");
              }
            }}
            disabled={isSubmitting}
            className="w-full md:w-auto text-[14px] font-semibold text-white bg-indigo-700 hover:opacity-90 py-2.5 px-6 rounded-lg shadow-sm transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>

      {/* Free Plan Lock Modal */}
      {isFreeLockModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-full md:w-[50%] border border-gray-100 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-600">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Feature Required</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Keeping practice exams forever is only available on premium plans. 
              Under the free plan, self-generated exams expire after {isStudent ? "1 day" : "3 days"}.
            </p>
            <button
              onClick={() => setIsFreeLockModalOpen(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Deduction Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 md:w-[50%] w-full border border-gray-100 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4 text-yellow-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deduction</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {isStudent 
                ? "Keeping this exam forever will deduct 10 credits monthly from your balance. Do you agree?" 
                : "Keeping this exam forever will deduct 15 credits monthly from your balance. Do you agree?"}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('keepForever', true);
                  setIsConfirmModalOpen(false);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
