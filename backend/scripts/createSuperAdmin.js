require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
(async () => {
  try {
    const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;
    if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD || SUPERADMIN_PASSWORD.length < 8) {
      throw new Error('Set SUPERADMIN_NAME, SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD (minimum 8 characters).');
    }
    await mongoose.connect(process.env.MONGO_URI);
    const email = SUPERADMIN_EMAIL.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) throw new Error('An account with this email already exists.');
    await User.create({ name: SUPERADMIN_NAME.trim(), email, password: SUPERADMIN_PASSWORD, role: 'superadmin', school: null });
    console.log(`Superadmin created: ${email}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally { await mongoose.disconnect(); }
})();
