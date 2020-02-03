# Hangar

This project provides a starting point for developing, testing and deploying a backend API in NodeJS.

As an example a simple [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) notes application is provided.

Stack consists of ExpressJS server with MongoDB as database.

The application integrates user management via [JWT](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete), integration tests, logs, working documentation, a development environment with linting and hot reload and an easily deployable production environment that includes HTTPS certificates.


# Getting Started

1- Update `app_definition.json`.
This information is used by Open Api Documentation.

```
{
  "name": "New App",
  "version": "0.0.1",
  "description": "Cool app",
  "contact_email": "dev@gmail.com",
  "license": "Apache 2.0",
  "license_url": "http://www.apache.org/licenses/LICENSE-2.0.html"
}
```

2- Create a `.env` file using `example.env` as template.

__.env variables:__

`HANGAR_VERSION` Used internally. Don't worry.

`APP_DOMAIN` Domain for the app, without `www`. e.g.: example.com

`DOMAIN_EMAIL` Email provided to `Let's Encrypt` as contact for the domain.

`SERVER_PORT` Express server port. Used internally. (default: 3000)

`HANGAR_PORT` Port used to connect to the API. (default: 4000)

Warning: Changing port configuration in `.env` without updating Dockerfile and docker-compose accordingly will break the app.

_Mongo root access:_

For security reasons a mongo admin user is created along with the database to administrate the it.

`MONGO_ROOT_USERNAME` mongo's admin user.

`MONGO_ROOT_PASSWORD` mongo's admin pass.

`DB_HOST` needs to be the same as docker-compose MongoDB service. By default it's `hangar_db`. (Check `docker-compose.yml` files. If you need to change the name keep in mind there are several docker-compose files depending on environment)

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

The following fileds are self explanatory and are used to create a user when running integration tests.

`TEST_USER` User for testing

`TEST_PASS` Test user password

_User authentication_

`JWT_ENCRYPTION` string used as a secret to sign the JWT. It's important you change this.

`JWT_EXPIRATION` expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms)

```
10h -> 10 hours
10d -> 10 days
1y -> 1 year
```

`AUTH_UNIQUE_KEY` is the unique field used for user registration.

_Nginx configuration_

`HTTPS_NGINX_TEMPLATE`, `HTTP_NGINX_TEMPLATE` Template configurations for nginx config file.
This are the files you need to edit if you need to update `Nginx` configuration.

`HTTPS_NGINX_OUTPUT`, `HTTP_NGINX_OUTPUT` Location of `Nginx` config files. Do not edit these directly as they'll be overriden.

# Requirements

1 - [Install Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04).

2 - [Install Docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04).

# Installation

```
clone or fork repository

cd path/to/repository/root

docker-compose build
```

After updating modules specify `no-cache` to force the entire build.

```
docker-compose build --no-cache
```

In order to begin development:
```
./hangar.sh -dev
```

### hangar.sh

`hangar.sh` is a small bash script that helps you run the project.

Remember to take containers down after stopping them with `ctrl + C`, by running:
```
docker-compose down
```

If running into problems with previous containers clear docker after taking down all its running containers:
```
docker system prune
```
Then clear volumes:
```
docker volume prune
```

# Development

For delopment run: `./hangar.sh -dev`

Development uses `docker-compose.develop.yml` which does not include `nginx` as a reverse proxy and uses `nodemon` and `ESlint` for hot reload and linting.
It also attaches an inspector for debugging in Chrome.

Containers used: `hangar_server`, `hangar_db`

port exposed: 4000

# Testing

All tests should be in `./src/tests` folder and follow this naming convention:

Integration tests: `name.int.test.js`

Unit tests: `name.unit.test.js`

__Running tests:__

Run integration tests: `./hangar.sh -test`

Run unit tests: `./hangar.sh -test_u`

Run tests in debug mode: `./hangar.sh -test_d`

_Runs tests with attached inspector for debugging_

Example tests:
![hangar-docs](./docs/integration-tests.png "Hangar docs")

__Important notes on testing:__

When running integration tests, `docker-compose.test.yml` is used to setup mongo's test db.

All tests run on `mongo_db_test` leaving production db untouched. `mongo_db_test` is dropped after test runs.

# Production

Production build uses `nginx` as a reverse proxy.

Containers used: `hangar_server`, `hangar_db`, `hangar_nginx`.

