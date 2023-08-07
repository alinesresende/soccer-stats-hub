import { Request, Response } from 'express';
import leaderboardService from '../service/leaderboard.service';

export default class LeaderboardController {
  public static async buildHomeLeaderBoard(req: Request, res: Response) {
    const serviceResponse = await leaderboardService.getLeaderboardHome();
    return res.status(200).json(serviceResponse);
  }

  public static async buildAwayLeaderBoard(req: Request, res: Response) {
    const serviceResponse = await leaderboardService.getLeaderboardAway();
    return res.status(200).json(serviceResponse);
  }
}
