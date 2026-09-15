import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Simulate safe delivery feedback without revealing account existence
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 shadow-modal">
        <div className="mb-6 text-center">
          <div className="inline-block mb-3">
            <Logo size="md" to="/" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Reset your password
          </h1>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Enter your email address and we will send password recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/30 text-center space-y-3">
            <div className="flex justify-center text-brand-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              If an account exists for <span className="font-mono text-brand-300">{email}</span>, a secure password reset link has been dispatched.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email"
              type="email"
              required
              placeholder="alex@codenest.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
            >
              Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
