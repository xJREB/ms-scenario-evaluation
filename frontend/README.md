# Web-Based Frontend

> The web frontend to conveniently interact with the RESTful API (`api`), built with TypeScript and Vue.js

## Structure

-   `src/app.ts`: main file of the app that loads and configures all dependencies and kickstarts the parent Vue component
-   `src/router.ts`: configuration of routes (`route`: binding a `component` to a certain `path`)
-   `src/components/`: directory for all vue files
-   `src/App.vue`: basic app skeleton with header/nav, body, and footer
-   `src/config/index.ts`: configuration file with app or environment specific properties

## Prerequisites and Usage

-   Install Node.js: <https://nodejs.org/en/download/>
-   Run `npm install` in this directory to install dependencies of this project
-   The frontend expects the `api` to run on <http://localhost:3000> (adjustable in `src/config/index.ts`)
-   Run `npm start`
-   Your browser will open the frontend at <http://localhost:8000> and you can start using the application

## Detailed Build Setup and Commands

```bash
# install dependencies
npm install

# serve locally with hot reload (localhost:8000, adjustable in webpack.dev.config.js)
npm start

# build for production with minification
npm run build

# serve local production build
npm run start-prod

# run TypeScript linter
npm run lint

# run SonarQube analysis (you need to pass parameters for the URL and token)
npm run sonar
```
