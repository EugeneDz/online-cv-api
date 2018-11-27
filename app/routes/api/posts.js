const express = require('express');
const passport = require('passport');

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

const router = express.Router();

// @route   GET api/posts/test
// @desc    Test posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

// @route   POST api/posts
// @desc    create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    const post = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    const savedPost = await post.save();
    return res.json(savedPost);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
