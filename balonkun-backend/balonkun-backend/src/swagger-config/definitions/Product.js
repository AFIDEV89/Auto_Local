"use strict";
import Common from "./Common.js";
import { model_values } from '../../constants/index.js';

const ProductFields = {
    category_id: {
        type: 'integer',
    },
    name: {
        type: 'string',
    },
    ratings: {
        type: 'number',
    },
    pictures: {
        "type": "array",
        "items": {
            "type": "string"
        }
    },
    videos: {
        "type": "array",
        "items": {
            "type": "string"
        }
    },
    original_price: {
        type: 'number',
    },
    discounted_price: {
        type: 'number',
    },
    detail: {
        type: 'string',
    },
    description: {
        type: 'string',
    },
    vehicle_type_id: {
        type: 'integer',
    },
    brand_id: {
        type: 'integer',
    },
    product_code: {
        type: 'string',
    },
    availability: {
        type: 'string',
        enum: model_values.product.availability,
    },
    quantity: {
        type: 'integer',
    },
    reviews: {
        "type": "array",
        "items": {
            "type": "object"
        }
    },
    tags: {
        "type": "array",
        "items": {
            "type": "string"
        }
    },
    suggestions: {
        "type": "array",
        "items": {
            "type": "integer"
        }
    },
    additional_info: {
        type: 'string'
    },
    is_latest: {
        "type": "boolean",
    },
    is_trending: {
        "type": "boolean",
    },
    variants: {
        "type": "array",
        "items": {
            "type": "object"
            // "type": {
            //     design_id: 'integer',
            //     material_id: 'integer',
            //     major_color_id: 'integer',
            //     minor_color_ids: 'integer'
            // }
        }
    },
};

const CreateProduct = {
    properties: {
        ...ProductFields,
    }
};

const UpdateProduct = {
    properties: {
        id: {
            type: "integer",
        },
        ...ProductFields,
    }
};

const GetProduct = {
    properties: {
        ...Common.CommonResponse.properties,
        data: {
            properties: {
                id: {
                    type: "integer",
                },
                ...ProductFields,
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
    CreateProduct, GetProduct, UpdateProduct
};
