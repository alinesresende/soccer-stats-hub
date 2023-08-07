import { Router } from 'express';
import MatchesController from '../controller/matches.controller';
import ValidateMatch from '../middleware/match.validate';
import ValidateToken from '../middleware/token.validate';

const router = Router();

router.get('/', MatchesController.getAllMatches);

router.patch(
  '/:id/finish',
  ValidateToken.checkTokenExists,
  ValidateToken.checkTokenIsValid,
  MatchesController.finishedMatch,
);

router.patch(
  '/:id',
  ValidateToken.checkTokenExists,
  ValidateToken.checkTokenIsValid,
  MatchesController.updateMatch,
);

router.post(
  '/',
  ValidateToken.checkTokenExists,
  ValidateToken.checkTokenIsValid,
  ValidateMatch.checkHomeTeamAndAwayTeam,
  ValidateMatch.checkTeamExits,
  MatchesController.createMatches,
);

export default router;
