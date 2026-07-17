import mongoose, { Schema } from 'mongoose';

export interface IFolder {
  _id: string;
  name: string;
  description: string;
  color: string;
  userId: string;
  createdAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#3B82F6' },
    userId: { type: String, required: true },
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

FolderSchema.index({ userId: 1 });

export const FolderModel = mongoose.model<IFolder>('Folder', FolderSchema);
