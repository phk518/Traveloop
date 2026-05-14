import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup, loading } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = isLogin ? await login(email, password) : await signup(email, password, name);
    if (!res.success) setError(res.error);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 md:p-12 rounded-2xl animate-fade-in border-primary/20">
        <div className="flex flex-col items-center mb-8">
          <div className="accent-gradient p-4 rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl text-white">flight_takeoff</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-on-surface-variant mt-2 text-center">
            {isLogin ? 'Your next journey awaits' : 'Join the community of travelers'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-label-sm font-label-sm text-outline-variant uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline-variant text-on-surface"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-label-sm font-label-sm text-outline-variant uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@traveloop.com"
                required
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline-variant text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label-sm font-label-sm text-outline-variant uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline-variant text-on-surface"
              />
            </div>
          </div>

          {error && <p className="text-error text-center text-sm">{error}</p>}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full accent-gradient text-white py-4 rounded-xl font-headline-md text-headline-md hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
            {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </form>

        <p className="text-center mt-8 text-on-surface-variant">
          {isLogin ? "New to Traveloop?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-bold ml-2 hover:underline underline-offset-4"
          >
            {isLogin ? 'Create one now' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
