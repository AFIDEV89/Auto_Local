"use strict";
import bodyParser from "body-parser";
import express from "express";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import url from "url";

import config from "./config.js";
import db from "./src/database/index.js"

import {
    Authenticator,
    // ApiValidator
} from "./src/middlewares/index.js";
import routes from "./src/routes/index.js";
import SwaggerConfig from "./src/swagger-config/index.js";

const app = express();

const { PORT, API_DOCUMENTATION_URL, API_URL, ALLOWED_ORIGINS, AUTHENTICATOR_SWITCH, API_VALIDATOR_SWITCH, RESET_DATBASE_SWITCH } = config;

app.use(express.json());

// requests log middleware
app.use(logger("dev"));

// api request body parser
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

// database syncing
db.sync(RESET_DATBASE_SWITCH === "on" ? { force: true } : {});

// server authentication middleware
app.use(function (req, res, next) {
    const { origin } = req.headers;
    console.log(origin)
    // if (ALLOWED_ORIGINS.indexOf(origin) > -1) {
        res.header("Access-Control-Allow-Origin", "*");
    // }
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Api-Key, Authorization, User-Type");
    next();
});

// welcome api if user want to check server is running or not
app.get("/", (req, res) => {
    res.json("Welcome to AutoForm Server");
});

// api documentation
app.use(API_DOCUMENTATION_URL, swaggerUi.serve, swaggerUi.setup(SwaggerConfig));

// app authentication middleware
AUTHENTICATOR_SWITCH === "on" && app.use(Authenticator);

// api validator middleware
// API_VALIDATOR_SWITCH === "on" && app.use(ApiValidator);

// api routes
routes(app);

// server running
app.listen(PORT, () => {
    const serverApiUrl = url.parse(API_URL, true);
    const severDocUrl = url.parse(`${API_URL}${API_DOCUMENTATION_URL}`, true);
    console.log("\x1b[34m", "Server Listening at", serverApiUrl.href);
    console.log("\x1b[34m", "API Documentation at", severDocUrl.href);
    console.log("\x1b[0m");
});
