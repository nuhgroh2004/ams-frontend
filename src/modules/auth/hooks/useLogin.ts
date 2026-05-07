import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { LOGIN_MUTATION } from '../services/auth.mutation';
import { useAuthStore } from '../store/auth.store';
import { AuthResponse } from '../types/auth.types';
import { toast } from '@/lib/toast';

export const useLogin = () => {
  const router = useRouter();
  const loginToStore = useAuthStore((state) => state.login);

  const [loginMutation, { loading, error }] = useMutation<AuthResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login) {
        loginToStore(data.login.token, data.login.user);
        toast.success('Login Berhasil', `Selamat datang kembali, ${data.login.user.nama_lengkap}!`);
        router.push('/dashboard');
      }
    },
    onError: (error) => {
      toast.graphqlError(error, 'Login Gagal');
    }
  });

  const login = async (email: string, password: string) => {
    try {
      await loginMutation({
        variables: { email, password },
      });
    } catch (e) {
      // Caught to prevent unhandled promise rejection
    }
  };

  return {
    login,
    loading,
    error,
  };
};
