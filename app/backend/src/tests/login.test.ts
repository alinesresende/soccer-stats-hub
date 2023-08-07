const chai = require('chai')
const bcrypt = require('bcryptjs');
// @ts-ignore
import * as sinon from 'sinon';
import { App } from '../app';
import UserModelTable from '../database/models/User';
import { InvalidPassword, loginValid, userMock } from './mocks/login.mocks';
// @ts-ignore
import chaiHttp = require('chai-http');

const jwt = require('jsonwebtoken');

const { app } = new App();


chai.use(chaiHttp);

const { expect } = chai;

describe('Integration Tests - Login', () => {

  beforeEach(function () {
    sinon.restore();
  });

  it('should return an error when e-mail non-existent', async function() {
    sinon.stub(UserModelTable, 'findOne').resolves(null);


    const { status, body } = await chai.request(app)
    .post('/login')
    .send(loginValid)

    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('should return an error when password is invalid', async function() {
    sinon.stub(UserModelTable, 'findOne').resolves(userMock as any);


    const { status, body } = await chai.request(app)
    .post('/login')
    .send(InvalidPassword)

    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('should return an error when email or password not exist', async function() {
    sinon.stub(UserModelTable, 'findOne').resolves(userMock as any);


    const { status, body } = await chai.request(app)
    .post('/login')
    .send({})

    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('should return token valid', async function() {
    sinon.stub(jwt, "sign").resolves('token');

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(loginValid)

    expect(status).to.equal(200);
    expect(body).to.deep.equal({ token: 'token'});
  });

  it('should return admin', async function() {

    sinon.stub(UserModelTable, 'findOne').resolves(userMock as any);

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ email: userMock.email }, secret);

    const res = await chai.request(app)
      .get('/login/role')
      .set('Authorization', `${token}`);

      expect(res.status).to.equal(200); 
      expect(res.body).to.deep.equal({ role: 'admin' }); 

  });

  it('check the token is not found', async function () {
  
    const { status, body } = await chai.request(app)
      .get('/login/role')
      
    expect(status).to.equal(401);
    expect(body).to.deep.equal({
      message: 'Token not found',
    });
  });

  it('should return 401 status when invalid token is provided', async function () {
    const invalidToken = 'Bearer invalid-token'; 
    const { status, body } = await chai.request(app)
      .get('/login/role')
      .set('Authorization', invalidToken);

    expect(status).to.equal(401);
    expect(body).to.deep.equal({
      message: 'Token must be a valid token',
    });
  })

})