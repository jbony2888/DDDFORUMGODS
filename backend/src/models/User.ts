// src/models/User.ts

import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Define the User schema without a default password generator
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true }
});

// Export the User model
export default mongoose.model<IUser>('User', UserSchema);
