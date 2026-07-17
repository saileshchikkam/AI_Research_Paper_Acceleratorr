import mongoose, { Schema } from 'mongoose';

export interface ISavedCitation {
  _id: string;
  paperId: string;
  paperTitle: string;
  format: 'apa' | 'mla' | 'chicago' | 'harvard' | 'bibtex';
  citationText: string;
  savedAt: Date;
}

const SavedCitationSchema = new Schema<ISavedCitation>(
  {
    _id: { type: String, required: true },
    paperId: { type: String, required: true },
    paperTitle: { type: String, required: true },
    format: { 
      type: String, 
      enum: ['apa', 'mla', 'chicago', 'harvard', 'bibtex'], 
      required: true 
    },
    citationText: { type: String, required: true },
    savedAt: { type: Date, default: Date.now }
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

SavedCitationSchema.index({ paperId: 1 });

export const SavedCitationModel = mongoose.model<ISavedCitation>('SavedCitation', SavedCitationSchema);
