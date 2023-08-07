const { homeResult1 } = require('../entities/leaderboard/homeResult');

const generateRandomNumber = () => Math.floor(Math.random() * homeResult1.length);

const getTeamsToCompare = () => {
  let counter = 0;
  const teamsToCheck = [];
  const qtdTeamsToCheck = Math.ceil(Math.random() * 4);

  while (counter < qtdTeamsToCheck) {
    const possibleTeamToCheck = generateRandomNumber()
    const index = teamsToCheck.findIndex((teamToCheck) => teamToCheck === possibleTeamToCheck);

    if (index === -1) {
      teamsToCheck.push(possibleTeamToCheck);
      counter += 1;
    }
  }
  return teamsToCheck;
}

module.exports = { getTeamsToCompare }
