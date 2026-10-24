const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true
      },
      smsMarketing: {
        type: Boolean,
        default: false
      },
      emailMarketing: {
        type: Boolean,
        default: true
      }
    },
    verificationCode: {
      type: String,
      required: true
    },
    verificationCodeExpires: {
      type: Date,
      required: true
    },
    attemptsLeft: {
      type: Number,
      default: 5 // Allow 5 verification attempts
    }
  },
  {
    timestamps: true
  }
);

// Index for email
pendingUserSchema.index({ email: 1 }, { unique: true });

// Auto-delete expired pending users after 15 minutes
pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

module.exports = PendingUser;
