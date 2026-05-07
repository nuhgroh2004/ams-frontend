import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types/auth.types';

interface AuthState {
  token: string | null;
  user: Partial<User> | null;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        const sanitizedUser = {
          id: user.id,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          roles: user.roles,
          unit_id: user.unit_id,
        };
        
        // Sync to cookie for middleware support
        if (typeof window !== 'undefined') {
          document.cookie = `ams-auth-token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }

        set({ 
          token, 
          user: sanitizedUser, 
          isAuthenticated: true 
        });
      },

      logout: () => {
        // Clear cookie
        if (typeof window !== 'undefined') {
          document.cookie = 'ams-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'ams-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Derive isAuthenticated from token on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);
