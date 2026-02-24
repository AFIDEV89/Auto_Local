"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
  {
    api_key: [],
    Bearer: [],
  },
];

const CreateStore = {
  post: {
    tags: [titleCase(MODULE_TYPE.STORE)],
    summary: "To add new store",
    security,
    parameters: [
      {
        name: "store",
        in: "body",
        description: "Store that we want to create",
        schema: {
          $ref: "#/definitions/CreateStore",
        },
      },
    ],
    responses: {
      201: {
        description: "Success",
        schema: {
          $ref: "#/definitions/CreateStore",
        },
      },
    },
  },
};

const UpdateStore = {
  put: {
    tags: [titleCase(MODULE_TYPE.STORE)],
    summary: "To update existing store",
    security,
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Store ID",
      },
      {
        name: "store",
        in: "body",
        description: "Store that we want to update",
        schema: {
          $ref: "#/definitions/CreateStore",
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

const DeleteStore = {
  delete: {
    tags: [titleCase(MODULE_TYPE.STORE)],
    summary: "To delete existing store",
    security,
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Store that we want to delete",
      },
    ],
    responses: {
      204: {
        description: "Success",
      },
    },
  },
};

const GetStoreList = {
  get: {
    tags: [titleCase(MODULE_TYPE.STORE)],
    summary: "To fetch store list",
    security,
    responses: {
      200: {
        description: "Success",
        schema: {
          $ref: "#/definitions/StoreList",
        },
      },
    },
  },
};

const GetStore = {
  get: {
    tags: [titleCase(MODULE_TYPE.STORE)],
    summary: "To fetch store details",
    security,
    parameters: [
      {
        name: "id",
        in: "path",
        description: "Store that we want to fetch",
      },
    ],
    responses: {
      200: {
        description: "Success",
        schema: {
          $ref: "#/definitions/GetStore",
        },
      },
    },
  },
};

export default {
  ['/' + MODULE_TYPE.STORE + "/create"]: CreateStore,
  ['/' + MODULE_TYPE.STORE + getSwaggerPath("/update/:id")]: UpdateStore,
  ['/' + MODULE_TYPE.STORE + "/get-list"]: GetStoreList,
  ['/' + MODULE_TYPE.STORE + getSwaggerPath("/delete/:id")]: DeleteStore,
  ['/' + MODULE_TYPE.STORE + "/{id}"]: GetStore,
};
