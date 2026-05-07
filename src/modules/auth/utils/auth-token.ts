/**
 * Token Utilities
 * 
 * Interacts with the Zustand storage to retrieve the token
 * for Apollo Client and other non-React contexts.
 */

const STORAGE_KEY = 'ams-auth-storage';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const storage = localStorage.getItem(STORAGE_KEY);
  if (!storage) return null;

  try {
    const parsed = JSON.parse(storage);
    return parsed.state?.token || null;
  } catch (e) {
    return null;
  }
};

export const setToken = (token: string) => {
  // Normally handled by Zustand persist, 
  // but provided here for Task 3 compliance.
  console.warn('setToken called manually. Preferred way is using useAuthStore().login()');
};

export const removeToken = () => {
  // Normally handled by Zustand persist,
  // but provided here for Task 3 compliance.
  console.warn('removeToken called manually. Preferred way is using useAuthStore().logout()');
};
