"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
        UserType: [],
    },
];

const userTypeSecurity = [
    {
        UserType: [],
    },
];

const CreateProduct = {
    post: {
        tags: [titleCase(MODULE_TYPE.PRODUCT)],
        summary: "To create products.",
        security,
        parameters: [
            {
                name: "product",
                in: "body",
                description: "Product that we want to create",
                schema: {
                    $ref: "#/definitions/CreateProduct",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetProduct",
                },
            },
        },
    },
};

const GetProductList = {
    get: {
        tags: [titleCase(MODULE_TYPE.PRODUCT)],
        summary: "To fetch product list",
        security,
        parameters: [
            {
                name: "search",
                in: "query",
                description: "Get product list on basis of the category name",
            },
            {
                name: "vehicle_type_id",
                in: "query",
                description: "Get product list on basis of the vehicle type",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetProduct",
                },
            },
        },
    },
};

const UpdateProduct = {
    put: {
        tags: [titleCase(MODULE_TYPE.PRODUCT)],
        summary: "To update existing product",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Product ID",
            },
            {
                name: "product",
                in: "body",
                description: "Product that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateProduct",
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

const DeleteProduct = {
    delete: {
        tags: [titleCase(MODULE_TYPE.PRODUCT)],
        summary: "To delete existing product",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Product that we want to delete",
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

const GetDashboardProductList = {
    get: {
        tags: [titleCase(MODULE_TYPE.DASHBOARD)],
        summary: "To fetch dashboard product list",
        security: userTypeSecurity,
        parameters: [
            {
                name: "category",
                in: "query",
                description: "Products that we want to fetch",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetProduct",
                },
            },
        },
    },
};

const GetProduct = {
    get: {
        tags: [titleCase(MODULE_TYPE.PRODUCT)],
        summary: "To fetch product details",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Product that we want to fetch",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetProduct",
                },
            },
        },
    },
};

const GetProductFilters = {
    get: {
        tags: [titleCase(MODULE_TYPE.PRODUCT)],
        summary: "To fetch product filters",
        security,
        responses: {
            200: {
                description: "Success",
            },
        },
    },
};

export default {
    ['/' + MODULE_TYPE.PRODUCT + "/create"]: CreateProduct,
    ['/' + MODULE_TYPE.PRODUCT + "/get-list"]: GetProductList,
    ['/' + MODULE_TYPE.PRODUCT + getSwaggerPath("/update/:id")]: UpdateProduct,
    ['/' + MODULE_TYPE.PRODUCT + getSwaggerPath("/delete/:id")]: DeleteProduct,
    ['/' + MODULE_TYPE.DASHBOARD + "/get-product-list"]: GetDashboardProductList,
    ['/' + MODULE_TYPE.PRODUCT + "/{id}"]: GetProduct,
    ['/' + MODULE_TYPE.PRODUCT + '/filters']: GetProductFilters,
};
