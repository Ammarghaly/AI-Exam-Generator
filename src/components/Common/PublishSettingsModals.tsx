import { Lock, AlertCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface Props {
  isFreeLockModalOpen: boolean;
  setIsFreeLockModalOpen: (val: boolean) => void;
  isStudent: boolean;
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: (val: boolean) => void;
}

export function PublishSettingsModals({
  isFreeLockModalOpen,
  setIsFreeLockModalOpen,
  isStudent,
  isConfirmModalOpen,
  setIsConfirmModalOpen
}: Props) {
  const { setValue } = useFormContext();

  return (
    <>
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
    </>
  );
}
