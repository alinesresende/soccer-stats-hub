export const calculateHomeTotalPoints = (homeGoals: number, awayGoals: number) => {
  if (homeGoals > awayGoals) return 3;
  if (homeGoals === awayGoals) return 1;
  return 0;
};

export const calculateAwayTotalPoints = (homeGoals: number, awayGoals: number) => {
  if (awayGoals > homeGoals) return 3;
  if (homeGoals === awayGoals) return 1;
  return 0;
};

export default calculateHomeTotalPoints;
