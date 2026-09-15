import { IProgramShare } from '../models/ProgramShare.js';
import { IProgram } from '../models/Program.js';

export interface ShareDto {
  id: string;
  programId: string;
  permission: string;
  expiresAt: string | null;
  revokedAt: string | null;
  isExpired: boolean;
  isRevoked: boolean;
  createdAt: string;
}

export interface CreatedShareResponseDto extends ShareDto {
  rawToken: string;
  shareUrl: string;
}

export interface ReadOnlySharedProgramDto {
  title: string;
  subject: string;
  language: string;
  question: string;
  code: string;
  notes: string;
  ownerName: string;
  permission: 'VIEW_ONLY';
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export function toShareDto(share: IProgramShare): ShareDto {
  const now = new Date();
  const isExpired = share.expiresAt ? new Date(share.expiresAt) <= now : false;
  const isRevoked = Boolean(share.revokedAt);

  return {
    id: share._id.toString(),
    programId: share.programId.toString(),
    permission: share.permission,
    expiresAt: share.expiresAt ? share.expiresAt.toISOString() : null,
    revokedAt: share.revokedAt ? share.revokedAt.toISOString() : null,
    isExpired,
    isRevoked,
    createdAt: share.createdAt.toISOString(),
  };
}

export function toReadOnlySharedProgramDto(
  program: IProgram,
  ownerName: string,
  expiresAt: Date | null
): ReadOnlySharedProgramDto {
  return {
    title: program.title,
    subject: program.subject,
    language: program.language,
    question: program.question || '',
    code: program.code,
    notes: program.notes || '',
    ownerName,
    permission: 'VIEW_ONLY',
    createdAt: program.createdAt.toISOString(),
    updatedAt: program.updatedAt.toISOString(),
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
  };
}
