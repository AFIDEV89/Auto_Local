"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, removeHypen, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const GetVehicleTypesList = {
    get: {
        tags: [titleCase(removeHypen(MODULE_TYPE.VEHICLE_DETAIL))],
        summary: "To fetch vehicle types list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/VehicleDetails",
                },
            },
        },
    },
};

const CreateVehicleDetails = {
    post: {
        tags: [titleCase(removeHypen(MODULE_TYPE.VEHICLE_DETAIL))],
        summary: "To create vehicle detail",
        security,
        parameters: [
            {
                name: "vehcile details",
                in: "body",
                description: "Vehicle detail that we want to create",
                schema: {
                    $ref: "#/definitions/CreateVehicleDetails",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetVehicleDetails",
                },
            },
        },
    },
};

const GetVehicleDetailList = {
    get: {
        tags: [titleCase(removeHypen(MODULE_TYPE.VEHICLE_DETAIL))],
        summary: "To fetch vehice detail list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/CreateVehicleDetails",
                },
            },
        },
    },
};


const UpdateVehicleDetail = {
    put: {
        tags: [titleCase(removeHypen(MODULE_TYPE.VEHICLE_DETAIL))],
        summary: "To update existing vehicle detail",
        security,
        parameters: [
            {
                name: "vehicle detail",
                in: "path",
                description: "Vehicle Detail that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateVehicleDetails",
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

const DeleteVehicleDetail = {
    delete: {
        tags: [titleCase(removeHypen(MODULE_TYPE.VEHICLE_DETAIL))],
        summary: "To delete existing vehicle detail",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Vehicle detail that we want to delete",
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
    ['/' + MODULE_TYPE.VEHICLE_DETAIL + "/vehicle-types"]: GetVehicleTypesList,
    ['/' + MODULE_TYPE.VEHICLE_DETAIL + "/create"]: CreateVehicleDetails,
    ['/' + MODULE_TYPE.VEHICLE_DETAIL + "/get-list"]: GetVehicleDetailList,
    ['/' + MODULE_TYPE.VEHICLE_DETAIL + getSwaggerPath("/update/:id")]: UpdateVehicleDetail,
    ['/' + MODULE_TYPE.VEHICLE_DETAIL + getSwaggerPath("/delete/:id")]: DeleteVehicleDetail,
};
