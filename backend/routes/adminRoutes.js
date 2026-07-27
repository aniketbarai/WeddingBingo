import express from 'express';
import { loginAdmin, logoutAdmin, changePassword, forgotPassword, resetPassword } from '../controllers/adminController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginValidator, changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/adminValidators.js';

const router = express.Router();

router.post('/login', loginValidator, validateRequest, loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/change-password', changePasswordValidator, validateRequest, changePassword);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validateRequest, resetPassword);

export default router;

