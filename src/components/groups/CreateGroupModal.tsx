import { useState } from 'react';
import { useModalStore } from '../../stores/use-modal-store';
import { createGroup } from '../../api/groups';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const createGroupSchema = z.object({
  groupName: z
    .string()
    .min(2, { message: 'Group Name must be at least 2 characters long' })
    .max(20, { message: 'Group Name cannot exceed 20 characters' })
    .trim(),
  subject: z
    .string()
    .min(2, { message: 'Subject must be at least 2 characters long' })
    .max(20, { message: 'Subject cannot exceed 20 characters' })
    .trim(),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

export default function CreateGroupModal() {
  const { activeModal, closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupName: '',
      subject: '',
    },
  });

  if (activeModal !== 'createGroup') return null;

  const handleClose = () => {
    reset();
    closeModal();
  };

  const onSubmit = async (data: CreateGroupFormValues) => {
    try {
      setIsLoading(true);

      // Perform API call
      await createGroup(data);

      toast.success('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['myGroups'] });
      handleClose();
    } catch (err: any) {
      console.error('Error creating group:', err);
      const backendError = err?.response?.data?.error;
      const backendMessage = err?.response?.data?.message;
      toast.error(backendError || backendMessage || 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-xl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-lg border border-outline-variant/30 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <h2 className="font-h2 text-h2 text-primary">Create New Group</h2>
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full p-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Form Content */}
          <div className="p-xl flex flex-col gap-lg bg-surface-container-lowest">

            {/* Group Name Field */}
            <div className="flex flex-col gap-xs">
              <label className="font-label text-label text-on-surface" htmlFor="group-name">Group Name</label>
              <input
                {...register('groupName')}
                className={`w-full h-[40px] px-sm bg-surface-container-lowest border ${errors.groupName ? 'border-error focus:border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'} rounded-lg font-body text-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all`}
                id="group-name"
                placeholder="e.g., Advanced Calculus 101"
                type="text"
                disabled={isLoading}
              />
              {errors.groupName && (
                <span className="text-error text-label-sm font-label mt-1">{errors.groupName.message}</span>
              )}
            </div>

            {/* Subject Field */}
            <div className="flex flex-col gap-xs">
              <label className="font-label text-label text-on-surface" htmlFor="subject-name">Subject</label>
              <input
                {...register('subject')}
                className={`w-full h-[40px] px-sm bg-surface-container-lowest border ${errors.subject ? 'border-error focus:border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'} rounded-lg font-body text-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all`}
                id="subject-name"
                placeholder="e.g., Mathematics"
                type="text"
                disabled={isLoading}
              />
              {errors.subject && (
                <span className="text-error text-label-sm font-label mt-1">{errors.subject.message}</span>
              )}
            </div>

            {/* Contextual Helper */}
            <p className="font-label text-label-sm text-on-surface-variant">
              Groups allow you to organize resources and manage student access for a specific topic.
            </p>
          </div>

          {/* Actions */}
          <div className="px-lg py-md border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-sm">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="h-[40px] px-md rounded-lg font-label text-label text-primary border border-outline-variant hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
              type="button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-[40px] px-md rounded-lg font-label text-label text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-xs"
            >
              {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
