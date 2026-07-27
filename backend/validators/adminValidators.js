import { body } from 'express-validator';

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
  body('resetToken').isString().notEmpty().withMessage('resetToken is required'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];


