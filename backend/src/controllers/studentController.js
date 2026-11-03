const Student = require('../models/Student');

// @desc    Register a new student
// @route   POST /api/students
// @access  Private (admin)
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create({ ...req.body, school: req.user.school });
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getAllStudents = async (req, res, next) => {
  try {
    const { class: cls, section, isActive, search, page = 1, limit = 10 } = req.query;

    const filter = { school: req.user.school };
    if (req.user.role === 'student') filter.email = req.user.email;
    if (req.user.role === 'parent') { const linked = await Student.find({ school:req.user.school, $or:[{parentUsers:req.user._id},{guardianEmail:req.user.email}] }).distinct('_id'); filter._id = { $in:linked }; }
    if (cls) filter.$and = [{ $or: [{ class: cls }, { classId: cls }] }];
    if (section) filter.section = section;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      const searchFilter = { $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ] };
      filter.$and = [...(filter.$and || []), searchFilter];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: students.map(s => ({ ...s.toObject(), rollNo: s.rollNumber })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, school: req.user.school, ...(req.user.role === 'student' ? { email:req.user.email } : req.user.role === 'parent' ? { $or:[{parentUsers:req.user._id},{guardianEmail:req.user.email}] } : {}) });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (admin)
const updateStudent = async (req, res, next) => {
  try {
    const patch = { ...req.body, school: req.user.school };
    const student = await Student.findOneAndUpdate({ _id: req.params.id, school: req.user.school }, patch, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (admin)
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent };
