"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateMaterial = {
    post: {
        tags: [titleCase(MODULE_TYPE.MATERIAL)],
        summary: "To add new material",
        security,
        parameters: [
            {
                name: "material",
                in: "body",
                description: "Material that we want to create",
                schema: {
                    $ref: "#/definitions/Material",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Material",
                },
            },
        },
    },
};

const GetMaterialList = {
    get: {
        tags: [titleCase(MODULE_TYPE.MATERIAL)],
        summary: "To fetch material list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Material",
                },
            },
        },
    },
};

const UpdateMaterial = {
    put: {
        tags: [titleCase(MODULE_TYPE.MATERIAL)],
        summary: "To update existing material",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Material ID",
            },
            {
                name: "material",
                in: "body",
                description: "Material that we want to update",
                schema: {
                    $ref: "#/definitions/Material",
                },
            },
        ],
        responses: {
            204: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Material",
                },
            },
        },
    },
};

const DeleteMaterial = {
    delete: {
        tags: [titleCase(MODULE_TYPE.MATERIAL)],
        summary: "To delete existing material",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Material that we want to delete",
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
    ['/' + MODULE_TYPE.MATERIAL + "/create"]: CreateMaterial,
    ['/' + MODULE_TYPE.MATERIAL + "/get-list"]: GetMaterialList,
    ['/' + MODULE_TYPE.MATERIAL + getSwaggerPath("/update/:id")]: UpdateMaterial,
    ['/' + MODULE_TYPE.MATERIAL + getSwaggerPath("/delete/:id")]: DeleteMaterial,
};
