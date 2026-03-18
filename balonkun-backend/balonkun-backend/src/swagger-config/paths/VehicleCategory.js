"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateVehicleCategory = {
    post: {
        tags: [titleCase(MODULE_TYPE.VEHICLE_CATEGORY)],
        summary: "To add new vehicle category",
        security,
        parameters: [
            {
                name: "Vehicle Category",
                in: "body",
                description: "Vehicle category that we want to create",
                schema: {
                    $ref: "#/definitions/CreateVehicleCategory",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetVehicleCategory",
                },
            },
        },
    },
};

const GetVehicleCategoryList = {
    get: {
        tags: [titleCase(MODULE_TYPE.VEHICLE_CATEGORY)],
        summary: "To fetch vehicle category list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetVehicleCategory",
                },
            },
        },
    },
};

const UpdateVehicleCategory = {
    put: {
        tags: [titleCase(MODULE_TYPE.VEHICLE_CATEGORY)],
        summary: "To update existing vehicle category",
        security,
        parameters: [
            {
                name: "vehicle category",
                in: "body",
                description: "VehicleCategory that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateVehicleCategory",
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

const DeleteVehicleCategory = {
    delete: {
        tags: [titleCase(MODULE_TYPE.VEHICLE_CATEGORY)],
        summary: "To delete existing vehicle category",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Vehicle category that we want to delete",
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
    ['/' + MODULE_TYPE.VEHICLE_CATEGORY + "/create"]: CreateVehicleCategory,
    ['/' + MODULE_TYPE.VEHICLE_CATEGORY + "/get-list"]: GetVehicleCategoryList,
    ['/' + MODULE_TYPE.VEHICLE_CATEGORY + "/update"]: UpdateVehicleCategory,
    ['/' + MODULE_TYPE.VEHICLE_CATEGORY + getSwaggerPath("/delete/:id")]: DeleteVehicleCategory,
};
