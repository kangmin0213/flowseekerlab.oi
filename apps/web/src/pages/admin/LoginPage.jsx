
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import FormField from '@/components/admin/FormField.jsx';
import LoadingSpinner from '@/components/admin/LoadingSpinner.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect away from login
  useEffect(() => {
    console.log('Rendering LoginPage at /admin. Authenticated:', isAuthenticated);
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Navigation is handled automatically or we push them to their desired route
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null; // Avoid flashing login form while redirecting

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-bg))] px-4">
      <div className="w-full max-w-md admin-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">The Flow</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Sign in to the admin dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-[hsl(var(--admin-error))/10] text-[hsl(var(--admin-error))] text-sm border border-[hsl(var(--admin-error))/20]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Email Address">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input bg-[hsl(var(--admin-sidebar-bg))] text-[hsl(var(--admin-text))]"
              required
              autoComplete="email"
              placeholder="admin@theflow.com"
            />
          </FormField>

          <FormField label="Password">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input bg-[hsl(var(--admin-sidebar-bg))] text-[hsl(var(--admin-text))]"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </FormField>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-[hsl(var(--muted-foreground))]">
              <input type="checkbox" className="rounded border-border text-[hsl(var(--admin-accent))] focus:ring-[hsl(var(--admin-accent))]" />
              Remember me
            </label>
            <button type="button" className="text-[hsl(var(--admin-accent))] hover:underline font-medium">
              Forgot password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full bg-[hsl(var(--admin-text))] text-[hsl(var(--admin-bg))] py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <LoadingSpinner size="sm" className="text-[hsl(var(--admin-bg))]" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
