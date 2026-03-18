"use strict";
import Common from "./Common.js";

const VehicleCategoryFields = {
    name: {
        type: "string",
    },
};

const CreateVehicleCategory = {
    properties: {
        ...VehicleCategoryFields,
    }
};

const UpdateVehicleCategory = {
    properties: {
        id: {
            type: "integer",
        },
        ...VehicleCategoryFields,
    }
};

const GetVehicleCategory = {
    properties: {
        ...Common.CommonResponse.properties,
        data: {
            properties: {
                id: {
                    type: "integer",
                },
                ...VehicleCategoryFields,
                createdAt: {
                    type: "string",
                },
                updatedAt: {
                    type: "string",
                }
            }
        }
    },
};

export default {
    CreateVehicleCategory, GetVehicleCategory, UpdateVehicleCategory
};
