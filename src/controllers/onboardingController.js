const School = require('../models/School.model');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token & Set Cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
      },
    });
};

// @desc    Save Onboarding data & Create School + Admin Account
// @route   POST /api/onboarding/save
// @access  Public (During Setup)
exports.saveOnboarding = async (req, res, next) => {
  try {
    const { personalInfo, schoolDetails, selectedModules } = req.body;

    // 1. Validation check
    if (!schoolDetails || !personalInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete school and personal details.',
      });
    }

    // 2. Check if admin email already exists
    const existingUser = await User.findOne({ email: personalInfo.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // 3. Create School Document (Aapke updated School schema ke mutabiq 'name' field use karein)
    const school = await School.create({
      name: schoolDetails.schoolName, // School schema me field ka naam 'name' hai
      city: schoolDetails.city || 'Lahore',
      address: schoolDetails.address,
      phone: personalInfo.phone,
      studentCount: schoolDetails.studentCount || 500,
      academicYear: schoolDetails.academicYear || '2026-2027',
      branchName: schoolDetails.branchName || 'Main Campus',
      selectedModules: selectedModules || [],
    });

    // 4. Create Admin User linked to this School
    const tempPassword = personalInfo.password || 'Admin@123'; 

    const adminUser = await User.create({
      name: personalInfo.fullName,
      email: personalInfo.email,
      password: tempPassword,
      role: 'admin',
      school: school._id,     // Main school reference
      schoolId: school._id,   // Payment gateway compatibility reference
      phone: personalInfo.phone,
    });

    // 5. Send response with HttpOnly Cookie
    sendTokenResponse(adminUser, 201, res);
  } catch (error) {
    console.error('Onboarding Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error during onboarding',
    });
  }
};