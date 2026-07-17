import mongoose, { Schema } from 'mongoose';

export interface INote {
  _id: string;
  paperId: string;
  title: string;
  content: string;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    _id: { type: String, required: true },
    paperId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
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

NoteSchema.index({ paperId: 1 });

export const NoteModel = mongoose.model<INote>('Note', NoteSchema);
