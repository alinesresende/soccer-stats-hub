import ITeam from '../Interfaces/Team/ITeam';
import ITeamModel from '../Interfaces/Team/ITeamModel';
import TeamModelTable from '../database/models/Team';

export default class TeamModel implements ITeamModel {
  private model = TeamModelTable;

  async findAll(): Promise<ITeam[]> {
    const dbData = await this.model.findAll();
    return dbData;
  }

  async findById(id: ITeam['id']): Promise<ITeam | null> {
    const dbData = await this.model.findByPk(id);
    if (dbData == null) return null;

    const { teamName }: ITeam = dbData;
    return { id, teamName };
  }
}
