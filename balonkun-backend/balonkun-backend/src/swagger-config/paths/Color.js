"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateColor = {
    post: {
        tags: [titleCase(MODULE_TYPE.COLOR)],
        summary: "To add new color",
        security,
        parameters: [
            {
                name: "color",
                in: "body",
                description: "Color that we want to create",
                schema: {
                    $ref: "#/definitions/Color",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Color",
                },
            },
        },
    },
};

const GetColorList = {
    get: {
        tags: [titleCase(MODULE_TYPE.COLOR)],
        summary: "To fetch color list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Color",
                },
            },
        },
    },
};

const UpdateColor = {
    put: {
        tags: [titleCase(MODULE_TYPE.COLOR)],
        summary: "To update existing color",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Color ID",
            },
            {
                name: "color",
                in: "body",
                description: "Color that we want to update",
                schema: {
                    $ref: "#/definitions/Color",
                },
            },
        ],
        responses: {
            204: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Color",
                },
            },
        },
    },
};

const DeleteColor = {
    delete: {
        tags: [titleCase(MODULE_TYPE.COLOR)],
        summary: "To delete existing color",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Color that we want to delete",
            },
        ],
        responses: {
            204: {
                description: "Success",
            },
        },
    },
};

export default {
    ['/' + MODULE_TYPE.COLOR + "/create"]: CreateColor,
    ['/' + MODULE_TYPE.COLOR + "/get-list"]: GetColorList,
    ['/' + MODULE_TYPE.COLOR + getSwaggerPath("/update/:id")]: UpdateColor,
    ['/' + MODULE_TYPE.COLOR + getSwaggerPath("/delete/:id")]: DeleteColor,
};
