
const mongoose = require('mongoose');
const User = require('../models/User');
const School = require('../models/School.model');
const generateToken = require('../utils/generateToken');

const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// Register school admin, student, or parent.
const register = async (req, res, next) => {
  try {
    const { name, email, password, schoolId, schoolName } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.'
      });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 100 characters.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const isSchoolSignup =
      !schoolId &&
      typeof schoolName === 'string' &&
      schoolName.trim().length > 0;

    const role = isSchoolSignup
      ? 'admin'
      : req.body.role === 'parent'
        ? 'parent'
        : 'student';

    if (!isSchoolSignup && !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'A valid schoolId is required.'
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }

    let school;

    if (isSchoolSignup) {
      school = await School.create({
        name: schoolName.trim(),
        email: normalizedEmail
      });
    } else {
      if (!mongoose.isValidObjectId(schoolId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID.'
        });
      }

      school = await School.findOne({
        _id: schoolId,
        isActive: true
      });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'Active school not found.'
        });
      }
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      school: school._id
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: isSchoolSignup
        ? 'School and admin account created successfully.'
        : `${role === 'parent' ? 'Parent' : 'Student'} account registered successfully.`,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A record with this information already exists.'
      });
    }

    next(error);
  }
};

// Login existing user.
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const user = await User.findOne({
      email: normalizedEmail
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account is deactivated.'
      });
    }

    if (user.role !== 'superadmin') {
      if (!user.school) {
        return res.status(401).json({
          success: false,
          message: 'Your account is not assigned to a school.'
        });
      }

      const school = await School.findById(user.school)
        .select('isActive');

      if (!school || !school.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your school is inactive or no longer available.'
        });
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user profile.
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('school', 'name isActive');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
