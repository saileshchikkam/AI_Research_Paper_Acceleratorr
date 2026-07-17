import mongoose, { Schema } from 'mongoose';

export interface IPaper {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  folderId: string | null;
  isBookmarked: boolean;
  uploadedAt: Date;
  fileType: string;
  size: string;
  content: string;
  pages: string[];
  citations: {
    apa: string;
    mla: string;
    chicago: string;
    harvard: string;
    bibtex: string;
  };
  readingProgress: number;
  chunks?: any[];
  summary?: any;
  insights?: any;
}

const PaperSchema = new Schema<IPaper>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    authors: { type: String, default: '' },
    journal: { type: String, default: '' },
    year: { type: Number, default: new Date().getFullYear() },
    abstract: { type: String, default: '' },
    folderId: { type: String, default: null },
    isBookmarked: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
    fileType: { type: String, default: 'application/pdf' },
    size: { type: String, default: '0 KB' },
    content: { type: String, default: '' },
    pages: { type: [String], default: [] },
    citations: {
      apa: { type: String, default: '' },
      mla: { type: String, default: '' },
      chicago: { type: String, default: '' },
      harvard: { type: String, default: '' },
      bibtex: { type: String, default: '' }
    },
    readingProgress: { type: Number, default: 0 },
    chunks: { type: [Schema.Types.Mixed] as any, default: [] },
    summary: { type: Schema.Types.Mixed },
    insights: { type: Schema.Types.Mixed }
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

PaperSchema.index({ title: 'text', abstract: 'text' });
PaperSchema.index({ folderId: 1 });

export const PaperModel = mongoose.model<IPaper>('Paper', PaperSchema);
