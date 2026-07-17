import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'professor' | 'researcher' | 'engineer';
  avatar?: string;
  enrolledAt: Date;
  lastLogin?: Date;
  username?: string;
  university?: string;
  department?: string;
  bio?: string;
}

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { 
      type: String, 
      enum: ['student', 'professor', 'researcher', 'engineer'], 
      default: 'student' 
    },
    avatar: { type: String },
    enrolledAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    username: { type: String },
    university: { type: String },
    department: { type: String },
    bio: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Pre-save hook to hash password
UserSchema.pre('save', async function (this: any) {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (this: any, password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);
