const request = require('supertest');

const app = require('../../src/app');

test('delete a fragment that does not exist', async () => {
  const res = await request(app)
    .delete('/v1/fragments/nice')
    .set({ 'Content-Type': 'text/plain; charset=utf-8' })
    .send('This is a fragment')
    .auth('user1@email.com', 'password1');
  expect(res.statusCode).toBe(404);
  expect(res.body.status).toBe('error');
});
