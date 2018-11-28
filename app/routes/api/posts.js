const express = require('express');
const passport = require('passport');

const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

const router = express.Router();

// @route   GET api/posts/test
// @desc    Test posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route   GET api/posts/:post_id
// @desc    Get posts by id
// @access  Public
router.get('/:post_id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    return res.json(post);
  } catch (err) {
    return res.status(404).send(err);
  }
});

// @route   POST api/posts
// @desc    Create post
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

// @route   DELETE api/posts/:post_id
// @desc    Delete post by ID
// @access  Private
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {};
  const post = await Post.findById(req.params.post_id);

  if (post.user.toString() !== req.user.id) {
    errors.profile = 'User not authorized';
    return res.status(401).send(errors);
  }

  await post.delete();
  return res.json({ success: true });
});

module.exports = router;
