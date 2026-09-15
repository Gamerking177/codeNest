import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowLeft, RotateCcw } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export const VerifyEmailPage: React.FC = () => {
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCooldown(60);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-dark-surface border border-dark-border rounded-xl p-6 sm:p-8 shadow-modal text-center">
        <div className="inline-block mb-4">
          <Logo size="md" to="/" />
        </div>

        <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-2">
          Verify your email address
        </h1>

        <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto mb-6">
          We sent a verification link to your email address. Please click the link to confirm your student workspace.
        </p>

        <div className="space-y-3">
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'}
          </Button>

          <div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
