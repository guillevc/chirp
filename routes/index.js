'use strict';

const Post = require('../models/post');
const User = require('../models/user');

/**
 * Router mounted on '/'.
 * Loads every router and defines some routes.
 */
const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/api', require('./api'));


/**
 * Get all posts, ordered by createdAt attribute
 * and render home page.
 */
router.get('/', (req, res, next) => {
  Post.find()
    .sort('-createdAt')
    .exec((err, posts) => {
      if (err) return next(err);
      User.populate(posts, {path: 'author'}, (err, posts) => {
        if (err) return next(err);
        res.render('home', {
          posts: posts
        });
    });
  });
});

module.exports = router;
