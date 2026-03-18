"use strict";
import Address from "./Address.js";
import Common from "./Common.js";

const StoreFields = {
  name: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
  contact_no: {
    type: 'string',
  },
};

const CreateStore = {
  properties: {
    ...StoreFields,
    ...Address.CreateAddress.properties
  }
};

const GetStore = {
  properties: {
    ...Common.RowDates.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...StoreFields,
        createdAt: {
          type: "string",
        },
        updatedAt: {
          type: "string",
        },
        address: {
          properties: Address.GetAddress.properties
        }
      }
    }
  },
};

const StoreList = {
  properties: {
    statusCode: { type: 'integer' },
    message: { type: 'string' },
    data: {
      properties: [{ properties: GetStore.properties.data.properties }]
    },
  }
};

export default {
  CreateStore, GetStore, StoreList
};
