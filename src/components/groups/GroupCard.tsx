
interface GroupCardProps {
  title: string;
  studentsCount: number;
  examsCount: number;
  isActive: boolean;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  avatars: string[];
  extraAvatarsCount: number;
}

export default function GroupCard({
  title,
  studentsCount,
  examsCount,
  isActive,
  icon,
  iconBgClass,
  iconTextClass,
  avatars,
  extraAvatarsCount,
}: GroupCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-lg transition-all group relative cursor-pointer">
      <div className="flex justify-between items-start mb-md">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass} ${iconTextClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <button className="p-xs text-outline hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
      <h3 className="font-h2 text-h2 text-on-surface mb-sm">{title}</h3>
      <div className="flex flex-col gap-sm">
        <div className="flex items-center gap-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">person</span>
          <span className="font-body text-body">{studentsCount} Students</span>
        </div>
        <div className="flex items-center gap-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">quiz</span>
          <span className="font-body text-body">{examsCount} Exams Generated</span>
        </div>
      </div>
      <div className="mt-lg pt-md border-t border-outline-variant flex items-center justify-between">
        <div className="flex -space-x-2">
          {avatars.map((avatar, index) => (
            <img 
              key={index} 
              alt="Student" 
              className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover" 
              src={avatar} 
            />
          ))}
          {extraAvatarsCount > 0 && (
            <div className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">
              +{extraAvatarsCount}
            </div>
          )}
        </div>
        <span 
          className={`text-xs font-label px-sm py-xs rounded-full ${
            isActive 
              ? 'text-primary bg-primary-fixed' 
              : 'text-on-surface-variant bg-surface-container-high'
          }`}
        >
          {isActive ? 'Active' : 'Archived'}
        </span>
      </div>
    </div>
  );
}
