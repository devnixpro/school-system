const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class.model');

const getDashboard = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments({ school: req.user.school });
    const totalTeachers = await Teacher.countDocuments({ school: req.user.school });
    const totalClasses = await Class.countDocuments({ school: req.user.school });

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
    const students = await Student.find({ school: req.user.school }).sort({ createdAt: -1 });

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
    const teachers = await Teacher.find({ school: req.user.school }).sort({ createdAt: -1 });

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
    const classes = await Class.find({ school: req.user.school })
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

module.exports = {
  getDashboard,
  getStudents,
  getTeachers,
  getClasses,
};