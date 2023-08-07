import { Request, Response } from 'express';
import LoginService from '../service/login.service';

export default class LoginController {
  static async login(req: Request, res: Response) {
    const { email } = req.body;
    const token = await LoginService.login({ email });
    return res.status(200).json({ token });
  }

  static async getRole(req: Request, res: Response) {
    const token = req.headers.authorization as string;
    const role = await LoginService.getRole(token);
    return res.status(200).json({ role });
  }
}
