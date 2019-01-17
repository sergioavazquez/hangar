const request = require('supertest');
const app = require('./app');
const db = require('./db'); // Database
const CONFIG = require('./config/config');

let testerToken;

const parseResponse = response => JSON.parse(response.res.text);

beforeAll(() => {
  return db.connect().then(() => db.connection.dropDatabase());
});

afterAll(done => {
  db.connection.dropDatabase().then(() => {
    db.disconnect();
    done();
  });
});

describe('User tests', () => {
  test('Root shallow test', async done => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    done();
  });

  test('It should fail to fetch without auth', async done => {
    const response = await request(app)
      .get('/v1/users/')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(401);
    done();
  });

  test('It should create a user', async done => {
    const response = await request(app)
      .post('/v1/users/')
      .set('Accept', 'application/json')
      .send({
        email: 'user1@gmail.com',
        password: CONFIG.test_user_pass,
        first: CONFIG.test_user,
        last: 'Testing',
      });

    testerToken = parseResponse(response).token;
    expect(response.statusCode).toBe(201);
    done();
  });

  test('It should fail to create user with same email', async done => {
    const response = await request(app)
      .post('/v1/users/')
      .set('Accept', 'application/json')
      .send({
        email: 'user1@gmail.com',
        password: CONFIG.test_user_pass,
        first: CONFIG.test_user,
        last: 'Testing',
      });

    expect(response.statusCode).toBe(422);
    done();
  });

  test('It should update user', async done => {
    const response = await request(app)
      .put('/v1/users/')
      .set('Accept', 'application/json')
      .set('Authorization', testerToken)
      .send({
        email: 'user1@gmail.com',
        password: CONFIG.test_user_pass,
        first: CONFIG.test_user,
        last: 'Updated',
      });

    expect(response.statusCode).toBe(200);

    done();
  });

  test('It should fetch previously updated user', async done => {
    const response = await request(app)
      .get('/v1/users/')
      .set('Accept', 'application/json')
      .set('Authorization', testerToken);

    expect(response.statusCode).toBe(200);
    expect(parseResponse(response).user.last).toEqual('Updated');
    done();
  });
});

describe('Note tests', () => {
  test('Create note', async done => {
    const response = await request(app)
      .post('/v1/notes/')
      .set('Accept', 'application/json')
      .set('Authorization', testerToken)
      .send({
        title: 'First Note',
        body: 'This is the content of the note.'
      });

    expect(response.statusCode).toBe(201);
    done();
  });
});
