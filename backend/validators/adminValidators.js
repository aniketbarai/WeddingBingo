import { body, param } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const strongPassword = body('newPassword')
  .isString()
  .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
  .withMessage('New password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number');

export const changePasswordValidator = [
  body('oldPassword').isString().isLength({ min: 8 }).withMessage('Old password must be at least 8 characters'),
  strongPassword,
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  param('token').optional().isString().withMessage('Invalid reset token'),
  body('resetToken').optional().isString().withMessage('Invalid reset token'),
  body().custom((_, { req }) => {
    if (!req.params.token && !req.body.resetToken) throw new Error('A reset token is required');
    return true;
  }),
  strongPassword,
];


