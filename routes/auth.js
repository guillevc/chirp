'use strict';

const passport = require('passport');
const User = require('../models/user');

/**
 * Router mounted on '/auth'
 */
const router = require('express').Router();

router.route('/login')

  .get((req, res) => res.render('auth/login'))

  .post((req, res, next) => {
    // TODO: check if input is valid
    // redirect to login and flash information if not

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        // TODO: flash authentification failed
        console.log(`auth.js : Authentification failed: ${info.message}`);
        return res.send(`auth.js : Authentification failed: ${info.message}`);
      }
      req.logIn(user, (err) => {
        if (err) return next(err);

        // TODO: flash success?
        console.log('auth.js : Authentification succeeded');
        res.redirect('/');
      });
    })(req, res, next);
  });


router.route('/signup')

  .get((req, res) => res.render('auth/signup'))

  .post((req, res, next) => {
    // TODO: check valid input
    req.body.username = req.body.username.trim();

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    User.findOne({username: req.body.username}, (err, existingUser) => {
      // TODO flash messages
      if (existingUser) {
        return res.send('user already exists');
      }
      user.save((err) => {

        // may be a validation error
        if (err) return next(err);
        req.logIn(user, (err) => {
          if (err) return next(err);
          res.redirect('/');
        });
      });
    });
  });


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
