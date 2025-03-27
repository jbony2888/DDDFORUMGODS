// src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import { connectDB } from './config/database';  
import userRoutes from './routes/userRoutes';




const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();
  // Use the user routes
app.use('/api/users', userRoutes);



// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
