const ThemeSetting = require('../models/ThemeSetting.model');

const getTheme = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const theme = await ThemeSetting.findOne({ school: schoolId }).populate(
      'school',
      'name'
    );

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme settings not found',
      });
    }

    res.status(200).json({
      success: true,
      data: theme,
    });
  } catch (error) {
    next(error);
  }
};

const createOrUpdateTheme = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const theme = await ThemeSetting.findOneAndUpdate(
      { school: schoolId },
      {
        school: schoolId,
        ...req.body,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Theme settings saved successfully',
      data: theme,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheme,
  createOrUpdateTheme,
};