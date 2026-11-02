const PlatformSetting = require('../models/PlatformSetting.model');

const getPlatformSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSetting.findOneAndUpdate(
      {},
      { $setOnInsert: {} },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

const updatePlatformSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      'platformName',
      'supportEmail',
      'supportPhone',
      'defaultCurrency',
      'maintenanceMode',
      'allowSchoolRegistration',
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
        message: 'Please provide at least one valid setting to update',
      });
    }

    for (const field of ['maintenanceMode', 'allowSchoolRegistration']) {
      if (
        updates[field] !== undefined &&
        typeof updates[field] !== 'boolean'
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be true or false`,
        });
      }
    }

    const settings = await PlatformSetting.findOneAndUpdate(
      {},
      {
        $set: updates,
        $setOnInsert: {},
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Platform settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformSettings,
  updatePlatformSettings,
};
