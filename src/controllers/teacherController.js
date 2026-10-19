const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const School = require('../models/School.model');

// @desc    Add a new teacher
// @route   POST /api/teachers
// @access  Private (admin)
const createTeacher = async (req, res, next) => {
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
  employeeId,
  subject,
  phone,
  address,
  qualification,
  joiningDate,
  isActive,
} = req.body;

const teacher = await Teacher.create({
  name,
  email,
  employeeId,
  subject,
  phone,
  address,
  qualification,
  joiningDate,
  ...(isActive !== undefined ? { isActive } : {}),
  school: schoolId,
});

return res.status(201).json({
  success: true,
  message: 'Teacher added successfully.',
  data: teacher,
});


} catch (error) {
return next(error);
}
};

// @desc    Get all teachers in the admin's school
// @route   GET /api/teachers
// @access  Private
const getAllTeachers = async (req, res, next) => {
try {
const schoolId = req.user.school;


if (!schoolId) {
  return res.status(403).json({
    success: false,
    message: 'No school is assigned to this user.',
  });
}

const { subject, isActive, search, page = 1, limit = 10 } = req.query;

const currentPage = Math.max(1, parseInt(page, 10) || 1);
const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

const filter = { school: schoolId };

if (subject && subject.trim()) {
  const escapedSubject = subject.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  filter.subject = { $regex: escapedSubject, $options: 'i' };
}

if (isActive !== undefined) {
  filter.isActive = isActive === 'true';
}

if (search && search.trim()) {
  const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  filter.$or = [
    { name: { $regex: escapedSearch, $options: 'i' } },
    { email: { $regex: escapedSearch, $options: 'i' } },
    { employeeId: { $regex: escapedSearch, $options: 'i' } },
  ];
}

const skip = (currentPage - 1) * pageLimit;
const total = await Teacher.countDocuments(filter);

const teachers = await Teacher.find(filter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(pageLimit);

return res.status(200).json({
  success: true,
  count: teachers.length,
  total,
  totalPages: Math.ceil(total / pageLimit),
  currentPage,
  data: teachers,
});


} catch (error) {
return next(error);
}
};

// @desc    Get a single teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
const getTeacherById = async (req, res, next) => {
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
    message: 'Invalid teacher ID.',
  });
}

const teacher = await Teacher.findOne({
  _id: req.params.id,
  school: schoolId,
});

if (!teacher) {
  return res.status(404).json({
    success: false,
    message: 'Teacher not found in your school.',
  });
}

return res.status(200).json({
  success: true,
  data: teacher,
});


} catch (error) {
return next(error);
}
};

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private (admin)
const updateTeacher = async (req, res, next) => {
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
    message: 'Invalid teacher ID.',
  });
}

const allowedFields = [
  'name',
  'email',
  'employeeId',
  'subject',
  'phone',
  'address',
  'qualification',
  'joiningDate',
  'isActive',
];

const updates = {};

for (const field of allowedFields) {
  if (req.body[field] !== undefined) {
    updates[field] = req.body[field];
  }
}

const teacher = await Teacher.findOneAndUpdate(
  { _id: req.params.id, school: schoolId },
  { $set: updates },
  { new: true, runValidators: true }
);

if (!teacher) {
  return res.status(404).json({
    success: false,
    message: 'Teacher not found in your school.',
  });
}

return res.status(200).json({
  success: true,
  message: 'Teacher updated successfully.',
  data: teacher,
});


} catch (error) {
return next(error);
}
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private (admin)
const deleteTeacher = async (req, res, next) => {
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
    message: 'Invalid teacher ID.',
  });
}

const teacher = await Teacher.findOneAndDelete({
  _id: req.params.id,
  school: schoolId,
});

if (!teacher) {
  return res.status(404).json({
    success: false,
    message: 'Teacher not found in your school.',
  });
}

return res.status(200).json({
  success: true,
  message: 'Teacher deleted successfully.',
});


} catch (error) {
return next(error);
}
};

module.exports = {
createTeacher,
getAllTeachers,
getTeacherById,
updateTeacher,
deleteTeacher,
};
