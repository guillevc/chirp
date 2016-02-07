'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 35
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false
  },
  profile: {
    fullname: String,
    location: String,
    website: String,
    gender: {
      type: String,
      enum: ['male', 'female']
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

/**
 * Password hash middleware
 */
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method to compare passwords
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, res) {
    if (err) {
      cb(err);
    } else {
      cb(null, res);
    }
  });
};

module.exports = mongoose.model('User', userSchema);
