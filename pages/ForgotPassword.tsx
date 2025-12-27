
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-xl shadow-blue-500/20">
            <Shield size={32} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Password Reset</h1>
          <p className="text-gray-500">We'll send you recovery instructions.</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-2xl">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email address</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#2a2a2a] border border-transparent rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors text-white"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="text-xl font-bold text-white">Check your email</h2>
              <p className="text-gray-400 text-sm">We've sent password reset instructions to <b>{email}</b>.</p>
              <button onClick={() => setIsSubmitted(false)} className="text-blue-500 text-sm font-medium hover:underline">Didn't receive it? Try again</button>
            </div>
          )}

          <div className="mt-8 text-center border-t border-[#2a2a2a] pt-6">
            <Link to="/login" className="text-sm text-gray-500 hover:text-white flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
