import ILogin from '../Interfaces/User/ILogin';
import IUserModel from '../Interfaces/User/IUserModel';
import UserModelTable from '../database/models/User';

export type NewEntity<T> = Omit<T, 'id'>;

export default class UserModel implements IUserModel {
  private model = UserModelTable;

  async findOne(data: ILogin): Promise<UserModelTable | null> {
    const user = await this.model.findOne({ where: { ...data } });
    if (user == null) return null;

    return user;
  }
}
