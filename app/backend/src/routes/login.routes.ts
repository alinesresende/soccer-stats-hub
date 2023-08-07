import { Router } from 'express';
import LoginController from '../controller/login.controller';
import Validations from '../middleware/login.validate';
import ValidateToken from '../middleware/token.validate';

const router = Router();

router.post(
  '/',
  Validations.checkEmailAndPasswordExists,
  Validations.checkEmaiAndPasswordlValid,
  Validations.validateLogin,
  LoginController.login,
);

router.get(
  '/role',
  ValidateToken.checkTokenExists,
  ValidateToken.checkTokenIsValid,
  LoginController.getRole,
);

export default router;
