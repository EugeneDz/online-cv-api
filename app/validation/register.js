const Validator = require('validator');
const { isEmpty } = require('lodash');

const validateRegisterInput = (data) => {
  const errors = {};
  const input = data;

  input.name = !isEmpty(input.name) ? input.name : '';
  input.email = !isEmpty(input.email) ? input.email : '';
  input.password = !isEmpty(input.password) ? input.password : '';
  input.password2 = !isEmpty(input.password2) ? input.password2 : '';

  // Check name field
  if (!Validator.isLength(input.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(input.name)) {
    errors.name = 'Name field is required';
  }

  // Check email field
  if (!Validator.isEmail(input.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(input.email)) {
    errors.email = 'Email field is required';
  }

  // Check password field
  if (!Validator.isLength(input.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(input.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.equals(input.password, input.password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(input.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateRegisterInput;
