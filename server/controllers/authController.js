import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const sendOtpEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Verify your Smart Campus Booking email',
    html: `
      <p>Hello ${user.name},</p>
      <p>Your Smart Campus Booking verification OTP is <strong>${user.otpCode}</strong>.</p>
      <p>This OTP expires in 10 minutes.</p>
    `
  });
};

const setOtp = (user) => {
  user.otpCode = createOtp();
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
};

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

    if (existing?.isVerified) return res.status(409).json({ message: 'Email is already registered' });
    if (existing?.role === 'admin') return res.status(403).json({ message: 'Admin accounts cannot signup publicly' });

    const otpCode = createOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`OTP generated for ${normalizedEmail}`);

    let user;
    if (existing) {
      existing.name = name;
      existing.email = normalizedEmail;
      existing.password = password;
      existing.role = role;
      existing.department = department || 'General';
      existing.isVerified = false;
      existing.otpCode = otpCode;
      existing.otpExpiresAt = otpExpiresAt;
      user = await existing.save();
    } else {
      user = await User.create({
          name,
          email: normalizedEmail,
          password,
          role,
          department: department || 'General',
          isVerified: false,
          otpCode,
          otpExpiresAt
        });
    }

    console.log(`User saved: ${user._id} ${user.email}`);

    try {
      await sendOtpEmail(user);
      console.log(`OTP email sent successfully to ${normalizedEmail}`);
      return res.status(201).json({
        message: 'Signup successful. Please verify the OTP sent to your email.',
        email: user.email,
        emailSent: true
      });
    } catch (emailError) {
      console.error('OTP email send failed:', emailError);
      return res.status(502).json({
        message: 'Account created but OTP email could not be sent. Please check SMTP settings and use resend OTP.',
        email: user.email,
        emailSent: false
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: error.message || 'Signup failed' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isVerified) return res.json({ message: 'Email is already verified' });
  if (!user.otpCode || !user.otpExpiresAt) return res.status(400).json({ message: 'No OTP found. Please request a new OTP.' });
  if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
  if (user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({ message: 'Email verified successfully. You can now login.' });
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Admin accounts do not use OTP signup' });
  if (user.isVerified) return res.status(400).json({ message: 'Email is already verified' });

  setOtp(user);
  await user.save();
  try {
    await sendOtpEmail(user);
    console.log(`OTP email resent successfully to ${normalizedEmail}`);
    return res.json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    console.error('Resend OTP email failed:', error);
    return res.status(502).json({ message: 'OTP was generated but email could not be sent. Please check SMTP settings.' });
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

    if (user.role !== 'admin' && !user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

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
