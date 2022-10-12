// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array with expanded=1', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .query({ expanded: '1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // Make an invalid route call
  test('make an invalid route call', async () => {
    const res = await request(app).get('/420/nice').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // Make an invalid route call to fragmentID
  test('make an invalid route call', async () => {
    const res = await request(app)
      .get('/v1/fragments/nice/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });

  // Make an invalid route call to fragmentID
  test('make an invalid route call', async () => {
    const res = await request(app).get('/v1/fragments/nice/').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});
