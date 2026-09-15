import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProgram extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  subject: string;
  language: string;
  question?: string;
  code: string;
  notes?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
      index: true,
    },
    question: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      required: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for user-scoped filtering & sorting
programSchema.index({ userId: 1, subject: 1 });
programSchema.index({ userId: 1, language: 1 });
programSchema.index({ userId: 1, isFavorite: 1 });
programSchema.index({ userId: 1, updatedAt: -1 });

// Full text search index
programSchema.index({
  title: 'text',
  question: 'text',
  notes: 'text',
  tags: 'text',
});

export const Program = mongoose.model<IProgram>('Program', programSchema);
