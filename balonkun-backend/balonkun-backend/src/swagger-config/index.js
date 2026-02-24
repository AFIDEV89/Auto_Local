"use strict";
import Definitions from "./definitions/index.js";
import Paths from "./paths/index.js";
import Tags from "./Tags.js";
import config from "../../config.js";

const { API_URL, API_BASE_URL } = config;

const host = API_URL.split("//")[1];
const schemes = API_URL.split("://")[0];

export default {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "AutoForm API Documentation",
        description: "E-commerce Application API",
        license: {
            name: "MIT",
            url: "",
        },
    },
    host,
    basePath: API_BASE_URL,
    tags: Tags,
    schemes: [schemes],
    consumes: ["application/json"],
    produces: ["application/json"],
    paths: Paths,
    definitions: Definitions,
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api-key",
            in: "header",
        },
        Bearer: {
            type: "apiKey",
            name: "authorization",
            in: "header",
        },
        UserType: {
            type: "apiKey",
            name: "user-type",
            in: "header",
        },
    },
};
