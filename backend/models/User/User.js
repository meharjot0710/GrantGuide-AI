const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userType: { type: String },
    region: { type: String },
    country: { type: String },
    preferredLanguage: { type: String },
    interests: [{ type: String }],
    goals: { type: String },
    domainFocus: { type: String },
    projectStage: { type: String },
    hasPrototype: { type: Boolean },
    grantTypeNeeded: [{ type: String }],
    techStack: [{ type: String }],
    profileCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
