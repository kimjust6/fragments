const request = require('supertest');
const app = require('../../src/app');

test('put a fragment that does not exist', async () => {
  const res = await request(app)
    .put('/v1/fragments/nice')
    .set({ 'Content-Type': 'text/plain; charset=utf-8' })
    .send('This is a fragment')
    .auth('user1@email.com', 'password1');
  expect(res.statusCode).toBe(404);
  expect(res.body.status).toBe('error');
});

// test('put a fragment and check the result', async () => {
//   const res1 = await request(app)
//     .post('/v1/fragments')
//     .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
//     .send('This is a fragment')
//     .auth('user1@email.com', 'password1');
//   expect(res1.statusCode).toBe(201);
//   expect(res1.body.status).toBe('ok');
//   var fragmentID = res1.body.fragment.id;

//   const res2 = await request(app)
//     .put('/v1/fragments/' + fragmentID)
//     .set({ 'Content-Type': 'text/plain; charset=utf-8' })
//     .send('test 3')
//     .auth('user1@email.com', 'password1');
//   expect(res2.statusCode).toBe(200);
//   expect(res2.body.status).toBe('ok');

//   const res3 = await request(app)
//     .get('/v1/fragments/' + fragmentID)
//     .set({ 'Content-Type': 'text/markdown; charset=utf-8' })
//     .auth('user1@email.com', 'password1');
//   expect(res3.statusCode).toBe(200);
//   expect(res3.body.status).toBe('ok');
//   expect(res3.body.fragments).toContain('test 3');
// });
