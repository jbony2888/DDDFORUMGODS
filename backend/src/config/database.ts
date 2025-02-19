// config/database.ts

// Load environment variables from the .env file

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
const mongoURI: string = process.env.MONGODB_URI ?? 'mongodb+srv://jerrybony5:xfCiY2r321ZkXwAd@cluster0.vke9emx.mongodb.net/';



// Optional: Set mongoose options (like strictQuery)
mongoose.set('strictQuery', false);

/**
 * Connect to MongoDB.
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB', process.env.MONGODB_URI);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
