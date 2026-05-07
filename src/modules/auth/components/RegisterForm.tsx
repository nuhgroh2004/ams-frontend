'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppInput } from '@/components/primitives/AppInput';
import { AppButton } from '@/components/primitives/AppButton';
import { useRegister } from '../hooks/useRegister';
import { Mail, Lock, User as UserIcon, CreditCard, Users } from 'lucide-react';

const registerSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  nrp: z.string().min(5, 'NRP minimal 5 karakter'),
  gender: z.enum(['M', 'F'], { 
    errorMap: () => ({ message: 'Pilih jenis kelamin' }) 
  }),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerAction, loading, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: undefined // Memaksa user memilih
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerAction(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <AppInput
          {...register('nama_lengkap')}
          type="text"
          placeholder="John Doe"
          icon={UserIcon}
          error={errors.nama_lengkap?.message}
        />
      </div>

      {/* NRP Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium">NRP</label>
        <AppInput
          {...register('nrp')}
          type="text"
          placeholder="Masukkan NRP"
          icon={CreditCard}
          error={errors.nrp?.message}
        />
      </div>

      {/* Gender Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <select
            {...register('gender')}
            className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${
              errors.gender ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            <option value="">Pilih Gender</option>
            <option value="M">Laki-laki</option>
            <option value="F">Perempuan</option>
          </select>
        </div>
        {errors.gender && (
          <p className="text-xs text-red-500">{errors.gender.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <AppInput
          {...register('email')}
          type="email"
          placeholder="john@example.com"
          icon={Mail}
          error={errors.email?.message}
        />
      </div>

      {/* Password */}
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
        Register Account
      </AppButton>
    </form>
  );
};