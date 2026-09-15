import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Terminal, Sparkles } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back to CodeNest!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        'Unable to sign in. Please verify your credentials and try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await demoLogin();
      toast.success('Signed in as demo student (Alex Rivera)!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || 'Unable to connect to demo account.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          <Logo size="md" to="/" />
        </div>

        <div className="max-w-sm w-full mx-auto my-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sign in to CodeNest
            </h1>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Your personal workspace for code, assignments, and notes.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              placeholder="alex@codenest.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-gray-400 hover:text-brand-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Student Access */}
          <div className="mt-6 pt-6 border-t border-dark-border">
            <div className="text-center mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
                Evaluation Access
              </span>
            </div>
            <button
              onClick={handleDemoSignIn}
              disabled={isSubmitting}
              type="button"
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-dark-surface hover:bg-dark-panel border border-brand-500/30 text-xs font-medium text-brand-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Sign in with 1-Click Demo Account (Alex Rivera)</span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:underline font-medium">
              Create account →
            </Link>
          </p>
        </div>

        <div className="text-xs text-gray-600 text-center sm:text-left">
          CodeNest &copy; {new Date().getFullYear()} — Secure personal coding notebook.
        </div>
      </div>

      {/* Right Column: Developer Workspace Showcase (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-surface border-l border-dark-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 font-mono text-xs border border-brand-500/20 mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Ergonomics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Stop losing code solutions across random folders.
          </h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Organized subjects, instant Monaco formatting, markdown problem descriptions, and zero clutter.
          </p>
        </div>

        {/* Code Snippet Graphic */}
        <div className="relative z-10 rounded-lg bg-dark-bg border border-dark-border p-4 font-mono text-xs text-gray-300 shadow-elevated">
          <div className="flex items-center justify-between border-b border-dark-border pb-2 mb-3 text-[11px] text-gray-500">
            <span>StudentManagement.java</span>
            <span className="text-brand-400">● Saved</span>
          </div>
          <p className="text-purple-400">public class <span className="text-yellow-300">Student</span> {'{'}</p>
          <p className="pl-4 text-blue-400">private String <span className="text-gray-200">id;</span></p>
          <p className="pl-4 text-blue-400">private double <span className="text-gray-200">gpa;</span></p>
          <p className="pl-4 text-purple-400">public String <span className="text-yellow-300">getLetterGrade</span>() {'{'}</p>
          <p className="pl-8 text-purple-400">if <span className="text-gray-200">(gpa &gt;= 3.8) return "A+";</span></p>
          <p className="pl-4">{'}'}</p>
          <p>{'}'}</p>
        </div>

        <div className="relative z-10 text-[11px] font-mono text-gray-500">
          Strict authorization &middot; Cryptographic sharing &middot; Zero social tracking
        </div>
      </div>
    </div>
  );
};
