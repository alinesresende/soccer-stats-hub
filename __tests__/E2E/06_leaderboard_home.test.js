const { initBrowser, termBrowser } = require('../config/puppeteer');
const { dbReset, initSequelize, termSequelize } = require('../config/sequelize');
const { validateLeaderboardBody } = require('../utils/validateLeaderboard');
const { homeResult1, homeResult2 } = require('../entities/leaderboard/homeResult');
const { leaderboard, header } = require('../utils/dataTestIds');
const { URL } = require('../utils/urls');
const { insertFinished } = require('../utils/inserts');
const { teams } = require('../expected_results/trybe_football_club');
const { puppeteerDefs, containerPorts } = require('../config/constants');
const { getRequirement } = require('../utils/util');
const { getTeamsToCompare } = require('../utils/getTeamsToCompare');
const axios = require('axios').default;

let database, browser, page;

beforeAll(async () => {
  database = await initSequelize();
});

afterAll(async () => termSequelize(database));

beforeEach(async () => {
  await dbReset();
  [browser, page] = await initBrowser();
  await page.goto(URL(containerPorts.frontend).BASE_URL);
});

afterEach(async () => {
  await termBrowser(browser);
});

const endpoint = '/leaderboard/home'
const twoGoals = '2';
const oneGoal = '1';

describe(getRequirement(23), () => {
  let result;
  const teamsToCompare = getTeamsToCompare();
  beforeAll(async () => {
    result = await axios
    .get(
      `${URL(containerPorts.backend).BASE_URL}${endpoint}`,
      )
      .then((response) => response)
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

      expect(result).toHaveProperty("status");
      expect(result.status).toBe(200);
  })

  it.each(teamsToCompare)('Serão validados os dados dos times', async (teamToCompare) => {
      const team = result.data[teamToCompare];

      expect(team).toHaveProperty('name');
      expect(team).toHaveProperty('totalPoints');
      expect(team).toHaveProperty('totalGames');
      expect(team).toHaveProperty('totalVictories');
      expect(team).toHaveProperty('totalLosses');
      expect(team).toHaveProperty('goalsFavor');
      expect(team).toHaveProperty('goalsOwn');
  });
});

describe(getRequirement(24), () => {
  it('Será avaliado que ao fazer a requisição ao endpoint /leaderboard/home será retornado os campos e valores corretos considerando os dados iniciais do banco de dados', async () => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);
    await page.select(leaderboard.table.filter.select, 'Classificação Mandantes')
    const classificationButton = await page.$(leaderboard.table.filter.button)
    const actionTrigger = () => classificationButton.click()
    await validateLeaderboardBody(homeResult1, leaderboard, page, containerPorts.backend, endpoint, actionTrigger);
  });
});

describe(getRequirement(25), () => {
  it('Será avaliado que após acrescentar a partida Corinthians 2 X 1 Internacional e fazer a requisição ao endpoint /leaderboard/home será retornado os campos e valores corretos', async () => {
    const dadosInsert = {
      homeTeam: teams[3].teamName,
      awayTeam: teams[8].teamName,
      homeGoals: twoGoals,
      awayGoals: oneGoal
    }
    await insertFinished(page, dadosInsert)
    const showMatchesButton = await page.$(header.showMatchesButton);
    await showMatchesButton.click();
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const showClassificationButton = await page.$(header.showClassificationButton)
    await showClassificationButton.click()
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    await page.select(leaderboard.table.filter.select, 'Classificação Mandantes')
    const classificationButton = await page.$(leaderboard.table.filter.button)
    const actionTrigger = () => classificationButton.click()
    await validateLeaderboardBody(homeResult2, leaderboard, page, containerPorts.backend, endpoint, actionTrigger);
  });
});
