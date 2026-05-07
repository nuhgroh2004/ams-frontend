import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { user, token, isAuthenticated, logout } = useAuthStore();

  return {
    user,
    token,
    roles: user?.roles || [],
    isAuthenticated,
    logout,
  };
};
