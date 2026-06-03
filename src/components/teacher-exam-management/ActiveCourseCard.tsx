interface ActiveCourseCardProps {
  title: string;
  assessments: string;
  students: string;
  color: string;
}

export function ActiveCourseCard({ title, assessments, students, color }: ActiveCourseCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer">
      <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity`}></div>
        <div className="w-16 h-16 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-500 bg-white/5 backdrop-blur-sm shadow-inner"></div>
      </div>
      <div className="p-5 relative">
        <div className="absolute -top-6 left-5">
          <span className="bg-white/95 backdrop-blur-md shadow-sm text-gray-900 text-[11px] font-bold px-3 py-1.5 rounded-full border border-gray-100/80">
            {students}
          </span>
        </div>
        <h4 className="font-extrabold text-gray-900 mt-2">{title}</h4>
        <p className="text-sm font-medium text-gray-500 mt-1">{assessments}</p>
      </div>
    </div>
  );
}
