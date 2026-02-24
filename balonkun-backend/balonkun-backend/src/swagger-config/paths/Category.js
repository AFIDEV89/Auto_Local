"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateCategory = {
    post: {
        tags: [titleCase(MODULE_TYPE.CATEGORY)],
        summary: "To create category",
        security,
        parameters: [
            {
                name: "category",
                in: "body",
                description: "Category that we want to create",
                schema: {
                    $ref: "#/definitions/Category",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Category",
                },
            },
        },
    },
};

const GetCategoryList = {
    get: {
        tags: [titleCase(MODULE_TYPE.CATEGORY)],
        summary: "To fetch category list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Category",
                },
            },
        },
    },
};

const UpdateCategory = {
    put: {
        tags: [titleCase(MODULE_TYPE.CATEGORY)],
        summary: "To update existing category",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Category ID",
            },
            {
                name: "category",
                in: "body",
                description: "Category that we want to update",
                schema: {
                    $ref: "#/definitions/Category",
                },
            },
        ],
        responses: {
            204: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Category",
                },
            },
        },
    },
};

const DeleteCategory = {
    delete: {
        tags: [titleCase(MODULE_TYPE.CATEGORY)],
        summary: "To delete existing category",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Category that we want to delete",
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
    ['/' + MODULE_TYPE.CATEGORY + "/create"]: CreateCategory,
    ['/' + MODULE_TYPE.CATEGORY + "/get-list"]: GetCategoryList,
    ['/' + MODULE_TYPE.CATEGORY + getSwaggerPath("/update/:id")]: UpdateCategory,
    ['/' + MODULE_TYPE.CATEGORY + getSwaggerPath("/delete/:id")]: DeleteCategory,
};
