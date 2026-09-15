import mongoose, { Document, Schema, Types } from 'mongoose';

export type SharePermission = 'VIEW_ONLY';

export interface IProgramShare extends Document {
  _id: Types.ObjectId;
  programId: Types.ObjectId;
  ownerId: Types.ObjectId;
  tokenHash: string;
  permission: SharePermission;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const programShareSchema = new Schema<IProgramShare>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    permission: {
      type: String,
      enum: ['VIEW_ONLY'],
      default: 'VIEW_ONLY',
      required: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying program shares
programShareSchema.index({ programId: 1, revokedAt: 1 });

export const ProgramShare = mongoose.model<IProgramShare>('ProgramShare', programShareSchema);
