const express = require('express');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const errors = {};
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      errors.profile = 'There is no profile for this user';
      return res.status(404).send(errors);
    }

    return res.json(profile);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const errors = {};
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (!profiles) {
      errors.profile = 'There is no profiles';
      return res.status(404).send(errors);
    }

    return res.json(profiles);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', async (req, res) => {
  try {
    const errors = {};
    const profile = await Profile.findOne({ handle: req.params.handle }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      errors.profile = 'There is no profile for this user';
      return res.status(404).send(errors);
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

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    const profile = await Profile.findOne({ user: req.user.id });

    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    profile.experience.unshift(newExp);

    const savedProfile = await profile.save();

    return res.json(savedProfile);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    const profile = await Profile.findOne({ user: req.user.id });

    const newEdu = {
      school: req.body.school,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    profile.education.unshift(newEdu);

    const savedProfile = await profile.save();

    return res.json(savedProfile);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);

      const savedProfile = await profile.save();

      return res.json(savedProfile);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:exp_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);

      const savedProfile = await profile.save();

      return res.json(savedProfile);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
