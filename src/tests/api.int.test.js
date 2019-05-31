const request = require('supertest');
const app = require('../app');

const { container } = app.locals;
const db = container.resolve('db');
const store = container.resolve('store');
const CONFIG = container.resolve('config');

const parseResponse = response => JSON.parse(response.res.text);

beforeAll(() => db.connect().then(() => db.connection.dropDatabase()));

afterAll(done => {
  db.connection.dropDatabase().then(() => {
    db.disconnect();
    done();
  });
});

describe('User', () => {
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

    store.setByKey('token', parseResponse(response).token);

    expect(response.statusCode).toBe(201);
    done();
  });

  test('It should create a second user', async done => {
    const response = await request(app)
      .post('/v1/users/')
      .set('Accept', 'application/json')
      .send({
        email: 'user2@gmail.com',
        password: CONFIG.test_user_pass,
        first: CONFIG.test_user,
        last: 'Second',
      });

    expect(response.statusCode).toBe(201);
    done();
  });

  test('It should login second user', async done => {
    const response = await request(app)
      .post('/v1/users/login/')
      .set('Accept', 'application/json')
      .send({
        email: 'user2@gmail.com',
        password: CONFIG.test_user_pass,
      });

    store.setByKey('token_user2', parseResponse(response).token);

    expect(response.statusCode).toBe(200);
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
      .set('Authorization', store.getByKey('token'))
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
      .set('Authorization', store.getByKey('token'));

    expect(response.statusCode).toBe(200);
    expect(parseResponse(response).user.last).toEqual('Updated');
    done();
  });
});

describe('Note tests', () => {
  test('Create user1 note', async done => {
    const response = await request(app)
      .post('/v1/notes/')
      .set('Accept', 'application/json')
      .set('Authorization', store.getByKey('token'))
      .send({
        title: 'First Note',
        body: 'This is the content of the note.',
      });

    store.setByKey('noteId', parseResponse(response).note._id);
    expect(response.statusCode).toBe(201);
    done();
  });

  test('Create user2 note', async done => {
    const response = await request(app)
      .post('/v1/notes/')
      .set('Accept', 'application/json')
      .set('Authorization', store.getByKey('token_user2'))
      .send({
        title: 'First Note',
        body: 'Second user, first note.',
      });

    store.setByKey('noteId_user2', parseResponse(response).note._id);
    expect(response.statusCode).toBe(201);
    done();
  });

  test('Update note', async done => {
    const response = await request(app)
      .put(`/v1/notes/${store.getByKey('noteId')}`)
      .set('Accept', 'application/json')
      .set('Authorization', store.getByKey('token'))
      .send({
        title: 'Updated',
        body: 'This note has been updated.',
      });

    expect(response.statusCode).toBe(200);
    done();
  });

  test('It should verify previous note was updated', async done => {
    const response = await request(app)
      .get(`/v1/notes/${store.getByKey('noteId')}`)
      .set('Accept', 'application/json')
      .set('Authorization', store.getByKey('token'));

    expect(parseResponse(response).note.title).toEqual('Updated');
    expect(response.statusCode).toBe(200);
    done();
  });

  test('It fail to fetch user2 note', async done => {
    const response = await request(app)
      .get(`/v1/notes/${store.getByKey('noteId_user2')}`)
      .set('Accept', 'application/json')
      .set('Authorization', store.getByKey('token'));

    expect(response.statusCode).toBe(401);
    done();
  });
});
