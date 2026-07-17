import mongoose, { Schema } from 'mongoose';

export interface IFlashcard {
  _id: string;
  paperId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  lastReviewed?: Date;
  category?: string;
}

const FlashcardSchema = new Schema<IFlashcard>(
  {
    _id: { type: String, required: true },
    paperId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard', null], 
      default: null 
    },
    lastReviewed: { type: Date },
    category: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

FlashcardSchema.index({ paperId: 1 });

export const FlashcardModel = mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);
