import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Program, ProgramShare, CreatedShareResponse } from '../../types';
import { apiClient } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import {
  Share2,
  Copy,
  Check,
  Clock,
  Trash2,
  Shield,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, program }) => {
  const [shares, setShares] = useState<ProgramShare[]>([]);
  const [createdShare, setCreatedShare] = useState<CreatedShareResponse | null>(null);
  const [expiration, setExpiration] = useState<'never' | '1h' | '1d' | '7d' | '30d'>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchShares = async () => {
    if (!program) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/programs/${program.id}/shares`);
      if (response.data?.success) {
        setShares(response.data.data.shares || []);
      }
    } catch {
      // Ignore initial load error if no shares exist
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && program) {
      setCreatedShare(null);
      fetchShares();
    }
  }, [isOpen, program]);

  const handleCreateShare = async () => {
    if (!program) return;
    setIsCreating(true);
    try {
      const response = await apiClient.post(`/programs/${program.id}/shares`, {
        expiration,
      });

      if (response.data?.success) {
        const shareData: CreatedShareResponse = response.data.data.share;
        setCreatedShare(shareData);
        toast.success('Secure share link created!');
        fetchShares();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || 'Failed to create share link.';
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeShare = async (shareId: string) => {
    if (!program) return;
    try {
      await apiClient.delete(`/programs/${program.id}/shares/${shareId}`);
      toast.success('Share link successfully revoked.');
      if (createdShare?.id === shareId) {
        setCreatedShare(null);
      }
      fetchShares();
    } catch {
      toast.error('Failed to revoke share link.');
    }
  };

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (!program) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white truncate">
                Share: {program.title}
              </h3>
              <Badge variant="brand" size="xs">VIEW ONLY</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Anyone with this cryptographic link can read-only view and copy this solution.
            </p>
          </div>
        </div>

        {/* Newly Created Share Box */}
        {createdShare && (
          <div className="p-3.5 rounded-lg bg-brand-500/10 border border-brand-500/30 space-y-2">
            <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider font-mono">
              Direct Access Link Generated:
            </span>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${window.location.origin}/s/${createdShare.rawToken}`}
                className="w-full bg-dark-bg text-gray-200 font-mono text-xs rounded border border-dark-border px-3 py-1.5 select-all focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCopyLink(createdShare.rawToken)}
                className="shrink-0"
              >
                {copiedToken === createdShare.rawToken ? (
                  <Check className="w-3.5 h-3.5 text-gray-950" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-950" />
                )}
                <span>Copy</span>
              </Button>
            </div>
            <p className="text-[11px] text-gray-400">
              Note: This token is encrypted/hashed in the database. Copy the URL now.
            </p>
          </div>
        )}

        {/* Create Link Controls */}
        <div className="p-4 rounded-lg bg-dark-panel/60 border border-dark-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block">Link Expiration</label>
              <span className="text-[11px] text-gray-500">Access will automatically expire after this period.</span>
            </div>

            <select
              value={expiration}
              onChange={(e) => setExpiration(e.target.value as any)}
              className="bg-dark-surface border border-dark-border rounded px-3 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-brand-500"
            >
              <option value="1h">1 Hour</option>
              <option value="1d">1 Day (24 Hours)</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="never">Never (Until revoked)</option>
            </select>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={handleCreateShare}
            isLoading={isCreating}
            leftIcon={<Share2 className="w-3.5 h-3.5 text-brand-400" />}
          >
            Generate New Share Link
          </Button>
        </div>

        {/* Active Shares List */}
        <div>
          <h4 className="text-xs font-semibold text-gray-300 mb-2">Active Share Links</h4>
          {isLoading ? (
            <div className="py-4 text-center text-xs text-gray-500">Loading active shares...</div>
          ) : shares.length === 0 ? (
            <div className="py-4 text-center text-xs text-gray-500 border border-dashed border-dark-border rounded-lg">
              No active share links. Click "Generate New Share Link" above.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {shares.map((s) => {
                return (
                  <div
                    key={s.id}
                    className="p-3 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-gray-300 font-medium">
                          Share #{s.id.slice(-6)}
                        </span>
                        {s.isRevoked ? (
                          <Badge variant="red" size="xs">REVOKED</Badge>
                        ) : s.isExpired ? (
                          <Badge variant="yellow" size="xs">EXPIRED</Badge>
                        ) : (
                          <Badge variant="brand" size="xs">ACTIVE</Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 font-mono">
                        {s.expiresAt
                          ? `Expires: ${new Date(s.expiresAt).toLocaleDateString()}`
                          : 'Never expires'}
                      </div>
                    </div>

                    {!s.isRevoked && !s.isExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeShare(s.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-2 border-t border-dark-border">
          <Shield className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span>Shared viewers can only read code. They cannot edit, delete, or modify your assignment.</span>
        </div>
      </div>
    </Modal>
  );
};
