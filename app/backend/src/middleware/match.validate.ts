import { NextFunction, Request, Response } from 'express';
import TeamModel from '../models/team.models';

class ValidateMatch {
  static async checkHomeTeamAndAwayTeam(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;

    if (homeTeamId === awayTeamId) {
      return res.status(422).json(
        { message: 'It is not possible to create a match with two equal teams' },
      );
    }
    next();
  }

  static async checkTeamExits(req: Request, res: Response, next: NextFunction) {
    const { homeTeamId, awayTeamId } = req.body;
    const teamModel = new TeamModel();

    const [homeTeamExists, awayTeamExists] = await Promise.all([
      teamModel.findById(homeTeamId),
      teamModel.findById(awayTeamId),
    ]);

    if (!homeTeamExists || !awayTeamExists) {
      return res.status(404).json(
        { message: 'There is no team with such id!' },
      );
    }
    next();
  }
}
export default ValidateMatch;
