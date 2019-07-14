# Scenario-Based Evolvability Evaluation of Service- and Microservice-Based Systems

> A tool to support the scenario-based evolvability evaluation of service- and microservice-based systems

For more information on the scenario-based method and its evaluation, see the [_docs](_docs) folder. The tool consists of three main components, namely a RESTful API implemented with Node.js (see `api` folder), a MongoDB for data persistence, and a web-based frontend for end-user access implemented with Vue.js (see `frontend` folder).

## Quick Start Guide Without Docker

-   Download and install Node.js (<https://nodejs.org/en/download>)
-   Download and install MongoDB (<https://www.mongodb.com/download-center/v2/community>), then start it on port 27017
-   Start the API
    -   Navigate into the `api` directory and install dependencies via `npm install`
    -   Start the API via `npm start`
- Start the web frontend
    -   Navigate into the `frontend` directory and install dependencies via `npm install`
    -   Start the frontend via `npm start`
-   Your browser will open at <http://localhost:8000> and you can start using the application

