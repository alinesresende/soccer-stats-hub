const chai = require('chai')
// @ts-ignore
import * as sinon from 'sinon';
import MatchesModels from '../database/models/Matches';
// @ts-ignore
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

import { App } from '../app';
import { userMock } from './mocks/login.mocks';
import { listMatches, matchesInProgressFalse, matchesInProgressTrue } from './mocks/matches.mocks';

const { app } = new App();


chai.use(chaiHttp);

const { expect } = chai;

describe('Integration tests - Matches', () => {

  beforeEach(function () {
    sinon.restore();
  });

  it('should return all matches', async function() {

    sinon.stub(MatchesModels, 'findAll').resolves(listMatches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(listMatches);
  });

  it('should return matches when inProgress is false', async function() {

    sinon.stub(MatchesModels, 'findAll').resolves(matchesInProgressFalse as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=false');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchesInProgressFalse);
  });

  it('should return matches when inProgress is true', async function() {

    sinon.stub(MatchesModels, 'findAll').resolves(matchesInProgressTrue as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=true');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchesInProgressTrue);
  });

  it('should return match finished', async function() {

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ email: userMock.email }, secret);

    sinon.stub(MatchesModels, 'update').resolves();

    const { status, body } = await chai.request(app)
    .patch('/matches/1/finish')
    .set('Authorization', `${token}`);

    expect(status).to.equal(200);
    expect(body).to.deep.equal({message: 'Finished'});
  });


  it('should return match updated', async function() {

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ email: userMock.email }, secret);

    const updatedMatch = {
      homeTeamGoals: 3,
      awayTeamGoals: 1
    };

    sinon.stub(MatchesModels, 'update').resolves();

    const { status, body } = await chai.request(app)
    .patch('/matches/8')
    .set('Authorization', `${token}`)
    .send(updatedMatch)

    expect(status).to.equal(200);
    expect(body).to.deep.equal({message: 'Updated Match'});
  });

  it('should created new match', async function() {

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ email: userMock.email }, secret);

    const newMatch = new MatchesModels({
      homeTeamId: 8,
      homeTeamGoals: 1,
      awayTeamId: 9,
      awayTeamGoals: 1,
      inProgress: true,
    });
    
    sinon.stub(MatchesModels, 'create').resolves(newMatch);

    const bodyRequest = {
      homeTeamId: 8,
      homeTeamGoals: 1,
      awayTeamId: 9,
      awayTeamGoals: 1,
    }
    const { status, body } = await chai.request(app)
    .post('/matches')
    .set('Authorization', `${token}`)
    .send(bodyRequest)

    expect(status).to.equal(201);
    expect(body).to.deep.equal(newMatch.dataValues);
  });

  it('should checkHomeTeamAndAwayTeam', async function() {

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ email: userMock.email }, secret);

    const bodyRequest = {
      homeTeamId: 1,
      homeTeamGoals: 1,
      awayTeamId: 1,
      awayTeamGoals: 1,
    }

    const { status, body } = await chai.request(app)
    .post('/matches')
    .set('Authorization', `${token}`)
    .send(bodyRequest)

    expect(status).to.equal(422);
    expect(body).to.deep.equal({message: 'It is not possible to create a match with two equal teams'});
  });

  it('should checkTeamExits', async function() {

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ email: userMock.email }, secret);

    const bodyRequest = {
      homeTeamId: 99,
      homeTeamGoals: 1,
      awayTeamId: 98,
      awayTeamGoals: 1,
    }

    const { status, body } = await chai.request(app)
    .post('/matches')
    .set('Authorization', `${token}`)
    .send(bodyRequest)

    expect(status).to.equal(404);
    expect(body).to.deep.equal({message: 'There is no team with such id!'});
  });

});
