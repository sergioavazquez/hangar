const request = require('supertest');
const app = require('./app');

describe('Root path', () => {
  test('It should respond the GET method', async done => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    done();
  });
});
