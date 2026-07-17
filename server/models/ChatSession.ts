import mongoose, { Schema } from 'mongoose';

export interface ISource {
  title: string;
  snippet: string;
  page?: number;
}

export interface IMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  sources?: ISource[];
}

export interface IChatSession {
  _id: string;
  paperId: string;
  title: string;
  lastMessageAt: Date;
  messages: IMessage[];
}

const SourceSchema = new Schema<ISource>({
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  page: { type: Number }
}, { _id: false });

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sources: { type: [SourceSchema], default: [] }
}, { _id: false });

const ChatSessionSchema = new Schema<IChatSession>(
  {
    _id: { type: String, required: true },
    paperId: { type: String, required: true },
    title: { type: String, required: true },
    lastMessageAt: { type: Date, default: Date.now },
    messages: { type: [MessageSchema], default: [] }
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

ChatSessionSchema.index({ paperId: 1 });

export const ChatSessionModel = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
