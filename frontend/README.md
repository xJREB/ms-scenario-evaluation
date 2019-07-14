# Web-Based Frontend

> The web frontend to conveniently interact with the RESTful API (`api`), built with TypeScript and Vue.js

## Structure

-   `src/app.ts`: main file of the app that loads and configures all dependencies and kickstarts the parent Vue component
-   `src/router.ts`: configuration of routes (`route`: binding a `component` to a certain `path`)
-   `src/components/`: directory for all vue files
-   `src/App.vue`: basic app skeleton with header/nav, body, and footer
-   `src/config/index.ts`: configuration file with app or environment specific properties

## Build Setup

```bash
# install dependencies
npm install

# serve locally with hot reload (localhost:8000, adjustable in webpack.dev.config.js)
npm start

# build for production with minification
npm run build

# run TypeScript linter
npm run lint

# run SonarQube analysis (you need to pass parameters for the URL and token)
npm run sonar
```
