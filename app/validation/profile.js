const Validator = require('validator');
const { isEmpty } = require('lodash');

const validateProfileInput = (data) => {
  const errors = {};
  const input = data;

  input.handle = !isEmpty(input.handle) ? input.handle : '';
  input.status = !isEmpty(input.status) ? input.status : '';
  input.skills = !isEmpty(input.skills) ? input.skills : '';

  // Handle
  if (!Validator.isLength(input.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }

  if (Validator.isEmpty(input.handle)) {
    errors.handle = 'Profile handle field is required';
  }

  // Status
  if (Validator.isEmpty(input.status)) {
    errors.status = 'Status field is required';
  }

  // Skills
  if (Validator.isEmpty(input.skills)) {
    errors.skills = 'Skills field is required';
  }

  // Website
  if (!isEmpty(input.website)) {
    if (!Validator.isURL(input.website)) {
      errors.website = 'URL is not valid';
    }
  }

  // Youtube
  if (!isEmpty(input.youtube)) {
    if (!Validator.isURL(input.youtube)) {
      errors.youtube = 'URL is not valid';
    }
  }

  // Twitter
  if (!isEmpty(input.twitter)) {
    if (!Validator.isURL(input.twitter)) {
      errors.twitter = 'URL is not valid';
    }
  }

  // Facebook
  if (!isEmpty(input.facebook)) {
    if (!Validator.isURL(input.facebook)) {
      errors.facebook = 'URL is not valid';
    }
  }

  // Linkedin
  if (!isEmpty(input.linkedin)) {
    if (!Validator.isURL(input.linkedin)) {
      errors.linkedin = 'URL is not valid';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateProfileInput;
