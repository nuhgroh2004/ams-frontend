'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppInput } from '@/components/primitives/AppInput';
import { AppButton } from '@/components/primitives/AppButton';
import { useLogin } from '../hooks/useLogin';
import { Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, loading, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <AppInput
          {...register('email')}
          type="email"
          placeholder="admin@ams.com"
          icon={Mail}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <AppInput
          {...register('password')}
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
        />
      </div>

      <AppButton 
        type="submit"
        fullWidth
        loading={loading}
      >
        Sign In
      </AppButton>
    </form>
  );
};
