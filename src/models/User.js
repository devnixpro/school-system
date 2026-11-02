const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['superadmin', 'admin', 'teacher', 'student', 'parent'],
      default: 'student',
      required: true,
    },

    // Existing school reference used by the application.
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
      validate: {
        validator: function (value) {
          return this.role === 'superadmin' || value != null;
        },
        message: 'A school is required for this user role',
      },
    },

    // Compatibility field for payment-gateway tenant scoping.
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    // New signups must verify their email.
// Existing users remain compatible.
isEmailVerified: {
  type: Boolean,
  default: true,
},

// Store only the hashed verification code.
emailVerificationCodeHash: {
  type: String,
  select: false,
},

emailVerificationExpires: {
  type: Date,
  select: false,
},

emailVerificationLastSentAt: {
  type: Date,
  select: false,
},
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
