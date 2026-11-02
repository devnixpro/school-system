const mongoose = require('mongoose');

const platformSettingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: 'School Management System',
      trim: true,
    },
    supportEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    supportPhone: {
      type: String,
      default: '',
      trim: true,
    },
    defaultCurrency: {
      type: String,
      default: 'PKR',
      trim: true,
      uppercase: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowSchoolRegistration: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'PlatformSetting',
  platformSettingSchema
);
