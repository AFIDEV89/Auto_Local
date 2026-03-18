"use strict";

const CreateOrder = {
    required: ["store_id"],
    properties: {
        store_id: {
            type: "integer",
        },
    },
};

const UpdateOrderStatus = {
    properties: {
        status: {
            type: "string",
        },
    },
};

export default {
    CreateOrder,
    UpdateOrderStatus
};
