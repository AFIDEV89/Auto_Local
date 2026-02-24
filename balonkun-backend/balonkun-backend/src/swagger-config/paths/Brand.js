"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateBrand = {
    post: {
        tags: [titleCase(MODULE_TYPE.BRAND)],
        summary: "To add new brand",
        security,
        parameters: [
            {
                name: "brand",
                in: "body",
                description: "Brand that we want to create",
                schema: {
                    $ref: "#/definitions/CreateBrand",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBrand",
                },
            },
        },
    },
};

const GetBrandList = {
    get: {
        tags: [titleCase(MODULE_TYPE.BRAND)],
        summary: "To fetch brand list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBrand",
                },
            },
        },
    },
};

const UpdateBrand = {
    put: {
        tags: [titleCase(MODULE_TYPE.BRAND)],
        summary: "To update existing brand",
        security,
        parameters: [
            {
                name: "brand",
                in: "body",
                description: "Brand that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateBrand",
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

const DeleteBrand = {
    delete: {
        tags: [titleCase(MODULE_TYPE.BRAND)],
        summary: "To delete existing brand",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Brand that we want to delete",
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
    ['/' + MODULE_TYPE.BRAND + "/create"]: CreateBrand,
    ['/' + MODULE_TYPE.BRAND + "/get-list"]: GetBrandList,
    ['/' + MODULE_TYPE.BRAND + "/update"]: UpdateBrand,
    ['/' + MODULE_TYPE.BRAND + getSwaggerPath("/delete/:id")]: DeleteBrand,
};
