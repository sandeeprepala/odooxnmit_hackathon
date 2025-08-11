import User from '../models/User.js';
import { signJwt } from '../utils/token.js';

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password, phone });
  const token = signJwt({ id: user._id, role: user.role });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
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


