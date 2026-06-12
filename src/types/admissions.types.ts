export interface StudentInfo {
  _id: string;
  name: string;
  email: string;
}

export interface GroupInfo {
  _id: string;
  groupName: string;
  subject: string;
}

export interface PendingRequest {
  studentId: StudentInfo;
  groupId: GroupInfo;
  requestedAt: string;
}

export interface RejectedRequest {
  studentId: StudentInfo;
  groupId: GroupInfo;
  rejectedAt: string;
}

export interface AdmissionsData {
  pending: PendingRequest[];
  rejected: RejectedRequest[];
}