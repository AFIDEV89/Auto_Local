"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, removeHypen, getSwaggerPath } from '../../utils/index.js';

const security = [
  {
    api_key: [],
    Bearer: [],
  },
];

const AddProductToCart = {
  post: {
    tags: [titleCase(removeHypen(MODULE_TYPE.CART_PRODUCT))],
    summary: "To add product to user cart",
    security,
    parameters: [
      {
        name: "Cart Product",
        in: "body",
        description: "Product that we want to add in cart",
        schema: {
          $ref: "#/definitions/AddProductToCart",
        },
      },
    ],
    responses: {
      201: {
        description: "Success",
        schema: {
          $ref: "#/definitions/AddProductToCart",
        },
      },
    },
  },
};

const UpdateCartProductQuantity = {
  put: {
    tags: [titleCase(removeHypen(MODULE_TYPE.CART_PRODUCT))],
    summary: "To update cart product quantity",
    security,
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Product ID",
      },
      {
        name: "cart product",
        in: "body",
        description: "Product that we want to update cart product quantity",
        schema: {
          $ref: "#/definitions/UpdateCartProductQuantity",
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

const RemoveProductFromCart = {
  delete: {
    tags: [titleCase(removeHypen(MODULE_TYPE.CART_PRODUCT))],
    summary: "To remove added product from the cart",
    security,
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Product that we want to remove from the cart",
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

const GetCartProductList = {
  get: {
    tags: [titleCase(removeHypen(MODULE_TYPE.CART_PRODUCT))],
    summary: "To fetch cart product list",
    security,
    responses: {
      200: {
        description: "Success",
        schema: {
          $ref: "#/definitions/CartProductList",
        },
      },
    },
  },
};

const GetTotalNoOfCartProducts = {
  get: {
    tags: [titleCase(removeHypen(MODULE_TYPE.CART_PRODUCT))],
    summary: "To get total no. of cart products",
    security,
    responses: {
      200: {
        description: "Success",
        schema: {
          $ref: "#/definitions/GetTotalNoOfCartProducts",
        },
      },
    },
  },
};

export default {
  ['/' + MODULE_TYPE.CART_PRODUCT + "/create"]: AddProductToCart,
  ['/' + MODULE_TYPE.CART_PRODUCT + getSwaggerPath("/update/:id")]: UpdateCartProductQuantity,
  ['/' + MODULE_TYPE.CART_PRODUCT + getSwaggerPath("/delete/:id")]: RemoveProductFromCart,
  ['/' + MODULE_TYPE.CART_PRODUCT + "/get-list"]: GetCartProductList,
  ['/' + MODULE_TYPE.CART_PRODUCT + "/count"]: GetTotalNoOfCartProducts,
};
