// CAVEAT: needs to be presents, otherwise exceptions will be thrown
// TODO: investigate this
import * as mongoose from "mongoose";

// If global ENV variables are not set, overwrite with defaults
process.env.PORT = process.env.PORT || "3000";
process.env.DB_HOST = process.env.DB_HOST || "localhost:27017";
process.env.DB_NAME = process.env.DB_NAME || "sbs-evaluation";

import * as expressOasGenerator from "express-oas-generator";
import App from "./App.class";
import router from "./routes";

const app = new App(router).express;

app.listen(process.env.PORT, error => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
    console.log(`API is listening on http://localhost:${process.env.PORT}`);
    console.log(
        `The following mongodb instance is used: mongodb://${
            process.env.DB_HOST
        }/${process.env.DB_NAME}`
    );
});

// api documentation can be found under http://localhost:${process.env.PORT}`)/api-docs/
// the following code line generated it
expressOasGenerator.init(app, {});
