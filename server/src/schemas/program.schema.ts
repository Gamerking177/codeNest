import { z } from 'zod';

export const createProgramSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject cannot exceed 100 characters').trim(),
  language: z.string().min(1, 'Language is required').max(50).toLowerCase().trim(),
  code: z.string().min(1, 'Code cannot be empty'),
  question: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  tags: z.array(z.string().trim()).optional().default([]),
  isFavorite: z.boolean().optional().default(false),
});

export const updateProgramSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200).trim().optional(),
  subject: z.string().min(1, 'Subject cannot be empty').max(100).trim().optional(),
  language: z.string().min(1, 'Language cannot be empty').max(50).toLowerCase().trim().optional(),
  code: z.string().min(1, 'Code cannot be empty').optional(),
  question: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string().trim()).optional(),
  isFavorite: z.boolean().optional(),
});

export const queryProgramsSchema = z.object({
  search: z.string().optional(),
  subject: z.string().optional(),
  language: z.string().optional(),
  tag: z.string().optional(),
  isFavorite: z
    .enum(['true', 'false', '1', '0'])
    .transform((val) => val === 'true' || val === '1')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  sortBy: z.enum(['updatedAt', 'createdAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type QueryProgramsInput = z.infer<typeof queryProgramsSchema>;
