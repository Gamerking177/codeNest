import crypto from 'crypto';
import { Types } from 'mongoose';
import { ProgramShare } from '../models/ProgramShare.js';
import { Program } from '../models/Program.js';
import { User } from '../models/User.js';
import { CreateShareInput } from '../schemas/share.schema.js';
import {
  ShareDto,
  CreatedShareResponseDto,
  ReadOnlySharedProgramDto,
  toShareDto,
  toReadOnlySharedProgramDto,
} from '../dtos/share.dto.js';
import { AppError } from '../middleware/error.middleware.js';

export class ShareService {
  private static hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private static calculateExpiresAt(input: CreateShareInput): Date | null {
    if (input.expiration === 'never') return null;

    const now = new Date();
    switch (input.expiration) {
      case '1h':
        return new Date(now.getTime() + 1 * 60 * 60 * 1000);
      case '1d':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'custom':
        if (input.customHours && input.customHours > 0) {
          return new Date(now.getTime() + input.customHours * 60 * 60 * 1000);
        }
        return null;
      default:
        return null;
    }
  }

  static async createShare(
    ownerId: string,
    programId: string,
    input: CreateShareInput
  ): Promise<CreatedShareResponseDto> {
    if (!Types.ObjectId.isValid(programId)) {
      throw new AppError('Invalid program ID', 400, 'INVALID_ID');
    }

    // Verify program ownership
    const program = await Program.findOne({
      _id: new Types.ObjectId(programId),
      userId: new Types.ObjectId(ownerId),
    });

    if (!program) {
      throw new AppError('Program not found or unauthorized', 404, 'PROGRAM_NOT_FOUND');
    }

    // Generate high-entropy cryptographic token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = this.calculateExpiresAt(input);

    const share = await ProgramShare.create({
      programId: program._id,
      ownerId: new Types.ObjectId(ownerId),
      tokenHash,
      permission: 'VIEW_ONLY',
      expiresAt,
    });

    const shareDto = toShareDto(share);

    return {
      ...shareDto,
      rawToken,
      shareUrl: `/s/${rawToken}`,
    };
  }

  static async getSharesForProgram(ownerId: string, programId: string): Promise<ShareDto[]> {
    if (!Types.ObjectId.isValid(programId)) {
      throw new AppError('Invalid program ID', 400, 'INVALID_ID');
    }

    // Verify program ownership
    const program = await Program.findOne({
      _id: new Types.ObjectId(programId),
      userId: new Types.ObjectId(ownerId),
    });

    if (!program) {
      throw new AppError('Program not found or unauthorized', 404, 'PROGRAM_NOT_FOUND');
    }

    const shares = await ProgramShare.find({
      programId: program._id,
      ownerId: new Types.ObjectId(ownerId),
    }).sort({ createdAt: -1 });

    return shares.map(toShareDto);
  }

  static async revokeShare(ownerId: string, programId: string, shareId: string): Promise<void> {
    if (!Types.ObjectId.isValid(programId) || !Types.ObjectId.isValid(shareId)) {
      throw new AppError('Invalid ID format', 400, 'INVALID_ID');
    }

    const share = await ProgramShare.findOne({
      _id: new Types.ObjectId(shareId),
      programId: new Types.ObjectId(programId),
      ownerId: new Types.ObjectId(ownerId),
    });

    if (!share) {
      throw new AppError('Share link not found or already removed', 404, 'SHARE_NOT_FOUND');
    }

    if (share.revokedAt) {
      return; // Already revoked
    }

    share.revokedAt = new Date();
    await share.save();
  }

  static async getSharedProgram(rawToken: string): Promise<ReadOnlySharedProgramDto> {
    if (!rawToken || typeof rawToken !== 'string' || rawToken.length < 16) {
      throw new AppError('Invalid share link', 404, 'SHARE_NOT_FOUND');
    }

    const tokenHash = this.hashToken(rawToken);

    const share = await ProgramShare.findOne({ tokenHash });
    if (!share) {
      throw new AppError('Share link not found or invalid', 404, 'SHARE_NOT_FOUND');
    }

    // Check revocation
    if (share.revokedAt) {
      throw new AppError('This share link has been revoked by the owner.', 410, 'SHARE_REVOKED');
    }

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) <= new Date()) {
      throw new AppError('This share link has expired.', 410, 'SHARE_EXPIRED');
    }

    const [program, owner] = await Promise.all([
      Program.findById(share.programId),
      User.findById(share.ownerId),
    ]);

    if (!program) {
      throw new AppError('The shared program is no longer available.', 404, 'PROGRAM_NOT_FOUND');
    }

    const ownerName = owner?.name || 'Anonymous Student';

    return toReadOnlySharedProgramDto(program, ownerName, share.expiresAt);
  }
}
