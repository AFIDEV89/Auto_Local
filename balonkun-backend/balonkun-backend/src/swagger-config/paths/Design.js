"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateDesign = {
    post: {
        tags: [titleCase(MODULE_TYPE.DESIGN)],
        summary: "To add new design",
        security,
        parameters: [
            {
                name: "design",
                in: "body",
                description: "Design that we want to create",
                schema: {
                    $ref: "#/definitions/CreateDesign",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetDesign",
                },
            },
        },
    },
};

const GetDesignList = {
    get: {
        tags: [titleCase(MODULE_TYPE.DESIGN)],
        summary: "To fetch design list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetDesign",
                },
            },
        },
    },
};

const UpdateDesign = {
    put: {
        tags: [titleCase(MODULE_TYPE.DESIGN)],
        summary: "To update existing design",
        security,
        parameters: [
            {
                name: "design",
                in: "body",
                description: "Design that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateDesign",
                },
            },
        ],
        responses: {
            204: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const DeleteDesign = {
    delete: {
        tags: [titleCase(MODULE_TYPE.DESIGN)],
        summary: "To delete existing design",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Design that we want to delete",
            },
        ],
        responses: {
            204: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/DeleteResponse",
                },
            },
        },
    },
};

export default {
    ['/' + MODULE_TYPE.DESIGN + "/create"]: CreateDesign,
    ['/' + MODULE_TYPE.DESIGN + "/get-list"]: GetDesignList,
    ['/' + MODULE_TYPE.DESIGN + "/update"]: UpdateDesign,
    ['/' + MODULE_TYPE.DESIGN + getSwaggerPath("/delete/:id")]: DeleteDesign,
};
