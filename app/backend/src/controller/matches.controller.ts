import { Request, Response } from 'express';
import MatchesService from '../service/matches.service';

export default class MatchesController {
  public static async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (!inProgress) {
      const serviceResponse = await MatchesService.getAllMatches();
      return res.status(200).json(serviceResponse.message);
    }

    const inProgressValue = inProgress === 'true';
    const filteredMatches = await MatchesService.findByInProgress(inProgressValue);
    res.status(200).json(filteredMatches.message);
  }

  public static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const updated = await MatchesService.updateMatch(Number(id), data);
    return res.status(200).json({ message: updated.message });
  }

  public static async finishedMatch(req: Request, res: Response) {
    const { id } = req.params;
    const finished = await MatchesService.finishedMatch(Number(id));
    return res.status(200).json({ message: finished.message });
  }

  public static async createMatches(req: Request, res: Response) {
    const data = req.body;
    const newMatch = await MatchesService.createMatches(data);
    return res.status(201).json(newMatch);
  }
}
