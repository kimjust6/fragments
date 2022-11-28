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
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // Make an invalid route call to fragmentID
  test('make an invalid route call', async () => {
    const res = await request(app).get('/v1/fragments/nice/').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // // get fragments in markdown
  // test('get /v1/fragments/:id in markdown', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
  //     .send('# Markdown Test')
  //     .auth('user1@email.com', 'password1');
  //   expect(res.statusCode).toBe(201);
  //   expect(res.body.status).toBe('ok');
  //   var fragmentID = res.body.fragment.id;

  //   const res2 = await request(app)
  //     .get('/v1/fragments/' + fragmentID)
  //     .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
  //     .auth('user1@email.com', 'password1');
  //   expect(res2.statusCode).toBe(200);
  //   expect(res2.body.status).toBe('ok');
  //   expect(res2.body.fragments).toBe('# Markdown Test');
  // });

  // // get fragments in html
  // test('get /v1/fragments/:id in html', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
  //     .send('# Markdown Test2')
  //     .auth('user1@email.com', 'password1');
  //   expect(res.statusCode).toBe(201);
  //   expect(res.body.status).toBe('ok');
  //   var fragmentID = res.body.fragment.id;

  //   const res2 = await request(app)
  //     .get('/v1/fragments/' + fragmentID + '.html')
  //     .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
  //     .auth('user1@email.com', 'password1');
  //   expect(res2.statusCode).toBe(200);
  //   expect(res2.body.status).toBe('ok');
  //   expect(res2.body.fragments).toContain('<h1>Markdown Test2</h1>');
  // });

  // get fragments in expanded
  test('get /v1/fragments/:id expanded', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
      .send('# Markdown Test2')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const res2 = await request(app)
      .get('/v1/fragments/?expanded=1')
      .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('ok');
    expect(res2.body.fragments[0].ownerId).toBe('dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==');
  });
});
