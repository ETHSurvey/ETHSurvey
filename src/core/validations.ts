export const emailValidation = {
  rules: [
    {
      message: 'Please input your email address',
      required: true
    },
    {
      message: 'Please enter a valid email address',
      type: 'email'
    }
  ],
  validateTrigger: 'onBlur'
};

export const passwordValidation = {
  rules: [
    {
      message: 'Password must be of at-least 8 characters',
      min: 8
    },
    {
      message: 'Please input your password',
      required: true
    }
  ],
  validateTrigger: 'onBlur'
};
