const { URL } = require('../utils/urls');
const { initBrowser, termBrowser } = require('../config/puppeteer');
const { pageMatchSettings, header, pageMatches } = require('../utils/dataTestIds');
const { teams } = require('../expected_results/trybe_football_club');
const { select } = require('../utils/query');
const { dbReset, termSequelize, initSequelize } = require('../config/sequelize');
const { puppeteerDefs, containerPorts } = require('../config/constants');
const { normalize, getRequirement, delay } = require('../utils/util');
const { insertInProgress, insertFinished, finishMatchInProgress } = require('../utils/inserts');
const waitForResponse = require('../utils/waitForResponse');
const { logAdmin } = require('../utils/logInto');
const { StatusCodes } = require('http-status-codes');
const axios = require('axios').default;

const twoGoals = 2;
const twoGoalsText = "2";
const oneGoal = 1;
const threeGoals = 3;
const fiveGoals = "5";
const lastInsert = (list) => list[list.length - 1];

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

describe(getRequirement(17), () => {
  it('Será validado na API que não é possível alterar uma partida sem um token', async () => {
    const dadosInsert = {
      homeTeam: teams[1].teamName,
      awayTeam: teams[3].teamName,
      homeTeamGoals: twoGoals,
      awayTeamGoals: oneGoal
    }

    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .patch(
        `${URL(containerPorts.backend).BASE_URL}/matches/2/finish`,
        dadosInsert,
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Token not found");
  });

  it('Será validado na API que não é possível alterar uma partida com um token inválido', async () => {
    const dadosInsert = {
      homeTeam: teams[1].teamName,
      awayTeam: teams[3].teamName,
      homeTeamGoals: twoGoals,
      awayTeamGoals: oneGoal
    }

    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .patch(
        `${URL(containerPorts.backend).BASE_URL}/matches/2/finish`,
        dadosInsert,
        {
          headers: {
            authorization: 'token'
          }
        }
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Token must be a valid token");
  });

  it('Será validado que ao finalizar uma partida é alterado no banco de dados e na página', async () => {

    const matchId = 41;

    let showMatchesButton = await page.$(header.showMatchesButton);
    await showMatchesButton.click();

    await page.waitForTimeout(puppeteerDefs.pause.brief);
    
    const matchStatusBefore = await page.$eval(pageMatches.matchStatus(matchId), (el) => el.innerText);
    expect(matchStatusBefore).toBe('Em andamento');
    
    const headerButtonLogin = await page.$(header.loginButton);
    await headerButtonLogin.click();

    await logAdmin(page, containerPorts.frontend); 
    
    await finishMatchInProgress(page, matchId);

    showMatchesButton = await page.$(header.showMatchesButton);
    await showMatchesButton.click();
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const matchStatusAfter = await page.$eval(pageMatches.matchStatus(matchId), (el) => el.innerText);

    expect(matchStatusAfter).toBe('Finalizado');

    const row = await database.query(select.where.matches(`id = ${matchId}`), { type: 'SELECT' });
    const [match] = normalize(row)

    expect(match.inProgress).toBe(0);
  });
});

describe(getRequirement(18), () => {
  it('Será validado na API que não é possível alterar o resultado de uma partida sem um token', async () => {
    const dadosInsert = {
      homeTeam: teams[1].teamName,
      awayTeam: teams[3].teamName,
      homeTeamGoals: threeGoals,
      awayTeamGoals: oneGoal
    }

    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .patch(
        `${URL(containerPorts.backend).BASE_URL}/matches/2`,
        dadosInsert,
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Token not found");
  });

  it('Será validado na API que não é possível alterar o resultado de uma partida com um token inválido', async () => {
    const dadosInsert = {
      homeTeam: teams[1].teamName,
      awayTeam: teams[3].teamName,
      homeTeamGoals: threeGoals,
      awayTeamGoals: oneGoal
    }

    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .patch(
        `${URL(containerPorts.backend).BASE_URL}/matches/2`,
        dadosInsert,
        {
          headers: {
            authorization: 'token'
          }
        }
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Token must be a valid token");
  });

  it('Será avaliado que é possível alterar o resultado de uma partida', async () => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const headerButtonLogin = await page.$(header.loginButton);
    await headerButtonLogin.click();

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    await logAdmin(page, containerPorts.frontend);

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const testMatchId = 48;

    const editMatchButton = await page.$(pageMatches.matchStatusBtn(testMatchId));
    await editMatchButton.click();

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const selectQuantityGoalsHomeTeam = await page.$(pageMatchSettings.selectQuantityGoalsHomeTeam);
    const selectQuantityGoalsAwayTeam = await page.$(pageMatchSettings.selectQuantityGoalsAwayTeam);
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    await selectQuantityGoalsHomeTeam.click({ clickCount: 3 });
    await selectQuantityGoalsHomeTeam.type(fiveGoals);
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    await selectQuantityGoalsAwayTeam.click({ clickCount: 3 });
    await selectQuantityGoalsAwayTeam.type(twoGoalsText);

    const SaveEditMatchButton = await page.$(pageMatchSettings.editMatchButton);

    await waitForResponse({
      page,
      trigger: () => SaveEditMatchButton.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'PATCH',
      expectedResponseStatus: 200,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/matches/${testMatchId}`,
      timeOut: 100000
    });

    const matches = await database.query(select.all.matches, { type: 'SELECT' });
    const normalizeMatches = normalize(matches);
    const lastInsertedRow = lastInsert(normalizeMatches);

    expect(lastInsertedRow.homeTeamId).toBe(teams[12].id);
    expect(lastInsertedRow.awayTeamId).toBe(teams[1].id);
    expect(lastInsertedRow.homeTeamGoals.toString()).toBe(fiveGoals);
    expect(lastInsertedRow.awayTeamGoals.toString()).toBe(twoGoalsText);
    expect(lastInsertedRow.inProgress).toBe(1);
  });
});

describe(getRequirement(20), () => {
  it('Será validado na API que não é possível inserir uma partida sem um token', async () => {
    const dadosInsert = {
      homeTeam: teams[1].teamName,
      awayTeam: teams[3].teamName,
      homeTeamGoals: twoGoals,
      awayTeamGoals: oneGoal
    }

    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .post(
        `${URL(containerPorts.backend).BASE_URL}/matches`,
        dadosInsert,
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Token not found");
  });

  it('Será validado na API que não é possível inserir uma partida com um token inválido', async () => {
    const dadosInsert = {
      homeTeam: teams[1].teamName,
      awayTeam: teams[3].teamName,
      homeTeamGoals: twoGoals,
      awayTeamGoals: oneGoal
    }

    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .post(
        `${URL(containerPorts.backend).BASE_URL}/matches`,
        dadosInsert,
        {
          headers: {
            authorization: 'token'
          }
        }
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Token must be a valid token");
  });

  it('Será validado que é possível salvar um jogo no banco de dados e ver o jogo na página de jogos', async () => {
    const dadosInsert = {
      homeTeam: teams[3].teamName,
      awayTeam: teams[8].teamName,
      homeGoals: twoGoals,
      awayGoals: oneGoal
    }

    const body = await insertInProgress(page, dadosInsert)
    const newBody = { ...body, inProgress: Number(body.inProgress) }

    const rows = await database.query(select.all.matches, { type: 'SELECT' });
    const [matchInserted] = normalize([lastInsert(rows)])

    expect(matchInserted).toStrictEqual(newBody);

    const showMatchesButton = await page.$(header.showMatchesButton);
    await showMatchesButton.click();
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const homeTeam = await page.$eval(pageMatches.homeTeam(49), (el) => el.innerText);
    const awayTeam = await page.$eval(pageMatches.awayTeam(49), (el) => el.innerText);

    expect(homeTeam).toBe(teams[3].teamName);
    expect(awayTeam).toBe(teams[8].teamName);
  });
});

describe(getRequirement(21), () => {
  it('Será validado que não é possível inserir uma partida com times iguais', async () => {
    const dadosInsert = {
      homeTeam: teams[3].teamName,
      awayTeam: teams[3].teamName,
      homeGoals: twoGoals,
      awayGoals: oneGoal
    }
    const { message } = await insertInProgress(page, dadosInsert, StatusCodes.UNPROCESSABLE_ENTITY);
    const messageExpect = 'It is not possible to create a match with two equal teams';

    expect(messageExpect).toBe(message);
  });

  it('Será validado na API que não é possível inserir uma partida com time que não existe na tabela teams', async () => {
    const dadosInsert = {
      homeTeamId: 12345,
      awayTeamId: 3,
      homeTeamGoals: twoGoals,
      awayTeamGoals: oneGoal
    }

    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .post(
        `${URL(containerPorts.backend).BASE_URL}/matches`,
        dadosInsert,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(404);
    expect(result.message).toBe("There is no team with such id!");
  });
});
