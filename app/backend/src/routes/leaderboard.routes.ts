import { Router } from 'express';
import LeaderboardController from '../controller/leaderboard.controller';

const router = Router();

router.get('/home', LeaderboardController.buildHomeLeaderBoard);
router.get('/away', LeaderboardController.buildAwayLeaderBoard);
router.get('/');

export default router;
