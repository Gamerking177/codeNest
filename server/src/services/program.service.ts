import { Types } from 'mongoose';
import { Program } from '../models/Program.js';
import { CreateProgramInput, UpdateProgramInput, QueryProgramsInput } from '../schemas/program.schema.js';
import { ProgramDto, toProgramDto } from '../dtos/program.dto.js';
import { AppError } from '../middleware/error.middleware.js';

export interface PaginatedPrograms {
  programs: ProgramDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DashboardStats {
  totalPrograms: number;
  totalSubjects: number;
  totalFavorites: number;
  subjectCounts: { subject: string; count: number }[];
  languageCounts: { language: string; count: number }[];
  recentlyUpdated: ProgramDto[];
  recentlyCreated: ProgramDto[];
}

export class ProgramService {
  static async createProgram(userId: string, input: CreateProgramInput): Promise<ProgramDto> {
    const program = await Program.create({
      userId: new Types.ObjectId(userId),
      title: input.title,
      subject: input.subject,
      language: input.language,
      question: input.question || '',
      code: input.code,
      notes: input.notes || '',
      tags: input.tags || [],
      isFavorite: input.isFavorite || false,
    });

    return toProgramDto(program);
  }

  static async getPrograms(userId: string, query: QueryProgramsInput): Promise<PaginatedPrograms> {
    // Strict query-level user scoping
    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };

    if (query.subject) {
      filter.subject = { $regex: new RegExp(`^${query.subject}$`, 'i') };
    }

    if (query.language) {
      filter.language = query.language.toLowerCase();
    }

    if (query.isFavorite !== undefined) {
      filter.isFavorite = query.isFavorite;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { question: searchRegex },
        { notes: searchRegex },
        { tags: searchRegex },
        { subject: searchRegex },
      ];
    }

    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const sortField = query.sortBy || 'updatedAt';
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const [programs, total] = await Promise.all([
      Program.find(filter).sort(sort).skip(skip).limit(limit),
      Program.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      programs: programs.map(toProgramDto),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getProgramById(userId: string, programId: string): Promise<ProgramDto> {
    if (!Types.ObjectId.isValid(programId)) {
      throw new AppError('Invalid program ID format', 400, 'INVALID_ID');
    }

    // Strict ownership check at DB query level
    const program = await Program.findOne({
      _id: new Types.ObjectId(programId),
      userId: new Types.ObjectId(userId),
    });

    if (!program) {
      throw new AppError('Program not found or you do not have permission to view it.', 404, 'PROGRAM_NOT_FOUND');
    }

    return toProgramDto(program);
  }

  static async updateProgram(userId: string, programId: string, input: UpdateProgramInput): Promise<ProgramDto> {
    if (!Types.ObjectId.isValid(programId)) {
      throw new AppError('Invalid program ID format', 400, 'INVALID_ID');
    }

    // Strict ownership check at DB query level
    const program = await Program.findOneAndUpdate(
      {
        _id: new Types.ObjectId(programId),
        userId: new Types.ObjectId(userId),
      },
      {
        $set: {
          ...input,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!program) {
      throw new AppError('Program not found or you do not have permission to edit it.', 404, 'PROGRAM_NOT_FOUND');
    }

    return toProgramDto(program);
  }

  static async toggleFavorite(userId: string, programId: string): Promise<ProgramDto> {
    if (!Types.ObjectId.isValid(programId)) {
      throw new AppError('Invalid program ID format', 400, 'INVALID_ID');
    }

    const program = await Program.findOne({
      _id: new Types.ObjectId(programId),
      userId: new Types.ObjectId(userId),
    });

    if (!program) {
      throw new AppError('Program not found.', 404, 'PROGRAM_NOT_FOUND');
    }

    program.isFavorite = !program.isFavorite;
    await program.save();

    return toProgramDto(program);
  }

  static async deleteProgram(userId: string, programId: string): Promise<void> {
    if (!Types.ObjectId.isValid(programId)) {
      throw new AppError('Invalid program ID format', 400, 'INVALID_ID');
    }

    // Strict ownership check at DB query level
    const result = await Program.findOneAndDelete({
      _id: new Types.ObjectId(programId),
      userId: new Types.ObjectId(userId),
    });

    if (!result) {
      throw new AppError('Program not found or you do not have permission to delete it.', 404, 'PROGRAM_NOT_FOUND');
    }
  }

  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    const userObjectId = new Types.ObjectId(userId);

    const [totalPrograms, totalFavorites, subjectAgg, languageAgg, recentlyUpdated, recentlyCreated] =
      await Promise.all([
        Program.countDocuments({ userId: userObjectId }),
        Program.countDocuments({ userId: userObjectId, isFavorite: true }),
        Program.aggregate([
          { $match: { userId: userObjectId } },
          { $group: { _id: '$subject', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Program.aggregate([
          { $match: { userId: userObjectId } },
          { $group: { _id: '$language', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Program.find({ userId: userObjectId }).sort({ updatedAt: -1 }).limit(5),
        Program.find({ userId: userObjectId }).sort({ createdAt: -1 }).limit(5),
      ]);

    const subjectCounts = subjectAgg.map((item) => ({
      subject: item._id as string,
      count: item.count as number,
    }));

    const languageCounts = languageAgg.map((item) => ({
      language: item._id as string,
      count: item.count as number,
    }));

    return {
      totalPrograms,
      totalSubjects: subjectCounts.length,
      totalFavorites,
      subjectCounts,
      languageCounts,
      recentlyUpdated: recentlyUpdated.map(toProgramDto),
      recentlyCreated: recentlyCreated.map(toProgramDto),
    };
  }

  static async getDistinctSubjects(userId: string): Promise<string[]> {
    const subjects = await Program.distinct('subject', { userId: new Types.ObjectId(userId) });
    return subjects.sort();
  }

  static async getDistinctTags(userId: string): Promise<string[]> {
    const tags = await Program.distinct('tags', { userId: new Types.ObjectId(userId) });
    return tags.sort();
  }
}
