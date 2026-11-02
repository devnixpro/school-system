const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  platformName: { type: String, default: 'DevNixEdu' },
  supportEmail: { type: String, default: 'support@devnixedu.com' },
  supportPhone: { type: String, default: '+92 319 8018471' },
  timezone: { type: String, default: 'Asia/Karachi (PKT)' },
  language: { type: String, default: 'English' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);