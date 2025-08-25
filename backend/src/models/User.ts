import mongoose, { type HydratedDocument, type Model } from 'mongoose';
import { getNextSequence } from './Counter';

export interface IUser {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<IUser>;
export type UserModel = Model<IUser>;

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true, required: true },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre('validate', async function (next) {
  const doc = this as any;
  if (doc.isNew && !doc.id) {
    doc.id = await getNextSequence('User');
  }
  next();
});

// 🔧 Key line: bypass overloaded signature resolution
const untypedModel = (mongoose.model as unknown as (...args: any[]) => any);
// If your setup is *very* strict, also cast the schema: (UserSchema as any)
export const User = untypedModel('User', UserSchema) as UserModel;
