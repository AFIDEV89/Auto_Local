"use strict";
import Common from "./Common.js";

const VehicleDetailsFields = {
    vehicle_type_id: {
        type: "integer",
    },
    brand_id: {
        type: "integer",
    },
    model_id: {
        type: "integer",
    },
    month: {
        type: "string",
    },
    image: {
        type: "string",
    },
    year: {
        type: "string",
    },
    vehicle_category_id: {
        type: "integer",
    },
    model_variant: {
        type: "string",
    },
};

const CreateVehicleDetails = {
    properties: {
        ...VehicleDetailsFields,
    }
};

const UpdateVehicleDetails = {
    properties: {
        id: {
            type: "integer",
        },
        ...VehicleDetailsFields,
    }
};

const GetVehicleDetails = {
    properties: {
        ...Common.CommonResponse.properties,
        data: {
            properties: {
                id: {
                    type: "integer",
                },
                ...VehicleDetailsFields,
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
    CreateVehicleDetails, GetVehicleDetails, UpdateVehicleDetails
};
