"use strict";
import Common from "./Common.js";

const DesignFields = {
  name: {
    type: "string",
  },
  image: {
    type: "string",
  },
};

const CreateDesign = {
  properties: {
    ...DesignFields,
  }
};

const UpdateDesign = {
  properties: {
    id: {
      type: "integer",
    },
    ...DesignFields,
  }
};

const GetDesign = {
  properties: {
    ...Common.CommonResponse.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...DesignFields,
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
  CreateDesign, GetDesign, UpdateDesign
};
