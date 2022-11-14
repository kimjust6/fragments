const request = require('supertest');

const app = require('../../src/app');

// Using a valid username/password pair should give a success result with a .fragments array
test('add a new fragment', async () => {
  const res = await request(app)
    .post('/v1/fragments')
    .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
    .send('This is a fragment')
    .auth('user1@email.com', 'password1');
  expect(res.statusCode).toBe(201);
  expect(res.body.status).toBe('ok');
});
