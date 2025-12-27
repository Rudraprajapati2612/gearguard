
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: '1',
        name: 'Admin User',
        email: data.email,
        role: UserRole.ADMIN,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-xl shadow-blue-500/20 transition-transform hover:scale-110">
            <Shield size={32} />
          </Link>
          <h1 className="text-3xl font-black tracking-tighter mb-2">GEARGUARD</h1>
          <p className="text-gray-500 font-medium text-xs uppercase tracking-[0.2em]">Enterprise Login</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <h2 className="text-xl font-bold mb-6 text-white">Sign in to workspace</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Corporate Email</label>
              <input 
                {...register('email')}
                type="email" 
                placeholder="name@company.com"
                className={`w-full bg-[#2a2a2a] border ${errors.email ? 'border-red-500' : 'border-white/5'} rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-white placeholder:text-gray-600`}
              />
              {errors.email && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Security Password</label>
                {/* Removed invalid 'size' prop from Link component */}
                <Link to="/forgot-password" className="text-[10px] font-bold uppercase text-blue-500 hover:text-blue-400">Recovery Access</Link>
              </div>
              <div className="relative">
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  className={`w-full bg-[#2a2a2a] border ${errors.password ? 'border-red-500' : 'border-white/5'} rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-white placeholder:text-gray-600`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 mt-4"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Secure Login'}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-xs text-gray-500">
              Authorized access only. Logins are monitored.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">
              <ArrowLeft size={12} /> Back to Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
