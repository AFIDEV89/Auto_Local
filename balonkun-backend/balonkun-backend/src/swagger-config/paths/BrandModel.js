"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateBrandModel = {
    post: {
        tags: [titleCase(MODULE_TYPE.BRAND_MODEL)],
        summary: "To add new brand model",
        security,
        parameters: [
            {
                name: "brand model",
                in: "body",
                description: "Brand model that we want to create",
                schema: {
                    $ref: "#/definitions/CreateBrandModel",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBrandModel",
                },
            },
        },
    },
};

const GetBrandModelList = {
    get: {
        tags: [titleCase(MODULE_TYPE.BRAND_MODEL)],
        summary: "To fetch brand model list",
        security,
        parameters: [
            {
                name: "brand_id",
                in: "query",
                description: "Enter brand id for models",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBrandModel",
                },
            },
        },
    },
};

const UpdateBrandModel = {
    put: {
        tags: [titleCase(MODULE_TYPE.BRAND_MODEL)],
        summary: "To update existing brand model",
        security,
        parameters: [
            {
                name: "brand model",
                in: "body",
                description: "Brand Model that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateBrandModel",
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

const DeleteBrandModel = {
    delete: {
        tags: [titleCase(MODULE_TYPE.BRAND_MODEL)],
        summary: "To delete existing brand model",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Brand model that we want to delete",
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
    ['/' + MODULE_TYPE.BRAND_MODEL + "/create"]: CreateBrandModel,
    ['/' + MODULE_TYPE.BRAND_MODEL + "/get-list"]: GetBrandModelList,
    ['/' + MODULE_TYPE.BRAND_MODEL + "/update"]: UpdateBrandModel,
    ['/' + MODULE_TYPE.BRAND_MODEL + getSwaggerPath("/delete/:id")]: DeleteBrandModel,
};
