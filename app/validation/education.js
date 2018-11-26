const Validator = require('validator');
const { isEmpty } = require('lodash');

const validateEducationInput = (data) => {
  const errors = {};
  const input = data;

  input.school = !isEmpty(input.school) ? input.school : '';
  input.fieldofstudy = !isEmpty(input.fieldofstudy) ? input.fieldofstudy : '';
  input.from = !isEmpty(input.from) ? input.from : '';

  // Check title field
  if (Validator.isEmpty(input.school)) {
    errors.school = 'School title field is required';
  }

  // Check field of study field
  if (Validator.isEmpty(input.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study field is required';
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

module.exports = validateEducationInput;
