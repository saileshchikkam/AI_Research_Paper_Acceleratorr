import mongoose, { Schema } from 'mongoose';

export interface IStudyActivity {
  _id: string;
  userId: string;
  type: 'read' | 'chat' | 'quiz' | 'flashcard' | 'note';
  paperTitle: string;
  paperId?: string;
  detail: string;
  timestamp: Date;
}

const StudyActivitySchema = new Schema<IStudyActivity>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['read', 'chat', 'quiz', 'flashcard', 'note'], 
      required: true 
    },
    paperTitle: { type: String, required: true },
    paperId: { type: String },
    detail: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
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

StudyActivitySchema.index({ userId: 1, timestamp: -1 });

export const StudyActivityModel = mongoose.model<IStudyActivity>('StudyActivity', StudyActivitySchema);
