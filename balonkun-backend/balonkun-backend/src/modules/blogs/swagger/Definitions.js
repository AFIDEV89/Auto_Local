"use strict";
import config from "../../../common/swagger.js";

const blogFields = {
  title: {
    type: "string",
  },
  image: {
    type: "string",
  },
  creator_name: {
    type: "string",
    default: "Admin",
  },
  description: {
    type: "string",
  },
  content: {
    type: "string",
  },
};

const upsertBlog = {
  properties: {
    ...blogFields,
  }
};

const getBlog = {
  properties: {
    ...config.response.common.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...blogFields,
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
  upsertBlog, getBlog
};
