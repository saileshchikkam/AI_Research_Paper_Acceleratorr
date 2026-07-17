import mongoose, { Schema } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface IQuiz {
  _id: string;
  paperId: string;
  title: string;
  questions: IQuizQuestion[];
  score?: number;
  takenAt?: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answerIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const QuizSchema = new Schema<IQuiz>(
  {
    _id: { type: String, required: true },
    paperId: { type: String, required: true },
    title: { type: String, required: true },
    questions: { type: [QuizQuestionSchema], default: [] },
    score: { type: Number },
    takenAt: { type: Date }
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

QuizSchema.index({ paperId: 1 });

export const QuizModel = mongoose.model<IQuiz>('Quiz', QuizSchema);
