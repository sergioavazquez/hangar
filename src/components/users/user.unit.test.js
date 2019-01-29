const request = require('supertest');
const app = require('../../app');

describe('User', () => {
  test('Root shallow test', async done => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    done();
  });
});
