import jwt = require('jsonwebtoken');
import ILogin from '../Interfaces/User/ILogin';

const secret = process.env.JWT_SECRET || 'secret';

export function generateToken(payload: ILogin): string {
  // 1 - jwt.sign recebe o payload e secrect como parametros
  // 2 - retorna uma string
  const token = jwt.sign(payload, secret);
  return token;
}

export function decodeToken(token: string): ILogin {
  // verify retorna o payload, usado para gerar o token
  const data = jwt.verify(token, secret) as ILogin;
  return data;
}