port exposed: 80

If you need to edit http or https `Nginx` config files edit the templates, as actual `.conf` files are dynamically generated.

```
./src/config/nginx/template.nginx.http.conf
./src/config/nginx/template.nginx.https.conf
```

For a quick start, there's an `HTTP` build:
```
./hangar.sh -start
```
or if you don't want it daemonized:
```
./hangar.sh --start
```

For final production environment run:

```
// Setup SSL Certificate first!! (read below)

./hangar.sh -start-https
```

`hangar.sh` script will build an `nginx.http.conf` or `nginx.https.conf` respectively based on its template.

If config has changed and you want to update it, delete the file or add a second paramter `-u`.

```
./hangar.sh [start] -u
```
(which forces hangar script to update nginx config file)

__Generating SSL certificate:__

1 - Configure desired domain and contact email in `.env`

2 - Make sure your there's an `A RECORD` in your domains register panel pointing to the production server's `IP`. This should be obvious, but if the server cannot be reached by accessing the domain, `certbot` has no way of verifying domain's ownership and thus will not issue the certificate.

3 - Run certbot in stage mode to check the configuration:
```
./hangar.sh --cert-stage
```

If everything's OK certbot will exit with code 0.

4 - Run certbot to generate certificates:
```
./hangar.sh --cert-prod
```
Certificate will be located in: `ssl_cert/etc/live/`

5 - Generate a `Diffie-Hellman` key used for [Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy).

```
sudo openssl dhparam -out ./ssl_cert/dhparam/dhparam-2048.pem 2048
```
It takes some time...

6 - Done. Start the server
```
./hangar.sh -start-https
```

Certificate is provided by [Let's Encrypt](https://letsencrypt.org/)

# Logs

`./logs` folder contains `nginx` and `nodejs` logs. There's no need to get inside containers.

Log configuration is available in `./src/config/winston.js`

# Useful Info:

__Debugging NodeJS Application__

Run: `./hangar.sh -dev`

Open Chrome and paste the web socket address exposed by the debugger:

![debug-nodejs](./docs/debug_NodeJS.png "Hangar docs")

In this case:
```
0.0.0.0:9229/7f754516-b715-494b-8d5f-2fea4ca7c533
```

Open Chrome devTools and click on the node icon located on the upper left corner.

That's it, you should be able to debug the entire app from the devTools window that pops up.

__Debugging docker container__

Containers execute and close. If a container execution fails it'll stop, and you can't get shell access to it for debugging.

running: 
```
./hangar.sh -debug
```

Will keep `hangar_server` container up so you can get access to it.

```
docker-compose exec <service_name> [command]

// examples:

docker-compose exec hangar_server ls /home

docker-compose exec hangar_nginx ls -la /etc/letsencrypt/live
```


__Debugging MongoDB__

`./hangar.sh -debug` to initialize all containers.
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

__Demo API__

Test API beyond localhost using ssh port forwarding via [Serveo](https://serveo.net/)

```
ssh -o ServerAliveInterval=60 -R example:80:localhost:4000 serveo.net
```

This will forward incoming requests to `https://example.serveo.net` (port 80) to `localhost:4000`.


# Documentation

__Basic API Docs__

Here are a few examples on how to use the API.

Keep in mind that depending on build, `production` or `dev` port can be either `80` or `4000` respectively.

Headers for request:

`Content-Type` - `application/json`

`Authorization` - `Bearer JWT.ProvidedByAPI.OnLoginOrUserCreate`

A few endpoints:

`POST localhost:4000/v1/users/`

```
{
	"email": "user1@gmail.com",
	"password": "123456",
	"first": "John",
	"last":"Doe"
}
```

`POST localhost:4000/v1/users/login`

```
{
	"email": "user1@gmail.com",
	"password": "123456"
}
```

`POST localhost:4000/v1/notes`
```
{
	"title":"Note title",
	"body": "Note content"
}
```
`GET localhost:4000/v1/notes`

API docs are here:  `0.0.0.0:4000/v1/docs/`

This is how they look:

![hangar-docs](./docs/hangar-swagger-doc-example.png "Hangar docs")

# Current versions:
__Node.js:__ `12.14.1 LTS`

__MongoDB:__ `4.2`
#

# Technologies:
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
- [Certbot](https://certbot.eff.org/)