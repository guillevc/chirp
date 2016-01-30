'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => User.findById(id, (err, user) => {
  user.password = null;
  done(err, user);
}));

passport.use(new LocalStrategy((username, password, done) => {
  username = username.trim();
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(null, false, { message: `User ${username} not found` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid username or password' });
      }
    });
  });
}));
