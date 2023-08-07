const testCoverage = require('../utils/testCoverage');
const { getRequirement } = require('../utils/util');

const backEndCoverage = async () => testCoverage('app_backend');

let backEnd;

beforeAll(async () => {
  backEnd = await backEndCoverage();

  expect(backEnd).toMatchObject({
    path: expect.any(String),
    skipped: expect.any(Number),
    pct: expect.any(Number),
    covered: expect.any(Number),
  });
});

describe(getRequirement(2), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(5);
    expect(backEnd.covered).toBeGreaterThanOrEqual(7);
  });
});

describe(getRequirement(4), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(10);
    expect(backEnd.covered).toBeGreaterThanOrEqual(19);
  });
});

describe(getRequirement(7), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(15);
    expect(backEnd.covered).toBeGreaterThanOrEqual(25);
  });
});

describe(getRequirement(9), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(20);
    expect(backEnd.covered).toBeGreaterThanOrEqual(35);
  });
});

describe(getRequirement(11), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(30);
    expect(backEnd.covered).toBeGreaterThanOrEqual(45);
  });
});

describe(getRequirement(14), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(45);
    expect(backEnd.covered).toBeGreaterThanOrEqual(70);
  });
});

describe(getRequirement(19), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(60);
    expect(backEnd.covered).toBeGreaterThanOrEqual(80);
  });
});

describe(getRequirement(22), () => {
  test('No back-end', () => {
    expect(backEnd.skipped).toStrictEqual(0);
    expect(backEnd.pct).toBeGreaterThanOrEqual(80);
    expect(backEnd.covered).toBeGreaterThanOrEqual(100);
  });
});
