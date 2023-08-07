import ITeam from '../Team/ITeam';

export default interface ILeaderBoardModel {
  findAllTeams(): Promise<ITeam[]>
  findAllHomeTeam(id: number): Promise<ITeam[]>
  findAllAwayTeam(id: number): Promise<ITeam[]>
}
