import UserModel from '../models/login.models';
import { decodeToken, generateToken } from '../utils/jwt';

export default class LoginService {
  static login({ email }: { email: string }) {
    const token = generateToken({ email });
    return token;
  }

  static async getRole(token: string) {
    const data = token.replace('Bearer ', '');

    const payload = decodeToken(data);
    const model = new UserModel();
    const user = await model.findOne({ email: payload.email });
    return user?.role;
  }
}
