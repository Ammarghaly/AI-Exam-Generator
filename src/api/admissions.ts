import api from "./axios";
import type { PendingRequest, RejectedRequest } from "../types/admissions.types";

// GET pending requests for the teacher
export const getPendingRequests = async (): Promise<PendingRequest[]> => {
  const response = await api.get("/group/teacherViewPendingRequest");
  return response.data.data;
};

// GET rejected requests for the teacher
export const getRejectedRequests = async (): Promise<RejectedRequest[]> => {
  const response = await api.get("/group/teacherViewRejectedRequest");
  return response.data.data;
};

// ACCEPT a pending student
export const acceptStudent = async (studentId: string): Promise<void> => {
  await api.post("/group/teacherAcceptRejectRequest", {
    requestId: studentId,
    action: "accept",
  });
};

// REJECT a pending student
export const rejectStudent = async (studentId: string): Promise<void> => {
  await api.post("/group/teacherAcceptRejectRequest", {
    requestId: studentId,
    action: "reject",
  });
};

// RE-ACCEPT a previously rejected student into their group
export const reAcceptStudent = async (
  groupId: string,
  studentId: string
): Promise<void> => {
  await api.post("/group/addStudentToGroup", {
    groupId,
    requestId: studentId,
  });
};