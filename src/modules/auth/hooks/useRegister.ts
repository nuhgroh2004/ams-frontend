import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { REGISTER_MUTATION } from '../services/auth.mutation';
import { useAuthStore } from '../store/auth.store';
import { RegisterResponse } from '../types/auth.types';
import { toast } from '@/lib/toast';

export const useRegister = () => {
  const router = useRouter();
  const loginToStore = useAuthStore((state) => state.login);

  const [registerMutation, { loading, error }] = useMutation<RegisterResponse>(REGISTER_MUTATION, {
    onCompleted: (data) => {
      if (data.register) {
        toast.success('Registrasi Berhasil', 'Akun Anda telah berhasil dibuat. Selamat datang!');
        loginToStore(data.register.token, data.register.user as any);
        router.push('/dashboard');
      }
    },
    onError: (error) => {
      toast.graphqlError(error, 'Registrasi Gagal');
    }
  });

  const register = async (input: any) => {
    try {
      await registerMutation({
        variables: { input },
      });
    } catch (e) {
      // Caught to prevent unhandled promise rejection
    }
  };

  return {
    register,
    loading,
    error,
  };
};