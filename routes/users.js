'use strict';

const User = require('../models/user');
const Post = require('../models/post');

/**
 * Router mounted on /users
 */
const router = require('express').Router();

router.get('/:user', (req, res, next) => {
  User.find({ username: req.params.user }, (err, user) => {
    if (err) return next(err);
    const userprofile = user[0];
    if (!userprofile) res.redirect('/');
    Post.find({ author: userprofile.id })
      .sort('-createdAt')
      .populate('author', 'username')
      .exec((err, posts) => {
        console.log(posts);
        if (err) return next(err);
        res.render('user', {
          userprofile: userprofile,
          posts: posts,
          moment: require('moment')
        });
      });
  });
});

module.exports = router;
