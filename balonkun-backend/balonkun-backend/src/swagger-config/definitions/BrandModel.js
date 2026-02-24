"use strict";
import Common from "./Common.js";

const BrandModelFields = {
  brand_id: {
    type: "integer",
  },
  name: {
    type: "string",
  },
};

const CreateBrandModel = {
  properties: {
    ...BrandModelFields,
  }
};

const UpdateBrandModel = {
  properties: {
    id: {
      type: "integer",
    },
    ...BrandModelFields,
  }
};

const GetBrandModel = {
  properties: {
    ...Common.CommonResponse.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...BrandModelFields,
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
  CreateBrandModel, GetBrandModel, UpdateBrandModel
};
