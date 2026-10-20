
const Student = require('../models/Student');

// @desc    Get children linked to the logged-in parent
// @route   GET /api/parent/children
// @access  Private (parent)
const getMyChildren = async (req, res, next) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent account required.',
      });
    }

    const children = await Student.find({
      parent: req.user._id,
      school: req.user.school,
      isActive: true,
    })
      .select(
        'name email rollNumber dateOfBirth gender class section guardianName guardianPhone school'
      )
      .populate('school', 'name')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: children.length,
      data: children,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyChildren,
};

