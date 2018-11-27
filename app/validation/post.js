const Validator = require('validator');
const { isEmpty } = require('lodash');

const validatePostInput = (data) => {
  const errors = {};
  const input = data;

  input.text = !isEmpty(input.text) ? input.text : '';

  // Check text field
  if (!Validator.isLength(input.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  if (Validator.isEmpty(input.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validatePostInput;
