import { ILeaderBoard } from '../Interfaces/Leaderboard/ILeaderboard';
import IMatch from '../Interfaces/Matches/IMatch';
import LeaderboardModel from '../models/leaderboard.models';
import { calculateAwayTotalPoints, calculateHomeTotalPoints } from '../utils/leaderboard';

const initialLeaderboard = {
  name: '',
  totalPoints: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  totalGames: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: '0',
};

export default class leaderboardService {
  static async buildHomeLeaderBoard(matches: IMatch[], name?: string) {
    const leaderboard: ILeaderBoard = { ...initialLeaderboard };
    leaderboard.name = name;
    matches.forEach((match) => {
      const isHomeTeamWin = match.homeTeamGoals > match.awayTeamGoals;
      const isDraw = match.homeTeamGoals === match.awayTeamGoals;

      leaderboard.totalPoints += calculateHomeTotalPoints(match.homeTeamGoals, match.awayTeamGoals);
      leaderboard.totalVictories += isHomeTeamWin ? 1 : 0;
      leaderboard.totalDraws += isDraw ? 1 : 0;
      leaderboard.totalLosses += isHomeTeamWin || isDraw ? 0 : 1;
      leaderboard.totalGames += 1;
      leaderboard.goalsFavor += match.homeTeamGoals;
      leaderboard.goalsOwn += match.awayTeamGoals;
      leaderboard.goalsBalance += match.homeTeamGoals - match.awayTeamGoals;
      leaderboard.efficiency = (
        (leaderboard.totalPoints / (leaderboard.totalGames * 3)) * 100).toFixed(2);
    });
    return leaderboard;
  }

  static async getLeaderboardHome() {
    const leaderboardModel = new LeaderboardModel();
    const allTeams = await leaderboardModel.findAllTeams();

    const promises = allTeams.map(async ({ id, teamName }) => {
      const matches = await leaderboardModel.findAllHomeTeam(id);
      const board = await this.buildHomeLeaderBoard(matches, teamName);
      return board;
    });

    const leaderboard = await Promise.all(promises);

    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.goalsFavor - a.goalsFavor)
      .sort((a, b) => b.goalsBalance - a.goalsBalance)
      .sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return sortedLeaderboard;
  }

  static async buildAwayLeaderBoard(matches: IMatch[], name?: string) {
    const leaderboard: ILeaderBoard = { ...initialLeaderboard };
    leaderboard.name = name;
    matches.forEach((match) => {
      const isAwayTeamWin = match.awayTeamGoals > match.homeTeamGoals;
      const isDraw = match.awayTeamGoals === match.homeTeamGoals;

      leaderboard.totalPoints += calculateAwayTotalPoints(match.homeTeamGoals, match.awayTeamGoals);
      leaderboard.totalVictories += isAwayTeamWin ? 1 : 0;
      leaderboard.totalDraws += isDraw ? 1 : 0;
      leaderboard.totalLosses += isAwayTeamWin || isDraw ? 0 : 1;
      leaderboard.totalGames += 1;
      leaderboard.goalsFavor += match.awayTeamGoals;
      leaderboard.goalsOwn += match.homeTeamGoals;
      leaderboard.goalsBalance += match.awayTeamGoals - match.homeTeamGoals;
      leaderboard.efficiency = (
        (leaderboard.totalPoints / (leaderboard.totalGames * 3)) * 100).toFixed(2);
    });
    return leaderboard;
  }

  static async getLeaderboardAway() {
    const leaderboardModel = new LeaderboardModel();
    const allTeams = await leaderboardModel.findAllTeams();

    const promises = allTeams.map(async ({ id, teamName }) => {
      const matches = await leaderboardModel.findAllAwayTeam(id);
      const board = await this.buildAwayLeaderBoard(matches, teamName);
      return board;
    });

    const leaderboard = await Promise.all(promises);

    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.goalsFavor - a.goalsFavor)
      .sort((a, b) => b.goalsBalance - a.goalsBalance)
      .sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return sortedLeaderboard;
  }
}
