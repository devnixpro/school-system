const mongoose = require('mongoose');
const Subscription = require('../models/Subscription.model');
const School = require('../models/School.model');

const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('school', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req, res, next) => {
  try {
    const { school, plan, startDate, endDate } = req.body;

    if (!school || !plan || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'School, plan, start date and end date are required',
      });
    }

    if (!mongoose.isValidObjectId(school)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school ID',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid dates; end date must not precede start date',
      });
    }

    const schoolExists = await School.findById(school);

    if (!schoolExists) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
      });
    }

    const subscription = await Subscription.create({
      school,
      plan,
      startDate: start,
      endDate: end,
    });

    await subscription.populate('school', 'name email');

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription ID',
      });
    }

    const allowedFields = [
      'school',
      'plan',
      'status',
      'startDate',
      'endDate',
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid subscription fields provided',
      });
    }

    if (
      updates.school !== undefined &&
      !mongoose.isValidObjectId(updates.school)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school ID',
      });
    }

    if (updates.school !== undefined) {
      const schoolExists = await School.findById(updates.school);

      if (!schoolExists) {
        return res.status(404).json({
          success: false,
          message: 'School not found',
        });
      }
    }

    const existing = await Subscription.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    const start = new Date(updates.startDate ?? existing.startDate);
    const end = new Date(updates.endDate ?? existing.endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid dates; end date must not precede start date',
      });
    }

    const subscription = await Subscription.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('school', 'name email');

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubscription = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription ID',
      });
    }

    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
