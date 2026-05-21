import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { SignUpFormData } from '../components/auth/SignUpForm';

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const formData = new FormData();
      
      const roleCapitalized = data.role === 'student' ? 'Student' : 'Teacher';
      formData.append('role', roleCapitalized);
      formData.append('name', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      if (data.role === 'teacher' && data.subjectTaught) {
        formData.append('subjects_taught', data.subjectTaught);
      }
      
      if (data.role === 'student' && data.educationLevel) {
        formData.append('educational_level', data.educationLevel);
      }
      
      if (data.role === 'teacher' && data.certificate && data.certificate.length > 0) {
        formData.append('file', data.certificate[0]);
      }

      const response = await axios.post('http://localhost:3000/api/auth/signUp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
  });
};
