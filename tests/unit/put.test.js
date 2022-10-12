const request = require('supertest');

const app = require('../../src/app');

// Using a valid username/password pair should give a success result with a .fragments array
// test('authenticated users get a fragments array', async () => {
//   const res = await request(app)
//     .put('/v1/fragments/nice')
//     .set({ 'Content-Type': 'text/plain; charset=utf-8' })
//     .send('This is a fragment')
//     .auth('user1@email.com', 'password1');
//   expect(res.statusCode).toBe(201);
//   expect(res.body.status).toBe('ok');
// });

test('put a fragment that does not exist', async () => {
  const res = await request(app)
    .put('/v1/fragments/nice')
    .set({ 'Content-Type': 'text/plain; charset=utf-8' })
    .send('This is a fragment')
    .auth('user1@email.com', 'password1');
  expect(res.statusCode).toBe(404);
  expect(res.body.status).toBe('error');
});
