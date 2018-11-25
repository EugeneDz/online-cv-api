const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');
const User = require('../../models/User');

const router = express.Router();

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const hasUser = await User.findOne({ email: req.body.email });
    if (hasUser) return res.status(400).json({ email: 'Email already exists' });

    const avatar = gravatar.url(req.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    const registredUser = await user.save();

    return res.json(registredUser);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route   GET api/users/login
// @desc    Login a user / Return JWT Token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ email: 'User email not found' });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      };
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

      return res.json({
        success: true,
        token: `Bearer ${token}`,
      });
    }

    return res.status(400).json({ password: 'Password incorrect' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
