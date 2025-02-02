import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '../models/User';

const router = express.Router();

/**
 * Inline helper to generate a random alphanumeric password.
 * (In production, consider a more secure approach.)
 */
function generateRandomPassword(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Define the createUser handler with an explicit RequestHandler type
const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, firstName, lastName } = req.body;

    // Validate that all fields are provided
    if (!email || !username || !firstName || !lastName) {
      res.status(400).json({
        error: 'ValidationError',
        data: undefined,
        success: false,
      });
      return;
    }

    // Check if the username is already taken
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      res.status(409).json({
        error: 'UsernameAlreadyTaken',
        data: undefined,
        success: false,
      });
      return;
    }

    // Check if the email is already in use
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      res.status(409).json({
        error: 'EmailAlreadyInUse',
        data: undefined,
        success: false,
      });
      return;
    }

    // Generate a password (since our model requires one)
    const password = generateRandomPassword();

    // Create the new user
    const newUser = new User({ email, username, firstName, lastName, password });
    await newUser.save();

    // Respond with the new user's details (exclude the password)
    res.status(201).json({
      error: undefined,
      data: {
        id: newUser._id, // MongoDB's generated ObjectId
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      success: true,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'ServerError',
      data: undefined,
      success: false,
    });
  }
};

// Use the handler in your router
router.post('/users/new', createUser);

export default router;
