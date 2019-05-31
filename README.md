# Hangar

This project provides a starting point for developing a backend API in NodeJS.

As an example a simple [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) notes application is provided.

The application integrates user management via [JWT](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete), integration tests, logs, documentation, a development environment with linting and hot reload and a production environment.

Stack consists of ExpressJS server with MongoDB as database.


## Getting Started

Define a `.env` file. Copy `example.env` as template.

Production db settings are:

`DB_NAME` Name of the database

`DB_USER` Name of the user

`DB_PASSWORD` Password of the user

`DB_DATA_DIR` Location of database

Testing db settings are:

`DB_TEST_NAME` Name of the database

`DB_TEST_USER` Name of the user

`DB_TEST_PASS` Password of the user

`DB_TEST_DIR` Location of testing database

Default database locations are:

`DB_DATA_DIR`=./database/mongo_db/

`DB_TEST_DIR`=./database/mongo_db_test/

If working within docker container `DB_HOST` needs to be the same as docker-compose MongoDB service. By default it's `hangar_db`. (Check `docker-compose.yml` files. If you need to change the name keep in mind there are several docker-compose files depending on environment)

If running locally, `DB_HOST` should be `localhost`.

The following fileds are self explanatory and are used to create a user when running integration tests.

`TEST_USER` User for testing

`TEST_PASS` Test user password

Remember changing `JWT_ENCRYPTION` string which is used as a secret by Passport to sign the JWT.

`JWT_EXPIRATION` expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms)

```
10h -> 10 hours
10d -> 10 days
1y -> 1 year
```

`AUTH_UNIQUE_KEY` is the unique field used for user registration.


## Usage without Docker
```
clone or fork repository

cd path/to/repository/root

npm install
```

For development run: `npm run dev`

It has linting and hot reload.

For production: `npm start`



## Usage with Docker

Install [Docker](https://docs.docker.com/install/)
```
clone or fork repository

cd path/to/repository/root

docker-compose build
```

After updating modules specify `no-cache` to force the entire build.

```
docker-compose build --no-cache
```

### run_docker

`run_docker` is a small bash script that allows you to execute a command as if you were inside the container.

There are predefined commands for development, debugging, testing and production listed below but you can also execute any other command on the shell such as `ls -la` to retrieve a list of
container elements.

Remember to take containers down after stopping them with `ctrl + C`, by running:

`docker-compose down`

If running into problems with previous containers clear docker after taking down all its running containers:

`docker system prune`

## Development

For delopment run: `./run_docker.sh -dev`

Development uses `docker-compose.develop.yml` which does not include `nginx` as a reverse proxy and uses `nodemon` and `ESlint` for hot reload and linting.
It also attaches an inspector for debugging in Chrome.

Containers used: `hangar_server`, `hangar_db`

port exposed: 3000

## Production

Build for production: `./run_docker.sh -start`
Production build uses `nginx` as a reverse proxy.

Containers used: `hangar_server`, `hangar_db`, `hangar_nginx`.

port exposed: 4000

## Testing

All tests should be in `./src/tests` folder and follow this naming convention:

Integration tests: `name.int.test.js`

Unit tests: `name.unit.test.js`

__Running tests:__

Run integration tests: `./run_docker.sh -test`

Run unit tests: `./run_docker.sh -test_u`


Run tests in debug mode: `./run_docker.sh -test_d`

_Runs tests with attached inspector for debugging_

Example tests:
![hangar-docs](./docs/integration-tests.png "Hangar docs")

__Important notes on testing:__

When running integration tests, `docker-compose.test.yml` is used to setup mongo's test db.

All tests run on `mongo_db_test` leaving production db untouched. `mongo_db_test` is dropped after test runs.

## Logs

`./logs` folder contains `nginx` and `nodejs` logs. There's no need to get inside containers.

Log configuration is available in `./src/config/winston.js`

## NGINX

NGINX is used as a reverse proxy on production setup: `docker-compose.yml`

Configuration file is available here: `./src/config/nginx/nginx.conf`

## Useful Info:

__Debugging docker container__

Containers execute and close. If a container execution fails it'll stop, and you can't get shell access to it for debugging.

running: `./run_docker.sh -debug`

Will keep the container up so you can get access to it.

Open another console and run `docker exec -it <name> sh`

__Debugging MongoDB__

`./run_docker.sh -debug` to initialize all containers.
`docker exec -it database sh` will open a shell inside Mongo container.
`mongo` to access mongo's shell.

By default there are no database users, so in order to connect with an external tool like [Nosqlclient](https://nosqlclient.com/) you need to create one first.

Inside MongoDB's shell:

In this example `name` is the name of the database.

```
use name

db.createUser(
    {
      user: "admin",
      pwd: "adminpass",
      roles: [ { role: "userAdmin", db: "name" } ]
    }
  )
```

__Removing ESLint__

In order to keep hot reload with eslint in development, `nodemon.json` is used to set which scripts to run when starting or restarting nodemon. To avoid linting during development just edit the file as needed.
By default `lint` script in `package.json` is set with `--fix` flag. Remove it to avoid autofixing.

## Documentation

__Basic API Docs__

Here are a few examples on how to use the API.

Keep in mind that depending on build, `production` or `dev` port can be either `4000` or `3000` respectively.

Headers for request:

`Content-Type` - `application/json`

`Authorization` - `Bearer JWT.ProvidedByAPI.OnLoginOrUserCreate`

A few endpoints:

`POST localhost:3000/v1/users/`

```
{
	"email": "user1@gmail.com",
	"password": "123456",
	"first": "John",
	"last":"Doe"
}
```

`POST localhost:3000/v1/users/login`

```
{
	"email": "user1@gmail.com",
	"password": "123456"
}
```

`POST localhost:3000/v1/notes`
```
{
	"title":"Note title",
	"body": "Note content"
}
```
`GET localhost:3000/v1/notes`

API docs are here:  `0.0.0.0:4000/v1/docs/`

This is how they look:

![hangar-docs](./docs/hangar-swagger-doc-example.png "Hangar docs")


## Technologies:
- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [Nodemon](https://nodemon.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [PassportJS](http://www.passportjs.org/)
- [JWT](https://jwt.io/)
- [Docker](https://www.docker.com/)
- [ESLint](https://eslint.org/)
  - [Airbnb style](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
- [Prittier](https://prettier.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Jest](https://jestjs.io/)
- [Winston](https://github.com/winstonjs/winston)
- [Swagger](https://swagger.io/)
- [Nginx](https://www.nginx.com/)