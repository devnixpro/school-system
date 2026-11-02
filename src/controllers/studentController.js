
const mongoose = require('mongoose');

const Student = require('../models/Student');
const School = require('../models/School.model');
const User = require('../models/User');

// Validate that the parent belongs to the same school and is active.
const validateParent = async (parentId, schoolId) => {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    return null;
  }

  return User.findOne({
    _id: parentId,
    role: 'parent',
    school: schoolId,
    isActive: true,
  });
};

// @desc    Register a new student
// @route   POST /api/students
// @access  Private (admin)
const createStudent = async (req, res, next) => {
  try {
    const schoolId = req.user.school;

    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: 'No school is assigned to this admin.',
      });
    }

    const school = await School.findById(schoolId);

    if (!school || !school.isActive) {
      return res.status(400).json({
        success: false,
        message: 'The assigned school does not exist or is inactive.',
      });
    }

    const {
      name,
      email,
      rollNumber,
      dateOfBirth,
      gender,
      phone,
      address,
      class: studentClass,
      section,
      guardianName,
      guardianPhone,
      parentId,
      isActive,
    } = req.body;

    let parent = null;

    if (parentId !== undefined && parentId !== null && parentId !== '') {
      parent = await validateParent(parentId, schoolId);

      if (!parent) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid parent. The parent must have an active account in your school.',
        });
      }
    }

    const student = await Student.create({
      name,
      email,
      rollNumber,
      dateOfBirth,
      gender,
      phone,
      address,
      class: studentClass,
      section,
      guardianName,
      guardianPhone,
      parent: parent ? parent._id : null,
      ...(isActive !== undefined ? { isActive } : {}),
      school: schoolId,
    });

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully.',
      data: student,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get all students in the user's school
// @route   GET /api/students
// @access  Private
const getAllStudents = async (req, res, next) => {
  try {
    const schoolId = req.user.school;

    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: 'No school is assigned to this user.',
      });
    }

    const {
      class: studentClass,
      section,
      isActive,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 10)
    );

    const filter = { school: schoolId };

    if (studentClass) {
      filter.class = studentClass;
    }

    if (section) {
      filter.section = section;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (search && search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      filter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
        { rollNumber: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const skip = (currentPage - 1) * pageLimit;

    const total = await Student.countDocuments(filter);

    const students = await Student.find(filter)
      .populate('parent', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / pageLimit),
      currentPage,
      data: students,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const schoolId = req.user.school;

    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: 'No school is assigned to this user.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID.',
      });
    }

    const student = await Student.findOne({
      _id: req.params.id,
      school: schoolId,
    }).populate('parent', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in your school.',
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private (admin)
const updateStudent = async (req, res, next) => {
  try {
    const schoolId = req.user.school;

    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: 'No school is assigned to this admin.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID.',
      });
    }

    const allowedFields = [
      'name',
      'email',
      'rollNumber',
      'dateOfBirth',
      'gender',
      'phone',
      'address',
      'class',
      'section',
      'guardianName',
      'guardianPhone',
      'isActive',
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Link, change, or unlink the parent account.
    if (req.body.parentId !== undefined) {
      const { parentId } = req.body;

      if (parentId === null || parentId === '') {
        updates.parent = null;
      } else {
        const parent = await validateParent(parentId, schoolId);

        if (!parent) {
          return res.status(400).json({
            success: false,
            message:
              'Invalid parent. The parent must have an active account in your school.',
          });
        }

        updates.parent = parent._id;
      }
    }

    const student = await Student.findOneAndUpdate(
      {
        _id: req.params.id,
        school: schoolId,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).populate('parent', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in your school.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      data: student,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private (admin)
const deleteStudent = async (req, res, next) => {
  try {
    const schoolId = req.user.school;

    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: 'No school is assigned to this admin.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID.',
      });
    }

    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      school: schoolId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in your school.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

