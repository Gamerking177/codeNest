import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Code2,
  Copy,
  Check,
  Lock,
  ArrowRight,
  AlertCircle,
  Clock,
  Terminal,
  FileCode,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { ReadOnlySharedProgram } from '../types';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Badge, LanguageBadge } from '../components/ui/Badge';
import { CodeEditor } from '../components/editor/CodeEditor';
import { useToast } from '../context/ToastContext';

export const SharedProgramPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [program, setProgram] = useState<ReadOnlySharedProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<'expired' | 'revoked' | 'notFound' | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchShared() {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/shared/${token}`);
        if (response.data?.success && response.data?.data?.program) {
          setProgram(response.data.data.program);
        }
      } catch (err: any) {
        const code = err?.response?.data?.error?.code;
        if (code === 'SHARE_EXPIRED') {
          setErrorStatus('expired');
        } else if (code === 'SHARE_REVOKED') {
          setErrorStatus('revoked');
        } else {
          setErrorStatus('notFound');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchShared();
  }, [token]);

  const handleCopyCode = async () => {
    if (!program) return;
    try {
      await navigator.clipboard.writeText(program.code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy code.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-sm text-gray-400 font-mono">
          <Terminal className="w-5 h-5 text-brand-400 animate-spin" />
          <span>Decrypting shared solution...</span>
        </div>
      </div>
    );
  }

  // Error States (Expired, Revoked, Invalid)
  if (errorStatus || !program) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-surface border border-dark-border rounded-xl p-8 text-center shadow-modal">
          <div className="inline-block mb-4">
            <Logo size="md" to="/" />
          </div>

          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-white mb-2">
            {errorStatus === 'expired'
              ? 'Share Link Expired'
              : errorStatus === 'revoked'
              ? 'Share Link Revoked'
              : 'Program Not Found'}
          </h2>

          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            {errorStatus === 'expired'
              ? 'This read-only link has reached its expiration time and is no longer accessible.'
              : errorStatus === 'revoked'
              ? 'The owner has revoked access to this shared solution.'
              : 'The requested share link is invalid or has been permanently removed.'}
          </p>

          <Link to="/">
            <Button variant="secondary" size="sm" className="w-full">
              Go to CodeNest Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Top Read-Only Banner & Header */}
      <header className="sticky top-0 z-30 bg-dark-surface/90 backdrop-blur border-b border-dark-border px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Logo size="sm" to="/" />
          <span className="text-gray-600">|</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Lock className="w-3 h-3" />
              <span>READ ONLY</span>
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">
              Shared by <strong className="text-gray-200">{program.ownerName}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyCode}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy Code'}
          </Button>

          <Link to="/register">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open in CodeNest
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout (40% Problem / Notes, 60% Code) */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Program Problem & Context */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-lg bg-dark-surface border border-dark-border space-y-3">
            <div className="flex items-center gap-2">
              <LanguageBadge language={program.language} />
              <Badge variant="default" size="xs">{program.subject}</Badge>
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              {program.title}
            </h1>

            <div className="text-[11px] text-gray-500 font-mono">
              Created: {new Date(program.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Problem Statement */}
          {program.question && (
            <div className="p-5 rounded-lg bg-dark-surface border border-dark-border space-y-2">
              <h3 className="text-xs font-semibold text-brand-400 uppercase tracking-wider font-mono">
                Problem Objective
              </h3>
              <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                {program.question}
              </p>
            </div>
          )}

          {/* Personal Notes */}
          {program.notes && (
            <div className="p-5 rounded-lg bg-dark-surface border border-dark-border space-y-2">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
                Notes & Observations
              </h3>
              <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                {program.notes}
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="p-4 rounded-lg bg-dark-panel/40 border border-dark-border flex items-start gap-2.5 text-xs text-gray-400">
            <Shield className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>
              This is a secure read-only view. You cannot edit, delete, or overwrite the author's work.
            </span>
          </div>
        </div>

        {/* Right Side: Monaco Code Editor (Strictly Read Only) */}
        <div className="lg:col-span-7 flex flex-col">
          <CodeEditor
            code={program.code}
            language={program.language}
            readOnly={true}
            minHeight="560px"
          />
        </div>
      </main>
    </div>
  );
};
