import express from 'express';
import { User } from '../models/User';
import { hashPassword, verifyPassword } from '../utils/password';
import { ApiResponse, ApiError, UserDTO, Errors } from './types';

const router = express.Router();

function toDTO(u: any): UserDTO {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    firstName: u.firstName,
    lastName: u.lastName,
  };
}

function ok<T>(data: T): ApiResponse<T> { return { error: undefined, data, success: true }; }
function err(error: ApiError): ApiResponse<undefined> { return { error, data: undefined, success: false }; }

// CreateUser - POST /users/new
router.post('/new', async (req, res) => {
  try {
    const { email, username, firstName, lastName, password } = req.body || {};

    // Basic validation
    if (!email || !username || !firstName || !lastName || !password) {
      return res.status(400).json(err(Errors.ValidationError));
    }

    // Uniqueness checks
    const existingByUsername = await User.findOne({ username }).exec();
    if (existingByUsername) {
      return res.status(409).json(err(Errors.UsernameAlreadyTaken));
    }

    const existingByEmail = await User.findOne({ email }).exec();
    if (existingByEmail) {
      return res.status(409).json(err(Errors.EmailAlreadyInUse));
    }

    const hashedPassword = hashPassword(password);

    const created = await User.create({ email, username, firstName, lastName, password: hashedPassword });

    return res.status(201).json(ok<UserDTO>(toDTO(created)));
  } catch (e) {
    console.error(e);
    return res.status(500).json(err(Errors.ServerError));
  }
});

// EditUser - POST /users/edit/:userId
router.post('/edit/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, username, firstName, lastName } = req.body || {};

    // Basic validation - only check provided fields are not null/undefined
    const providedFields = [email, username, firstName, lastName].filter(f => f !== undefined);
    if (providedFields.some((v) => v === null)) {
      return res.status(400).json(err(Errors.ValidationError));
    }

    const user = await User.findOne({ id: Number(userId) }).exec();
    if (!user) {
      return res.status(404).json(err(Errors.UserNotFound));
    }

    // Check unique constraints if values are changing
    if (username && username !== user.username) {
      const existsU = await User.findOne({ username }).exec();
      if (existsU) {
        return res.status(409).json(err(Errors.UsernameAlreadyTaken));
      }
    }

    if (email && email !== user.email) {
      const existsE = await User.findOne({ email }).exec();
      if (existsE) {
        return res.status(409).json(err(Errors.EmailAlreadyInUse));
      }
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    return res.status(200).json(ok<UserDTO>(toDTO(user)));
  } catch (e) {
    console.error(e);
    return res.status(500).json(err(Errors.ServerError));
  }
});

// GetUserByEmail - GET /users?email=...
router.get('/', async (req, res) => {
  try {
    const { email } = req.query as { email?: string };
    if (!email) {
      return res.status(400).json(err(Errors.ValidationError));
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json(err(Errors.UserNotFound));
    }

    return res.status(200).json(ok<UserDTO>(toDTO(user)));
  } catch (e) {
    console.error(e);
    return res.status(500).json(err(Errors.ServerError));
  }
});

// Login - POST /users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json(err(Errors.ValidationError));
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json(err(Errors.UserNotFound));
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json(err(Errors.InvalidCredentials));
    }

    return res.status(200).json(ok<UserDTO>(toDTO(user)));
  } catch (e) {
    console.error(e);
    return res.status(500).json(err(Errors.ServerError));
  }
});

export default router;
