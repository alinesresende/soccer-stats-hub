import ILogin from './ILogin';

export default interface IUserModel {
  findOne(data: ILogin): Promise<ILogin | null>
}
