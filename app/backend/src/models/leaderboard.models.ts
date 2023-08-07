import ILeaderBoardModel from '../Interfaces/Leaderboard/ILeaderboardModel';
import ITeam from '../Interfaces/Team/ITeam';
import MatchesModel from '../database/models/Matches';
import TeamModelTable from '../database/models/Team';

export default class LeaderboardModel implements ILeaderBoardModel {
  private modelTeam = TeamModelTable;
  private modelMatch = MatchesModel;

  async findAllTeams(): Promise<ITeam[]> {
    const allTeam = await this.modelTeam.findAll();
    return allTeam;
  }

  async findAllHomeTeam(id: number) {
    const allMatches = await this.modelMatch.findAll({
      where: { homeTeamId: id, inProgress: false },
    });
    return allMatches.map(({ dataValues }) => dataValues);
  }

  async findAllAwayTeam(id: number) {
    const allMatches = await this.modelMatch.findAll({
      where: { awayTeamId: id, inProgress: false },
    });
    return allMatches.map(({ dataValues }) => dataValues);
  }
}
