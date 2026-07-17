import mongoose, { Schema } from 'mongoose';

export interface ISynthesisTableItem {
  heading: string;
  values: Record<string, string>;
}

export interface ILiteratureReview {
  _id: string;
  title: string;
  papers: string[];
  synthesisTable: ISynthesisTableItem[];
  summary: string;
  gapAnalysis: string;
  createdAt: Date;
}

const SynthesisTableItemSchema = new Schema<ISynthesisTableItem>({
  heading: { type: String, required: true },
  values: { type: Map, of: String, default: {} }
}, { _id: false });

const LiteratureReviewSchema = new Schema<ILiteratureReview>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    papers: { type: [String], default: [] },
    synthesisTable: { type: [SynthesisTableItemSchema], default: [] },
    summary: { type: String, default: '' },
    gapAnalysis: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
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

export const LiteratureReviewModel = mongoose.model<ILiteratureReview>('LiteratureReview', LiteratureReviewSchema);
