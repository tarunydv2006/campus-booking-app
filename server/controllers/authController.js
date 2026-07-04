import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  createdAt: user.createdAt
});

export const signup = async (req, res) => {
  try {
    const { name, email, password, role = 'student', department } = req.body;
    const safeBody = { ...req.body };
    delete safeBody.password;
    console.log('Signup request body:', safeBody);

    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
    if (!['student', 'faculty'].includes(role)) {
      return res.status(400).json({ message: 'Public registration is limited to student and faculty accounts' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    console.log(`Signup user exists check for ${normalizedEmail}: ${Boolean(existing)}`);

    if (existing) return res.status(409).json({ message: 'Email is already registered' });
    if (existing?.role === 'admin') return res.status(403).json({ message: 'Admin accounts cannot signup publicly' });

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
      department: department || 'General'
    });

    console.log(`User created successfully: userId=${user._id}, email=${user.email}`);
    return res.status(201).json({
      message: 'Signup successful. You can now login.',
      email: user.email
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: error.message || 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    console.log(`Login user lookup for ${normalizedEmail}: ${user ? 'found' : 'not found'}`);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await user.matchPassword(password);
    console.log(`Login password match for ${normalizedEmail}: ${passwordMatch}`);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid password' });

    return res.json({ user: serializeUser(user), token: generateToken(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Login failed' });
  }
};

export const me = async (req, res) => {
  res.json({ user: serializeUser(req.user) });
};

export const register = signup;
