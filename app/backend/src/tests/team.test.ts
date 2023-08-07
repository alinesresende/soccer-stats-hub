const chai = require('chai')
// @ts-ignore
import * as sinon from 'sinon';
import TeamModels from '../database/models/Team';
import { teamMocks } from './mocks/team.mocks';
// @ts-ignore
const chaiHttp = require('chai-http');

import { App } from '../app';

const { app } = new App();


chai.use(chaiHttp);

const { expect } = chai;

describe('Integration tests - Teams', () => {

  beforeEach(function () {
    sinon.restore();
  });

  it('should return all teams', async function() {

    sinon.stub(TeamModels, 'findAll').resolves(teamMocks as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teamMocks);
  })


  it('should return a team by id', async function() {

    sinon.stub(TeamModels, 'findOne').resolves(teamMocks as any);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teamMocks);
  });

  it('should return an error when id non-existest', async function() {

    sinon.stub(TeamModels, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/500');

    expect(status).to.equal(404);
    expect(body).to.deep.equal({message: 'Team 500 not found' });
  });

});
