import { Request, Response } from 'express';
import TeamService from '../service/team.service';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class TeamController {
  public static async getAllTeams(_req: Request, res: Response) {
    const serviceResponse = await TeamService.getAllTeams();
    res.status(200).json(serviceResponse.message);
  }

  public static async getTeamById(req: Request, res: Response) {
    const { id } = req.params;

    const serviceResponse = await TeamService.getTeamById(Number(id));

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.message);
    }

    res.status(200).json(serviceResponse.message);
  }
}
