import api from './axios';
import type { GroupDetailsData, SearchedStudent } from '../types/group.types';

export interface CreateGroupPayload {
  groupName: string;
  subject: string;
}

export const createGroup = async (payload: CreateGroupPayload) => {
  const response = await api.post('/group/createGroup', payload);
  return response.data;
};

export const getMyGroups = async () => {
  const response = await api.get('/group/myGroups');
  return response.data;
};

export const joinGroup = async (accessCode: string) => {
  const response = await api.post('/group/joinGroup', { accessCode });
  return response.data;
};

// ── Group Details ──────────────────────────────────────────────
export const getGroupById = async (groupId: string): Promise<GroupDetailsData> => {
  const response = await api.get(`/group/${groupId}`);
  console.log(response.data);
  return response.data.data;
};

export const removeStudentFromGroup = async (
  groupId: string,
  studentId: string
) => {
  const response = await api.delete(`/group/${groupId}/students/${studentId}`);
  return response.data;
};

export const searchStudents = async (query: string): Promise<SearchedStudent[]> => {
  const response = await api.get(`/students/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
};

export const addStudentToGroup = async (
  groupId: string,
  email: string
): Promise<{ addedStudent: { name: string } }> => {
  const response = await api.post(`/group/${groupId}/addStudent`, { email });
  return response.data.data;
};

export const deleteGroup = async (groupId: string) => {
  const response = await api.delete(`/group/${groupId}`);
  return response.data;
};

export interface UpdateGroupPayload {
  groupName?: string;
  subject?: string;
}

export const updateGroup = async (groupId: string, payload: UpdateGroupPayload) => {
  const response = await api.patch(`/group/${groupId}`, payload);
  return response.data;
};
