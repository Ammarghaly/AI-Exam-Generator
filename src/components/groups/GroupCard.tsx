import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  id: string;
  title: string;
  studentsCount: number;
  examsCount: number;
  isActive: boolean;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  avatars: string[];
  extraAvatarsCount: number;
  onAddExam?: (groupId: string, groupTitle: string) => void;
  isTeacher?: boolean;
}

export default function GroupCard({
  id,
  title,
  studentsCount,
  examsCount,
  isActive,
  icon,
  iconBgClass,
  iconTextClass,
  avatars,
  extraAvatarsCount,
  onAddExam,
  isTeacher = false,
}: GroupCardProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div
      onClick={() => navigate(isTeacher ? `/teacher/groups/${id}` : `/student/groups/${id}`)}
     className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-lg transition-all group relative cursor-pointer">
      <div className="flex justify-between items-start mb-md">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass} ${iconTextClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {isTeacher && (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-xs text-outline hover:text-on-surface transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onAddExam?.(id, title);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add_box</span>
                  <span>Add Exam to Group</span>
                </button>
              </div>
            )}
          </div>
        )}
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
