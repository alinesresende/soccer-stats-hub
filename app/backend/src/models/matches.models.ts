import IMatch from '../Interfaces/Matches/IMatch';
import IMatcheModel from '../Interfaces/Matches/IMatchesModel';
import MatchesModelTable from '../database/models/Matches';
import TeamModelTable from '../database/models/Team';

export default class MatchesModel implements IMatcheModel {
  private model = MatchesModelTable;

  async findAll(): Promise<IMatch[]> {
    const matches = await this.model.findAll({
      include: [
        {
          model: TeamModelTable,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModelTable,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });
    return matches;
  }

  async findAllInProgress(inProgress: boolean): Promise<IMatch[]> {
    const matchesInProgress = await this.model.findAll({
      where: { inProgress },
      include: [
        {
          model: TeamModelTable,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModelTable,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });
    return matchesInProgress;
  }

  async updateMatch(id: number, data: object) {
    await this.model.update({ ...data }, { where: { id } });
  }

  async finishedMatch(id: number) {
    await this.model.update({ inProgress: false }, { where: { id } });
  }

  async createMatch(data: IMatch): Promise<IMatch> {
    const { dataValues: newMatch } = await this.model.create({ ...data, inProgress: true });
    return newMatch;
  }
}
