import { useEffect, useState } from 'react';
import { Sparkles, ChevronDown, AlertCircle, Eye, Shuffle, Loader2, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFormContext } from 'react-hook-form';
import { ToggleSetting } from './ToggleSetting';
import { useQuery } from '@tanstack/react-query';
import { getMyGroups } from '../../api/groups';
import { useUserStore } from '../../stores/use-user-store';
import { PublishSettingsDates } from './PublishSettingsDates';
import { PublishSettingsModals } from './PublishSettingsModals';



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
            <PublishSettingsDates />
          </>
        )}

        {/* Duration field */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="duration-minutes">
            Exam Duration (Minutes)
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              id="duration-minutes"
              min="1"
              placeholder="e.g., 60"
              {...register('durationMinutes', { valueAsNumber: true })}
              className={cn(
                "w-full bg-white border rounded-lg py-3 px-4 text-[16px] text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-sans",
                errors.durationMinutes ? 'border-rose-500' : 'border-gray-200'
              )}
              dir="ltr"
              lang="en"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            The total time allowed for students to complete the exam once they start.
          </p>
          {errors.durationMinutes && (
            <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errors.durationMinutes.message as string}
            </p>
          )}
        </div>

        <hr className="border-gray-200 mb-8" />

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
                  <h3 className="text-[16px] text-gray-900 font-semibold dark:text-gray-400 flex items-center gap-1">
                    Keep Exam Forever
                    {isFreePlan && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-sans" dir="ltr" lang="en">
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

      {/* Modals */}
      <PublishSettingsModals
        isFreeLockModalOpen={isFreeLockModalOpen}
        setIsFreeLockModalOpen={setIsFreeLockModalOpen}
        isStudent={isStudent}
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
      />
    </div>
  );
}
