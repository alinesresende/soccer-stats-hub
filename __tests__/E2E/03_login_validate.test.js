const jwt = require('jsonwebtoken');
const { URL } = require('../utils/urls');
const { initBrowser, termBrowser } = require('../config/puppeteer');
const { pageLogin } = require('../utils/dataTestIds');
const { admin: { validAdmin, invalidAdmin }, user: { invalidEmailUsers, invalidPasswordUsers }, usersToLogin } = require('../utils/users');
const { termSequelize, initSequelize } = require('../config/sequelize');
const { puppeteerDefs, containerPorts, jwtSecret } = require('../config/constants');
const waitForResponse = require('../utils/waitForResponse');
const { getRequirement } = require('../utils/util');
const axios = require('axios').default;

let database, browser, page;

beforeAll(async () => {
  database = await initSequelize();
});

afterAll(async () => termSequelize(database));

beforeEach(async () => {
  [browser, page] = await initBrowser();
  await page.goto(URL(containerPorts.frontend).URL_PAGE_LOGIN);
});

afterEach(async () => {
  await termBrowser(browser);
});

describe(getRequirement(8), () => {
  it('O avaliador verificará se é possível fazer o login com dados corretos e que após o acesso será redirecionado para a tela de jogos', async () => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    expect(await page.$(pageLogin.alertLogin)).toBeNull();

    const inputLogin = await page.$(pageLogin.inputEmail);
    await inputLogin.type(validAdmin.email);

    const inputPassword = await page.$(pageLogin.inputPassword);
    await inputPassword.type(validAdmin.password);

    const buttonLogin = await page.$(pageLogin.buttonLogin);

    const { body: { bearerToken } } = await waitForResponse({
      page,
      trigger: () => buttonLogin.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'POST',
      expectedResponseStatus: 200,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/login`
    });

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    if(bearerToken) {
      const token = bearerToken.split(' ')[1];
      expect(
        !!jwt.verify(token, jwtSecret),
      ).toEqual(true);
    }
  });

  it('O avaliador verificará se tentar fazer o login sem e-mail retornará status não-autorizado', async () => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    expect(await page.$(pageLogin.alertLogin)).toBeNull();

    const inputPassword = await page.$(pageLogin.inputPassword);
    await inputPassword.type(validAdmin.password);
    const buttonLogin = await page.$(pageLogin.buttonLogin);

    const { body: { message } } = await waitForResponse({
      page,
      trigger: () => buttonLogin.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'POST',
      expectedResponseStatus: 400,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/login`
    });

    expect(message).toBe('All fields must be filled');

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const alertLogin = await page.$eval(pageLogin.alertLogin, (el) => el.innerText);

    expect(alertLogin).toBe('O endereço de e-mail ou a senha não estão corretos. Por favor, tente novamente.');
    expect(await page.url()).toEqual(URL(containerPorts.frontend).URL_PAGE_LOGIN);
  });

  it('O avaliador verificará se tentar fazer o login sem senha retornará status não-autorizado', async () => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    expect(await page.$(pageLogin.alertLogin)).toBeNull();

    const inputLogin = await page.$(pageLogin.inputEmail);
    await inputLogin.type(validAdmin.email);
    const buttonLogin = await page.$(pageLogin.buttonLogin);

    const { body: { message } } = await waitForResponse({
      page,
      trigger: () => buttonLogin.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'POST',
      expectedResponseStatus: 400,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/login`
    });

    expect(message).toBe('All fields must be filled');

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const alertLogin = await page.$eval(pageLogin.alertLogin, (el) => el.innerText);

    expect(alertLogin).toBe('O endereço de e-mail ou a senha não estão corretos. Por favor, tente novamente.');
    expect(await page.url()).toEqual(URL(containerPorts.frontend).URL_PAGE_LOGIN);
  });
});

describe(getRequirement(10), () => {
  it('O avaliador verificará se fazer o login com um email incorreto retornará status não-autorizado', async () => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    expect(await page.$(pageLogin.alertLogin)).toBeNull();

    const inputLogin = await page.$(pageLogin.inputEmail);
    await inputLogin.type(invalidAdmin.email);
    const inputPassword = await page.$(pageLogin.inputPassword);
    await inputPassword.type(validAdmin.password);
    const buttonLogin = await page.$(pageLogin.buttonLogin);

    const { body: { message } } = await waitForResponse({
      page,
      trigger: () => buttonLogin.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'POST',
      expectedResponseStatus: 401,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/login`
    });

    expect(message).toBe('Invalid email or password');

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const alertLogin = await page.$eval(pageLogin.alertLogin, (el) => el.innerText);

    expect(alertLogin).toBe('O endereço de e-mail ou a senha não estão corretos. Por favor, tente novamente.');
    expect(await page.url()).toEqual(URL(containerPorts.frontend).URL_PAGE_LOGIN);
  });

  it.each(invalidEmailUsers)('O avaliador verificará se tentar fazer o login com um e-mail inválido retornará status não-autorizado', async (invalidEmailUser) => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    expect(await page.$(pageLogin.alertLogin)).toBeNull();

    const inputLogin = await page.$(pageLogin.inputEmail);
    await inputLogin.type(invalidEmailUser.email);

    const inputPassword = await page.$(pageLogin.inputPassword);
    await inputPassword.type(invalidEmailUser.password);

    const buttonLogin = await page.$(pageLogin.buttonLogin);

    const { body: { message } } = await waitForResponse({
      page,
      trigger: () => buttonLogin.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'POST',
      expectedResponseStatus: 401,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/login`
    });

    expect(message).toBe('Invalid email or password');

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const alertLogin = await page.$eval(pageLogin.alertLogin, (el) => el.innerText);

    expect(alertLogin).toBe('O endereço de e-mail ou a senha não estão corretos. Por favor, tente novamente.');
    expect(await page.url()).toEqual(URL(containerPorts.frontend).URL_PAGE_LOGIN);
  });

  it('O avaliador verificará se fazer o login com uma senha incorreta retornará status não-autorizado', async () => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    expect(await page.$(pageLogin.alertLogin)).toBeNull();

    const inputLogin = await page.$(pageLogin.inputEmail);
    await inputLogin.type(validAdmin.email);
    const inputPassword = await page.$(pageLogin.inputPassword);
    await inputPassword.type(invalidAdmin.password);
    const buttonLogin = await page.$(pageLogin.buttonLogin);

    const { body: { message } } = await waitForResponse({
      page,
      trigger: () => buttonLogin.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'POST',
      expectedResponseStatus: 401,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/login`
    });

    expect(message).toBe('Invalid email or password');

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const alertLogin = await page.$eval(pageLogin.alertLogin, (el) => el.innerText);

    expect(alertLogin).toBe('O endereço de e-mail ou a senha não estão corretos. Por favor, tente novamente.');
    expect(await page.url()).toEqual(URL(containerPorts.frontend).URL_PAGE_LOGIN);
  });

  it.each(invalidPasswordUsers)('O avaliador verificará se tentar fazer o login com uma senha inválida retornará status não-autorizado', async (invalidPasswordUser) => {
    await page.waitForTimeout(puppeteerDefs.pause.brief);

    expect(await page.$(pageLogin.alertLogin)).toBeNull();

    const inputLogin = await page.$(pageLogin.inputEmail);
    await inputLogin.type(invalidPasswordUser.email);

    const inputPassword = await page.$(pageLogin.inputPassword);
    await inputPassword.type(invalidPasswordUser.password);

    const buttonLogin = await page.$(pageLogin.buttonLogin);

    const { body: { message } } = await waitForResponse({
      page,
      trigger: () => buttonLogin.click(),
      expectedRequestType: 'script',
      expectedRequestMethod: 'POST',
      expectedResponseStatus: 401,
      expectedResponseUrl: `${URL(containerPorts.backend).BASE_URL}/login`
    });

    expect(message).toBe('Invalid email or password');

    await page.waitForTimeout(puppeteerDefs.pause.brief);

    const alertLogin = await page.$eval(pageLogin.alertLogin, (el) => el.innerText);

    expect(alertLogin).toBe('O endereço de e-mail ou a senha não estão corretos. Por favor, tente novamente.');
    expect(await page.url()).toEqual(URL(containerPorts.frontend).URL_PAGE_LOGIN);
  });
});

