import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, GraduationCap, Mail, Lock, User } from 'lucide-react';

const AuthModal = () => {
  const { authModalOpen, authMode, setAuthModalOpen, setAuthMode, login, register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'student') {
      setEmail('student@scholarnest.edu');
      setPassword('student123');
    } else {
      setEmail('admin@scholarnest.edu');
      setPassword('admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#EAE3D9] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
        
        {/* Modal Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#EA580C] to-[#F97316] p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#EA580C] flex items-center justify-center mx-auto mb-3 shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold font-serif">
            {authMode === 'login' ? 'Welcome Back to ScholarNest' : 'Join ScholarNest'}
          </h3>
          <p className="text-xs text-orange-100 mt-1">
            {authMode === 'login' 
              ? 'Access matched scholarships and your application pipeline'
              : 'Create your account to discover matched funding opportunities'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@scholarnest.edu"
                className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    role === 'student'
                      ? 'bg-[#EA580C] text-white border-[#EA580C]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    role === 'admin'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Scholarship Provider / Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {/* Quick Demo Login Credentials */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Instant Demo Accounts</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleFillDemo('student')}
                className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-900 text-[11px] font-bold hover:bg-orange-100"
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold hover:bg-amber-100"
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-[#EA580C] hover:underline"
                >
                  Register as Student
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-[#EA580C] hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default AuthModal;
