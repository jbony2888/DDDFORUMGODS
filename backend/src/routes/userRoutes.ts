import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
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
const createUser: RequestHandler = async (req, res, next) => {
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
        id: newUser._id,
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

// Define the editUser handler
const editUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { email, username, firstName, lastName } = req.body;

    if (!email || !username || !firstName || !lastName) {
      res.status(400).json({
        error: 'ValidationError',
        data: undefined,
        success: false,
      });
      return;
    }

    // Validate userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        error: 'InvalidUserId',
        data: undefined,
        success: false,
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      res.status(404).json({
        error: 'UserNotFound',
        data: undefined,
        success: false,
      });
      return;
    }

    // Check if the username is already taken by another user
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername && existingUserByUsername._id.toString() !== userId) {
      res.status(409).json({
        error: 'UsernameAlreadyTaken',
        data: undefined,
        success: false,
      });
      return;
    }

    // Check if the email is already in use by another user
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail && existingUserByEmail._id.toString() !== userId) {
      res.status(409).json({
        error: 'EmailAlreadyInUse',
        data: undefined,
        success: false,
      });
      return;
    }

    // Update user details
    user.email = email;
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();

    res.status(200).json({
      error: undefined,
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      success: true,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'ServerError',
      data: undefined,
      success: false,
    });
  }
};


// Get User by Email
const getUserByEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        error: 'ValidationError',
        data: undefined,
        success: false,
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        error: 'UserNotFound',
        data: undefined,
        success: false,
      });
      return;
    }

    res.status(200).json({
      error: undefined,
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      success: true,
    });

    return; // ✅ Explicitly return void
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'ServerError',
      data: undefined,
      success: false,
    });
    return;
  }
};





router.get('/', getUserByEmail);
router.post('/new', createUser);
router.post('/edit/:userId', editUser);


export default router;
