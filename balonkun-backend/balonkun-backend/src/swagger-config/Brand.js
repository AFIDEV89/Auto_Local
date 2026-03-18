"use strict";
import Common from "./Common.js";

const BrandFields = {
  name: {
    type: "string",
  },
};

const CreateBrand = {
  properties: {
    ...BrandFields,
  }
};

const UpdateBrand = {
  properties: {
    id: {
      type: "integer",
    },
    ...BrandFields,
  }
};

const GetBrand = {
  properties: {
    ...Common.CommonResponse.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...BrandFields,
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
  CreateBrand, GetBrand, UpdateBrand
};
