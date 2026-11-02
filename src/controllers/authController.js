const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/User');
const School = require('../models/School.model');
const generateToken = require('../utils/generateToken');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

const hashCode = (code) =>
  crypto.createHash('sha256').update(code).digest('hex');

const createVerificationCode = () =>
  crypto.randomInt(100000, 1000000).toString();

// ================= REGISTER =================
const register = async (req, res, next) => {
  try {
    const { name, email, password, schoolName, role } = req.body;

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || !password ||
      typeof schoolName !== 'string' || !schoolName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and schoolName are required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists.' });
    }

    // Naya School Create karein
    const newSchool = await School.create({
      name: schoolName.trim(),
      isActive: true,
    });

    const code = createVerificationCode();

    // User Create Karein (Super Admin)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || 'superadmin',
      school: newSchool._id,
      schoolId: newSchool._id,
      isEmailVerified: false,
      emailVerificationCodeHash: hashCode(code),
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
      emailVerificationLastSentAt: new Date(),
    });

    // OTP Email Bhejein
    try {
      await sendVerificationEmail(user.email, code);
    } catch (emailError) {
      console.error('Email failed:', emailError);
      return res.status(503).json({
        success: false,
        accountCreated: true,
        message: 'Account created, but email could not be sent. Check config.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Signup successful. Check your email for OTP.',
      data: { id: user._id, email: user.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists.' });
    }
    next(error);
  }
};

// ================= VERIFY EMAIL =================
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (typeof email !== 'string' || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Email and code required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select('+emailVerificationCodeHash +emailVerificationExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid code.' });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified.' });
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'Code expired. Request new.' });
    }

    const storedHash = Buffer.from(user.emailVerificationCodeHash, 'hex');
    const submittedHash = Buffer.from(hashCode(code), 'hex');

    if (storedHash.length !== submittedHash.length || !crypto.timingSafeEqual(storedHash, submittedHash)) {
      return res.status(400).json({ success: false, message: 'Invalid code.' });
    }

    user.isEmailVerified = true;
    user.emailVerificationCodeHash = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationLastSentAt = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified. You can login.' });
  } catch (error) {
    next(error);
  }
};

// ================= RESEND VERIFICATION =================
const resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select('+emailVerificationCodeHash +emailVerificationExpires +emailVerificationLastSentAt');

    if (!user || user.isEmailVerified) {
      return res.status(200).json({ success: true, message: 'If account exists, code sent.' });
    }

    if (user.emailVerificationLastSentAt && Date.now() - user.emailVerificationLastSentAt.getTime() < 60 * 1000) {
      return res.status(429).json({ success: false, message: 'Wait 60 seconds.' });
    }

    const code = createVerificationCode();
    user.emailVerificationCodeHash = hashCode(code);
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerificationLastSentAt = new Date();
    await user.save();

    try {
      await sendVerificationEmail(user.email, code);
    } catch (error) {
      return res.status(503).json({ success: false, message: 'Could not send email.' });
    }

    return res.status(200).json({ success: true, message: 'New code sent.' });
  } catch (error) {
    next(error);
  }
};

// ================= LOGIN =================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (user.isEmailVerified === false) {
      return res.status(403).json({
        success: false,
        message: 'Please verify email first.',
        requiresEmailVerification: true,
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ================= GET ME =================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationCode,
};