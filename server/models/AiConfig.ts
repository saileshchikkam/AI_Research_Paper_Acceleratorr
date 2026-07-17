import mongoose, { Schema } from 'mongoose';

export interface IAiConfig {
  _id: string;
  temperature: number;
  chunkSize: number;
  persona: string;
}

const AiConfigSchema = new Schema<IAiConfig>(
  {
    _id: { type: String, required: true },
    temperature: { type: Number, default: 0.2 },
    chunkSize: { type: Number, default: 4000 },
    persona: { type: String, default: 'scholarly' }
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

export const AiConfigModel = mongoose.model<IAiConfig>('AiConfig', AiConfigSchema);
