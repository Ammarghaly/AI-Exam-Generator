export type StudentStatus = "Active" | "Pending" | "Inactive";
export type GroupStatus = "Active" | "Archived";
export type ExamStatus = "Active" | "Closed" | "Draft"; // ضفناها للامتحانات


export interface Student {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  avatar?: string;
  studentId: string;    // my edit
  joinDate: string;
  status: StudentStatus;
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  inviteCode: string;
  studentsCount: number;
  examsGenerated: number;
  status: GroupStatus;
  avatarUrls: string[];
  extraCount?: number;
}

export interface GroupStat {
  label: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "neutral";
}
export interface AssignedExam {
  id: string;
  title: string;
  dueDate: string;
  status: ExamStatus;
  submissions: number;
  totalStudents: number;
}
export interface GroupDetailsData {
  _id: string;
  groupName: string;
  subject: string;
  inviteCode: string;
  students: GroupDetailsStudent[];
  pendingStudents: GroupDetailsStudent[];
  totalStudents: number;
}
 
export interface GroupDetailsStudent {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

// Student returned from search endpoint
export interface SearchedStudent {
  _id: string;
  name: string;
  email: string;
}
 
// Payload sent when adding a student by email
export interface AddStudentPayload {
  email: string;
}