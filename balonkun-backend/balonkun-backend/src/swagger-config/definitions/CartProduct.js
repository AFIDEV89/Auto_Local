"use strict";
import Product from "./Product.js";
import Common from "./Common.js";

const GetCartProduct = {
  required: ['product_id', 'quantity'],
  properties: {
    product_id: {
      type: "integer",
    },
    quantity: {
      type: "integer",
    },
    ...Common.RowDates.properties
  },
};

const AddProductToCart = {
  required: ['product_id'],
  properties: {
    product_id: {
      type: "integer",
    },
  },
};

const UpdateCartProductQuantity = {
  required: ['operationType'],
  properties: {
    operationType: {
      type: "string",
      default: "increment"
    },
  },
};

const CartProductList = {
  required: [
    'id',
    "user_id",
    "product_id",
    "quantity",
    "createdAt",
    "updatedAt",
    'product'
  ],
  properties: {
    statusCode: { type: 'integer' },
    message: { type: 'string' },
    data: {
      properties: {
        id: {
          type: "integer",
        },
        user_id: {
          type: "integer",
        },
        product_id: {
          type: "integer",
        },
        quantity: {
          type: "integer",
        },
        createdAt: {
          type: "string",
        },
        updatedAt: {
          type: "string",
        },
        product: {
          properties: {
            ...Product.properties
          }
        }
      }
    }
  },
};

const GetTotalNoOfCartProducts = {
  properties: {
    ...Common.CommonResponse.properties,
    data: {
      type: "integer"
    },
  },
};

export default {
  AddProductToCart, UpdateCartProductQuantity, CartProductList, GetTotalNoOfCartProducts
};
