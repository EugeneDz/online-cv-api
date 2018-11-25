const express = require('express');
const passport = require('passport');

const Profile = require('../../models/Profile');

const validateProfileInput = require('../../validation/profile');

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
    const { errors } = validateProfileInput(req.body);
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      errors.noprofile = 'There is no profile for this user';

      return res.status(404).json(errors);
    }

    return res.json(profile);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route   POST api/profile
// @desc    Create/Edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if (req.body.stackoverflowusername) {
      profileFields.stackoverflowusername = req.body.stackoverflowusername;
    }

    // Skills
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      );
      return res.json(updatedProfile);
    }

    const hasHandle = await Profile.findOne({ handle: profileFields.handle });
    if (hasHandle) {
      errors.handle = 'That handle already exists';

      return res.status(400).json(errors);
    }

    const newProfile = await new Profile(profileFields).save();
    return res.json(newProfile);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
