import { ActiveCourseCard } from './ActiveCourseCard';

const COURSES_DATA = [
  { title: 'Quantum Mechanics', assessments: '4 Active Assessments', students: '32 Students', color: 'from-blue-600/30 to-indigo-600/30' },
  { title: 'Macroeconomics 101', assessments: '2 Active Assessments', students: '48 Students', color: 'from-emerald-600/30 to-teal-600/30' },
  { title: 'Intro to AI Ethics', assessments: '1 Active Assessment', students: '25 Students', color: 'from-purple-600/30 to-pink-600/30' },
  { title: 'UX Design Principles', assessments: '3 Active Assessments', students: '18 Students', color: 'from-orange-600/30 to-rose-600/30' },
];

export function ActiveCourses() {
  return (
    <div>
      <h3 className="text-lg font-extrabold text-gray-900 mb-6">Active Courses</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COURSES_DATA.map((course, idx) => (
          <ActiveCourseCard key={idx} {...course} />
        ))}
      </div>
    </div>
  );
}
