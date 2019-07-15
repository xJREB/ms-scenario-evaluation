# RESTful API

> The RESTful API with CRUD resources for scenarios, built with TypeScript and Express.js

## Structure

-   `src/index.ts`: entry file for the app that starts of express server and contains all ENV variables
-   `src/App.class.ts`: express app class where middleware is configured
-   `src/routes/`: directory for all routes; all `*.routes.ts` files in here are automatically included by `index.ts` and injected into `App.class.ts`.
-   `test/`: directory for all tests

## Prerequisites and Usage

-   Install Node.js: <https://nodejs.org/en/download/>
-   Run `npm install` in this directory to install dependencies of this project
-   Install MongoDB and start it on port 27017 (URL and port required by the API are adjustable via setting the ENV variable `DB_HOST`)
    -   Standalone executable: <https://www.mongodb.com/download-center/v2/community>
    -   Docker example: `docker run --name ms-scenario-evaluation-db -p 27017:27017 -d mongo:4`
-   Run `npm start`
    -   API will be available at <http://localhost:3000>
    -   Swagger UI will be available at <http://localhost:3000/api-docs>

## Environment Variables for Configuration

The following ENV variables can be used to override the defaults:

-   `PORT`: the port the API runs on (default: `3000`)
-   `DB_HOST`: the host (or IP) and port for the used MongoDB instance (default: `localhost:27017`)
-   `DB_NAME`: the name of the used MongoDB collection (default: `sbs-evaluation`)

## Detailed Build Setup and Commands

```bash
# install dependencies
npm install

# serve locally with hot reload on localhost:3000 (adjustable in `src/config/config.ts` or with ENV variable `PORT`)
npm start

# build node.js version for production
npm run build

# serve local production build
npm run start-prod

# run TypeScript linter
npm run lint

# run tests
npm test

# run SonarQube analysis (you need to pass parameters for the URL and token)
npm run sonar
```

## TODOs

-   [ ] Fix test
-   [ ] Investigate mongoose issues and upgrade to newest version
