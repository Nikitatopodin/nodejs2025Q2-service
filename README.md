# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/get-started).

## Downloading

```
git clone https://github.com/Nikitatopodin/nodejs2025Q2-service
```

## Installing NPM modules

```
npm install --legacy-peer-deps
```

## Running application

Please, create .env file with all necessary variables (check .env.example file) before start.


You can either:

```
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```
and 

```
npm start
```
or :

```
docker compose up
```

If you run docker version migration will apply automatically.
Changes to ```src``` folder will restart container (hot reload).
You can check it by ```docker logs library_app -f``` and save anything inside ```src``` folder.

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```
