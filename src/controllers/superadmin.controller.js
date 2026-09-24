const School = require('../models/School.model');
const Subscription = require('../models/Subscription.model');

const getDashboard = async (req, res, next) => {
  try {
    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ isActive: true });
    const inactiveSchools = await School.countDocuments({ isActive: false });
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({
      status: 'active',
    });

    res.status(200).json({
      success: true,
      data: {
        totalSchools,
        activeSchools,
        inactiveSchools,
        totalSubscriptions,
        activeSubscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSchools = async (req, res, next) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools,
    });
  } catch (error) {
    next(error);
  }
};

const createSchool = async (req, res, next) => {
  try {
    const school = await School.create(req.body);

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

const updateSchool = async (req, res, next) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: school,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSchool = async (req, res, next) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'School deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
};