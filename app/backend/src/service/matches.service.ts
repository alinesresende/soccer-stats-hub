import IMatches from '../Interfaces/Matches/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import MatchesModel from '../models/matches.models';

export default class MatchesService {
  static async getAllMatches(): Promise<ServiceResponse<IMatches[]>> {
    const matchesModel = new MatchesModel();
    const allMatches = await matchesModel.findAll();
    return { status: 'SUCCESSFUL', message: allMatches };
  }

  static async findByInProgress(inProgress: boolean): Promise<ServiceResponse<IMatches[]>> {
    const matchesModel = new MatchesModel();
    const filteredMatches = await matchesModel.findAllInProgress(inProgress);
    return { status: 'SUCCESSFUL', message: filteredMatches };
  }

  static async updateMatch(id: number, data: object) {
    const matchesModel = new MatchesModel();
    await matchesModel.updateMatch(id, data);
    return { status: 'SUCCESSFUL', message: 'Updated Match' };
  }

  static async finishedMatch(id: number): Promise<ServiceResponse<string>> {
    const matchesModel = new MatchesModel();

    await matchesModel.finishedMatch(id);
    return { status: 'SUCCESSFUL', message: 'Finished' };
  }

  static async createMatches(data: IMatches): Promise<IMatches> {
    const matchesModel = new MatchesModel();
    const newMatch = await matchesModel.createMatch(data);
    return newMatch;
  }
}
