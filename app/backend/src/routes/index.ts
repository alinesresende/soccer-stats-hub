import { Router } from 'express';
import leaderboard from './leaderboard.routes';
import loginRouter from './login.routes';
import matchesRouter from './matches.routes';
import teamRouter from './team.routes';

const router = Router();

router.use('/teams', teamRouter);
router.use('/login', loginRouter);
router.use('/matches', matchesRouter);
router.use('/leaderboard', leaderboard);

export default router;
