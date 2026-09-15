export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  college?: string;
  avatar?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  userId: string;
  title: string;
  subject: string;
  language: string;
  question: string;
  code: string;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramShare {
  id: string;
  programId: string;
  permission: 'VIEW_ONLY';
  expiresAt: string | null;
  revokedAt: string | null;
  isExpired: boolean;
  isRevoked: boolean;
  createdAt: string;
}

export interface CreatedShareResponse extends ProgramShare {
  rawToken: string;
  shareUrl: string;
}

export interface ReadOnlySharedProgram {
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

export interface DashboardStats {
  totalPrograms: number;
  totalSubjects: number;
  totalFavorites: number;
  subjectCounts: { subject: string; count: number }[];
  languageCounts: { language: string; count: number }[];
  recentlyUpdated: Program[];
  recentlyCreated: Program[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedProgramsResponse {
  programs: Program[];
  pagination: PaginationMeta;
}

export interface ProgramFilters {
  search?: string;
  subject?: string;
  language?: string;
  tag?: string;
  isFavorite?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'updatedAt' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoFormatOnSave: boolean;
  theme: 'vs-dark' | 'vs';
  lineNumbers: boolean;
}
