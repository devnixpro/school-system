const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/User');
const School = require('../models/School.model');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const generateToken = require('../utils/generateToken');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

// Helper functions for email verification
const hashCode = (code) =>
  crypto.createHash('sha256').update(code).digest('hex');

const createVerificationCode = () =>
  crypto.randomInt(100000, 1000000).toString();

// ================= GET ACTIVE SCHOOLS LIST =================
const getActiveSchoolsList = async (req, res, next) => {
  try {
    const schools = await School.find({ isActive: true }).select('name _id');
    return res.status(200).json({
      success: true,
      data: schools,
    });
  } catch (error) {
    next(error);
  }
};

// ================= REGISTER =================
// Handles both Super Admin registration (with schoolName) and Student/Teacher registration (with schoolId)
const register = async (req, res, next) => {
  try {
    const { name, email, password, schoolId, schoolName, role = 'student' } = req.body;

    // Check if registering as a Super Admin (creating a new school)
    if (role === 'superadmin' || schoolName) {
      if (
        typeof name !== 'string' || !name.trim() ||
        typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || !password ||
        typeof schoolName !== 'string' || !schoolName.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, password, and schoolName are required for Super Admin registration.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters.',
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

      // Create new School
      const newSchool = await School.create({
        name: schoolName.trim(),
        isActive: true,
      });

      const code = createVerificationCode();

      // Create User Account (Super Admin)
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'superadmin',
        school: newSchool._id,
        schoolId: newSchool._id,
        isEmailVerified: false,
        emailVerificationCodeHash: hashCode(code),
        emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
        emailVerificationLastSentAt: new Date(),
      });

      // Send OTP Email
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
    }

    // Otherwise, handle Student or Teacher registration (Must be pre-added by school admin)
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || !password ||
      typeof schoolId !== 'string' || !schoolId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and schoolId are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!mongoose.isValidObjectId(schoolId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school ID.',
      });
    }

    const school = await School.findOne({
      _id: schoolId,
      isActive: true,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'Active school not found.',
      });
    }

    let verifiedSchoolId = school._id;

    if (role === 'student') {
      const studentRecord = await Student.findOne({ email: normalizedEmail });
      if (!studentRecord) {
        return res.status(403).json({
          success: false,
          message: 'Registration Denied: This email is not approved or added by the school admin as a student.',
        });
      }
      verifiedSchoolId = studentRecord.school || school._id;
    } else if (role === 'teacher') {
      const teacherRecord = await Teacher.findOne({ email: normalizedEmail });
      if (!teacherRecord) {
        return res.status(403).json({
          success: false,
          message: 'Registration Denied: This email is not approved or added by the school admin as a teacher.',
        });
      }
      verifiedSchoolId = teacherRecord.school || school._id;
    } else if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized role registration attempt.',
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    // Create User Account for student/teacher
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === 'teacher' ? 'teacher' : 'student',
      school: verifiedSchoolId,
      schoolId: verifiedSchoolId,
      isEmailVerified: true, // Auto-verify or adjust based on your requirement
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        schoolId: user.schoolId,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
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

    if (
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account is deactivated.',
      });
    }

    // Check if email verification is required for non-verified users
    if (user.isEmailVerified === false) {
      return res.status(403).json({
        success: false,
        message: 'Please verify email first.',
        requiresEmailVerification: true,
      });
    }

    if (user.role !== 'superadmin') {
      if (!user.school) {
        return res.status(401).json({
          success: false,
          message: 'Your account is not assigned to a school.',
        });
      }

      const school = await School.findById(user.school).select('isActive');

      if (!school || !school.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your school is inactive or no longer available.',
        });
      }
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        schoolId: user.schoolId || user.school,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= GET ME =================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('school', 'name isActive');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  getActiveSchoolsList,
  verifyEmail,
  resendVerificationCode,
};