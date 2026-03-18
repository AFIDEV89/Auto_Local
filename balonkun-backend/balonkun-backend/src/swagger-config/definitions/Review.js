"use strict";

export default {
    required: ["name", "description", "rating"],
    properties: {
        product_id: {
            type: "number"
        },
        name: {
            type: "string",
        },
        image: {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        description: {
            type: "string"
        },
        rating: {
            type: "number"
        }
    },
};
