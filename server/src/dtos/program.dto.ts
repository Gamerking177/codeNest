import { IProgram } from '../models/Program.js';

export interface ProgramDto {
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

export function toProgramDto(program: IProgram): ProgramDto {
  return {
    id: program._id.toString(),
    userId: program.userId.toString(),
    title: program.title,
    subject: program.subject,
    language: program.language,
    question: program.question || '',
    code: program.code,
    notes: program.notes || '',
    tags: program.tags || [],
    isFavorite: Boolean(program.isFavorite),
    createdAt: program.createdAt.toISOString(),
    updatedAt: program.updatedAt.toISOString(),
  };
}
