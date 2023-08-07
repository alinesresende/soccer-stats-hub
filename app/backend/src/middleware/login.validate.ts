import bcrypt = require('bcryptjs');
import { NextFunction, Request, Response } from 'express';
import ILogin from '../Interfaces/User/ILogin';
import UserModel from '../models/login.models';

class Validations {
  static async validateLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const model = new UserModel();
    const user = await model.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.dataValues.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    (req as Request &
    { user: ILogin }).user = { email: user.dataValues.email };

    next();
  }

  static async checkEmailAndPasswordExists(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    next();
  }

  static async checkEmaiAndPasswordlValid(req: Request, res: Response, next: NextFunction) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const { email, password } = req.body;

    const emailValid = emailRegex.test(email);

    const passwordValid = password.length > 6;

    if (!emailValid || !passwordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }
}

export default Validations;
