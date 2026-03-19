import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'MANAGER' | 'VIEWER';

interface AuthState {
  user: {
    name: string;
    role: UserRole;
  } | null;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Defaulting to VIEWER to test our security
  user: { name: 'Demo User', role: 'VIEWER' }, 
  setRole: (role) => set({ user: { name: 'Demo User', role } }),
}));