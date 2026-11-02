const School = require('../models/School.model');
const Subscription = require('../models/Subscription.model');
const Settings = require('../models/Settings.model');
const User = require('../models/User'); // Naya import add kiya

// 1. SUBSCRIPTIONS
const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate('school', 'name email');
    res.status(200).json({ success: true, count: subscriptions.length, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json({ success: true, message: 'Subscription created', data: subscription });
  } catch (error) {
    next(error);
  }
};

// 2. ANALYTICS (Updated with Real Users)
const getAnalytics = async (req, res, next) => {
  try {
    const totalSchools = await School.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    const totalUsers = await User.countDocuments(); // Ab asli users count aayegi
    
    res.status(200).json({
      success: true,
      data: {
        totalSchools,
        totalSubscriptions,
        totalUsers,            // Real count
        totalRevenue: 0,       // Dummy (Future)
        monthlyData: [],       // Dummy (Future)
        topCities: [],         // Dummy (Future)
        planDistribution: []   // Dummy (Future)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. SETTINGS
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); 
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, message: 'Settings updated', data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptions,
  createSubscription,
  getAnalytics,
  getSettings,
  updateSettings,
};