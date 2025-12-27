
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Loader2 } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-gray-500 text-sm">Join GearGuard and start managing maintenance.</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
              <input 
                {...register('name')}
                type="text" 
                placeholder="John Doe"
                className={`w-full bg-[#2a2a2a] border ${errors.name ? 'border-red-500' : 'border-transparent'} rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors text-white`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email address</label>
              <input 
                {...register('email')}
                type="email" 
                placeholder="name@company.com"
                className={`w-full bg-[#2a2a2a] border ${errors.email ? 'border-red-500' : 'border-transparent'} rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors text-white`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <input 
                {...register('password')}
                type="password" 
                placeholder="••••••••"
                className={`w-full bg-[#2a2a2a] border ${errors.password ? 'border-red-500' : 'border-transparent'} rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors text-white`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <input 
                {...register('confirmPassword')}
                type="password" 
                placeholder="••••••••"
                className={`w-full bg-[#2a2a2a] border ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'} rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors text-white`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 font-medium hover:underline">Sign in instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
