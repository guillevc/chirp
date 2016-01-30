'use strict';

const Post = require('../models/post');

/**
 * Router mounted on '/api'
 */
const router = require('express').Router();

router.get('/posts', (req, res) => {
  res.redirect('/');
});

router.post('/posts', (req, res, next) => {
  const newPost = new Post({
    content: req.body.content.trim(),
    author: req.user._id
  });
  newPost.save((err) => {
    if (err) return next(err);
    return res.redirect('/');
  });
});

module.exports = router;
