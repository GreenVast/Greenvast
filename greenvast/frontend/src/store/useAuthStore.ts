import { create } from 'zustand';

type Role = 'farmer' | 'investor' | 'buyer' | null;

interface User {
  email: string;
  role: Role;
}

interface AuthStore {
  user: User | null;
  setUser: (u: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  logout: () => set({ user: null }),
}));
