const School = require('../models/School.model');
const Subscription = require('../models/Subscription.model');
const User = require('../models/User');

const getPlatformAnalytics = async (req, res, next) => {
  try {
    const [
      totalSchools,
      activeSchools,
      inactiveSchools,
      totalSubscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
      expiredSubscriptions,
      totalUsers,
      superadmins,
      admins,
      teachers,
      students,
      parents,
    ] = await Promise.all([
      School.countDocuments(),
      School.countDocuments({ isActive: true }),
      School.countDocuments({ isActive: false }),
      Subscription.countDocuments(),
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ status: 'inactive' }),
      Subscription.countDocuments({ status: 'expired' }),
      User.countDocuments(),
      User.countDocuments({ role: 'superadmin' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'parent' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        schools: {
          total: totalSchools,
          active: activeSchools,
          inactive: inactiveSchools,
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          inactive: inactiveSubscriptions,
          expired: expiredSubscriptions,
        },
        users: {
          total: totalUsers,
          superadmins,
          admins,
          teachers,
          students,
          parents,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlatformAnalytics };
