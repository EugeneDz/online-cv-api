const Validator = require('validator');
const { isEmpty } = require('lodash');

const validateLoginInput = (data) => {
  const errors = {};
  const input = data;

  input.email = !isEmpty(input.email) ? input.email : '';
  input.password = !isEmpty(input.password) ? input.password : '';

  // Check email field
  if (!Validator.isEmail(input.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(input.email)) {
    errors.email = 'Email field is required';
  }

  // Check password field
  if (Validator.isEmpty(input.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateLoginInput;
