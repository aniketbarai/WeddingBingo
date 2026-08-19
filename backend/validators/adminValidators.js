import { body, param } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const changePasswordValidator = [
  body('oldPassword').isString().isLength({ min: 6 }).withMessage('Old password must be at least 6 characters'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  param('token').optional().isString().withMessage('Invalid reset token'),
  body('resetToken').optional().isString().withMessage('Invalid reset token'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];


