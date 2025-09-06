import User from '../models/User.js';
import { signJwt } from '../utils/token.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

export async function register(req, res) {
  const { name, email, password, phone, role } = req.body;
  
  // Validate role
  if (role && !['customer', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be customer or admin' });
  }
  
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  
  const user = await User.create({ name, email, password, phone, role: role || 'customer' });
  const token = signJwt({ id: user._id, role: user.role });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
}

export async function login(req, res) {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  
  // Check if user is active
  if (!user.isActive) return res.status(400).json({ message: 'Account is deactivated' });
  
  // If role is specified during login, verify it matches user's role
  if (role && user.role !== role) {
    return res.status(400).json({ message: 'Invalid role for this account' });
  }
  
  const token = signJwt({ id: user._id, role: user.role });
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
}

export async function getProfile(req, res) {
  res.json({ user: req.user });
}

export async function updateProfile(req, res) {
  const updates = (({ name, phone, address }) => ({ name, phone, address }))(req.body);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ user });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Save OTP to user
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = otpExpiry;
    await user.save();
    
    // Send OTP via email
    const emailContent = `
      <h2>Password Reset Request</h2>
      <p>You have requested to reset your password.</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    
    await sendEmail(user.email, 'Password Reset OTP', emailContent);
    
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
}

export async function verifyOTP(req, res) {
  const { email, otp } = req.body;
  
  try {
    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
}

export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Update password and clear OTP fields
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}


