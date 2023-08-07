import { expect } from 'chai';
import mapStatusHTTP from '../utils/mapStatusHTTP';

describe('mapStatusHTTP', function () {
  it('should map "SUCCESSFUL" to 200', function () {
    const status = 'SUCCESSFUL';
    const result = mapStatusHTTP(status);
    expect(result).to.equal(200);
  });

  it('should map "INVALID_DATA" to 400', function () {
    const status = 'INVALID_DATA';
    const result = mapStatusHTTP(status);
    expect(result).to.equal(400);
  });

  it('should map "NOT_FOUND" to 404', function () {
    const status = 'NOT_FOUND';
    const result = mapStatusHTTP(status);
    expect(result).to.equal(404);
  });

  it('should map "CONFLICT" to 409', function () {
    const status = 'CONFLICT';
    const result = mapStatusHTTP(status);
    expect(result).to.equal(409);
  });

  it('should map any other status to 500', function () {
    const status = 'UNKNOWN_STATUS';
    const result = mapStatusHTTP(status);
    expect(result).to.equal(500);
  });
});