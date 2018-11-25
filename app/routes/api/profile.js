const express = require('express');
const passport = require('passport');

const Profile = require('../../models/Profile');

const router = express.Router();

// @route   GET api/profile/test
// @desc    Test profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const errors = {};
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';

      return res.status(404).json(errors);
    }

    return res.json(profile);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
