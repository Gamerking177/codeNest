import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, School, ArrowRight, Check, X } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password requirements calculation
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!hasMinLength) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, college.trim());
      toast.success('Your CodeNest workspace has been created!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        'Unable to create account. Please check your details and try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          <Logo size="md" to="/" />
        </div>

        <div className="max-w-sm w-full mx-auto my-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create your workspace
            </h1>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Start keeping all your assignments, lab exercises, and notes in one place.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email address"
              type="email"
              required
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="College / Department (Optional)"
              type="text"
              placeholder="Dept of Computer Science"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              leftIcon={<School className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {/* Password checklist */}
            {password.length > 0 && (
              <div className="p-3 rounded-lg bg-dark-surface border border-dark-border text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400">
                  {hasMinLength ? <Check className="w-3 h-3 text-brand-400" /> : <X className="w-3 h-3 text-gray-600" />}
                  <span className={hasMinLength ? 'text-brand-300' : ''}>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  {passwordsMatch ? <Check className="w-3 h-3 text-brand-400" /> : <X className="w-3 h-3 text-gray-600" />}
                  <span className={passwordsMatch ? 'text-brand-300' : ''}>Passwords match</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:underline font-medium">
              Sign in →
            </Link>
          </p>
        </div>

        <div className="text-xs text-gray-600 text-center sm:text-left">
          CodeNest &copy; {new Date().getFullYear()} — Secure personal coding notebook.
        </div>
      </div>

      {/* Right Column: Information Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-surface border-l border-dark-border p-12 flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Designed for student productivity.
          </h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-sm">
            Everything you write stays strictly private to your account.
          </p>
        </div>

        <div className="space-y-4 text-xs text-gray-300">
          <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
            <h4 className="font-semibold text-white mb-1">C & C++ Programming</h4>
            <p className="text-[11px] text-gray-400">Pointers, memory allocation, structs, file I/O</p>
          </div>
          <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
            <h4 className="font-semibold text-white mb-1">Data Structures & Algorithms</h4>
            <p className="text-[11px] text-gray-400">Trees, graphs, dynamic programming, sorting</p>
          </div>
          <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
            <h4 className="font-semibold text-white mb-1">Database Management Systems</h4>
            <p className="text-[11px] text-gray-400">SQL queries, joins, relational schema design</p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-gray-500">
          Zero third-party trackers &middot; Strict query-level isolation
        </div>
      </div>
    </div>
  );
};
