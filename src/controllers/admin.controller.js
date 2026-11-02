const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class.model');
const User = require('../models/User');

const getDashboard = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalClasses = await Class.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'name email')
      .populate('school', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    next(error);
  }
};
const createParent = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const schoolId = req.user.school;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: 'No school is assigned to this admin.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const parent = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'parent',
      school: schoolId,
      schoolId,
      isEmailVerified: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Parent account created successfully.',
      data: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
        role: parent.role,
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

module.exports = {
  getDashboard,
  getStudents,
  getTeachers,
  getClasses,
  createParent,
};