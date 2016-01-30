'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	username: { type: String, minlength: 3, maxlength: 35, required: true, unique: true },
	password: { type: String, minlength: 4, required: true },
	profile: {
		fullname: { type: String, default: '' },
		gender: { type: String, enum: ['male', 'female'], default: 'male' },
		location: { type: String, default: '' },
		website: { type: String, default: '' },
	},
	created_at: { type: Date, default: Date.now },
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
