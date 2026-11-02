const mongoose = require('mongoose');

const themeSettingSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School is required'],
      unique: true,
    },
    primaryColor: {
      type: String,
      default: '#14B8A6',
      trim: true,
    },
    secondaryColor: {
      type: String,
      default: '#8B7CF6',
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    favicon: {
      type: String,
      trim: true,
    },
    fontFamily: {
      type: String,
      default: 'Inter',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ThemeSetting', themeSettingSchema);