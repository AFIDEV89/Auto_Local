"use strict";
import { API_POST_URLS, MODULE_TYPE } from "../../constants/index.js";
import { titleCase } from "../../utils/index.js";

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateOrder = {
    post: {
        tags: [titleCase(MODULE_TYPE.ORDER)],
        summary: "To place user order",
        security,
        parameters: [
            {
                name: "order",
                in: "body",
                description: "Order that we want to placed",
                schema: {
                    $ref: "#/definitions/CreateOrder",
                },
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/CreateOrder",
                },
            },
        },
    },
};

const GetOrderList = {
    get: {
        tags: [titleCase(MODULE_TYPE.ORDER)],
        summary: "To fetch order list",
        security,
        parameters: [
            {
                name: "store_id",
                in: "query",
                description: "Enter store id for orders that we want to fetch",
            },
            {
                name: "status",
                in: "query",
                description: "Enter status for orders that we want to fetch",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/CreateOrder",
                },
            },
        },
    },
};

const GetOrder = {
    get: {
        tags: [titleCase(MODULE_TYPE.ORDER)],
        summary: "To fetch order details",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Order that we want to fetch",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/CreateOrder",
                },
            },
        },
    },
};

const UpdateOrderStatus = {
    patch: {
        tags: [titleCase(MODULE_TYPE.ORDER)],
        summary: "To update order status",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Order ID",
            },
            {
                name: "order",
                in: "body",
                description: "Order status that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateOrderStatus",
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

export default {
    ["/" + MODULE_TYPE.ORDER + "/create"]: CreateOrder,
    ['/' + MODULE_TYPE.ORDER + "/get-list"]: GetOrderList,
    ['/' + MODULE_TYPE.ORDER + "/{id}"]: GetOrder,
    ['/' + MODULE_TYPE.ORDER + "/change-status/{id}"]: UpdateOrderStatus,
};
