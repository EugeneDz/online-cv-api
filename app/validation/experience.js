const Validator = require('validator');
const { isEmpty } = require('lodash');

const validateExperienceInput = (data) => {
  const errors = {};
  const input = data;

  input.title = !isEmpty(input.title) ? input.title : '';
  input.company = !isEmpty(input.company) ? input.company : '';
  input.from = !isEmpty(input.from) ? input.from : '';

  // Check title field
  if (Validator.isEmpty(input.title)) {
    errors.title = 'Job title field is required';
  }

  // Check company field
  if (Validator.isEmpty(input.company)) {
    errors.company = 'Company title field is required';
  }

  // Check from field
  if (Validator.isEmpty(input.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateExperienceInput;