describe(getRequirement(12), () => {
  it('Será validado na API que não é possível retornar um objeto com o tipo de usuário, sem um token', async () => {
    const result = await axios
      .get(
        `${URL(containerPorts.backend).BASE_URL}/login/role`,
      )
      .then(({ status, data: { message } }) => ({ status, message }))
      .catch(({ response: { status, data: { message } } }) => ({ status, message }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("message");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Token not found");
  });

  it('Será validado na API que não é possível retornar um objeto com o tipo de usuário, com um token inválido', async () => {
    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": "admin@admin.com",
      "password": "secret_admin"
    });

    expect(token).not.toBeNull();

    const result = await axios
      .get(
        `${URL(containerPorts.backend).BASE_URL}/login/role`,
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

  it.each(usersToLogin)('O avaliador verificará se ao tentar enviar um token válido no header authorization, o endpoint retornará um objeto com o tipo de usuário', async (userToLogin) => {
    const expectedResult = { "role": userToLogin.role }
    const { data: { token } } = await axios.post(`${URL(containerPorts.backend).BASE_URL}/login`, {
      "email": userToLogin.email,
      "password": userToLogin.password
    });

    expect(token).not.toBeNull();

    const result = await axios
      .get(
        `${URL(containerPorts.backend).BASE_URL}/login/role`,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      .then(({ status, data }) => ({ status, data }))
      .catch(({ response: { status, data } }) => ({ status, data }));

    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("data");
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject(expectedResult);
  });
});
