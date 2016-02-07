'use strict';

const Post = require('../models/post');

/**
 * Router mounted on '/'.
 * Loads every router and defines some routes.
 */
const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/api', require('./api'));
router.use('/users', require('./users'));


/**
 * Get all posts, ordered by createdAt attribute
 * and render home view.
 */
router.get('/', (req, res, next) => {
  Post.find()
    .sort('-createdAt')
    .populate('author', 'username')
    .exec((err, posts) => {
      if (err) return next(err);
      res.render('home', {
        posts: posts,
        moment: require('moment')
    });
  });
});

module.exports = router;
