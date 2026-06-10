import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        navigate('/');
      } else {
        setApiError(result.error);
      }
      setLoading(false);
    }, 400);
  };

  const set = (field) => (ev) => {
    setForm(prev => ({ ...prev, [field]: ev.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div style={{ backgroundColor: '#0A2342' }} className="px-8 py-8 text-center">
            <Link to="/" className="no-underline">
              <h1 className="text-2xl font-bold text-white">📚 Fritzoria</h1>
            </Link>
            <p className="text-white/60 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                {apiError}
              </div>
            )}

            {/* Demo hint */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-4 py-3 rounded-lg mb-5">
              <strong>Demo admin:</strong> admin@fritzoria.com / admin123
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`}
                  style={{ '--tw-ring-color': errors.email ? undefined : '#0A234220' }}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#0A2342' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium no-underline hover:underline" style={{ color: '#0A2342' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
