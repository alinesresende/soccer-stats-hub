import { ServiceResponse } from '../Interfaces/ServiceResponse';
import ITeam from '../Interfaces/Team/ITeam';
import TeamModel from '../models/team.models';

export default class TeamService {
  static async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const teamModel = new TeamModel();
    const allTeam = await teamModel.findAll();
    return { status: 'SUCCESSFUL', message: allTeam };
  }

  static async getTeamById(id: number): Promise<ServiceResponse<ITeam>> {
    const teamModel = new TeamModel();
    const team = await teamModel.findById(id);
    if (!team) return { status: 'NOT_FOUND', message: { message: `Team ${id} not found` } };
    return { status: 'SUCCESSFUL', message: team };
  }
}
