# Hangar

This project provides a starting point for developing a backend API in NodeJS.
It's possible to develop and build inside a `Docker` container or run it locally.

Stack consists of ExpressJS server with MongoDB as database. User authentication is achieved with JWT.

## Getting Started

Define a `.env` file. Copy `example.env` as template.

First, create a folder for Mongo to store the database. Default is set to:
`DB_DATA_DIR`=./database/mongo_db/

If working within docker container `DB_HOST` needs to be the same as docker-compose MongoDB service. By default it's `database`. (Check `docker-compose.yml`)

If running locally, `DB_HOST` should be `localhost`.

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

### run_docker

`run_docker` is a small bash script that allows you to execute a command as if you were inside the container.

For delopment run: `./run_docker.sh 'npm run dev'`

Build for production: `./run_docker.sh 'npm start'`

You can also execute any other command on the shell such as `ls -la` to retrieve a list of
container elements.

Remember to stop containers after stopping them with `ctrl + C`, by running:

`docker-compose down`

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

__Basic API Docs__

Here are a few examples on how to use the API. For more info read the code.

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