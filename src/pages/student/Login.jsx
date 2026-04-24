import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import StudyBackground from '../../components/student/StudyBackground';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/login', { email, password });
      const { token, role } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      toast.success('Successfully logged in! Welcome back.');

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network Error: Backend API is not reachable from this device. Please deploy backend.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      <StudyBackground />

      <div className="glass-card relative z-10 p-10 rounded-2xl w-full max-w-md">
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">Login</h1>
          <p className="text-gray-600 text-sm font-medium">Welcome back to Study Material</p>
        </div>

        {error && (
          <div className="bg-white/50 border border-purple-400 text-purple-700 p-4 rounded mb-6 text-sm font-bold backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/80 border border-purple-100 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all shadow-sm"
              placeholder="e.g. name@test.com"
              required
            />
          </div>
          
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/80 border border-purple-100 p-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all shadow-sm pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-xs font-bold text-gray-500 hover:text-purple-600 transition-colors"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all mt-4 transform hover:-translate-y-0.5 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-[10px] tracking-widest uppercase font-semibold">
            © 2026 Study Material Project
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
