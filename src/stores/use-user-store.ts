import { create } from 'zustand';

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  available_credits?: number;
  subscription_type?: string;
  subjects_taught?: string;
  [key: string]: any;
}

type UserState = {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
};

export const useUserStore = create<UserState>((set) => {
  const getInitialUser = (): User => {
    try {
      const stored = localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
      return JSON.parse(stored);
    } catch {
      return {};
    }
  };

  return {
    currentUser: getInitialUser(),
    setCurrentUser: (user) => {
      const isLocal = !!localStorage.getItem("token") || !!localStorage.getItem("user");
      const storage = isLocal ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(user));
      set({ currentUser: user });
    },
    updateUser: (fields) => {
      set((state) => {
        const updatedUser = { ...state.currentUser, ...fields };
        const isLocal = !!localStorage.getItem("token") || !!localStorage.getItem("user");
        const storage = isLocal ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(updatedUser));
        return { currentUser: updatedUser };
      });
    },
  };
});
