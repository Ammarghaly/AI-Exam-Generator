import api from './axios';

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
