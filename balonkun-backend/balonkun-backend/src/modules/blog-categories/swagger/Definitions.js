"use strict";
import config from "../../../common/swagger.js";

const blogCategoryFields = {
  name: {
    type: "string",
  },
};

const getBlogCategory = {
  properties: {
    ...config.response.common.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...blogCategoryFields,
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

const createBlogCategory = {
  properties: {
    ...blogCategoryFields,
  }
};

const updateBlogCategory = {
  properties: {
    id: {
      type: "integer",
    },
    ...blogCategoryFields,
  }
};

export default {
  getBlogCategory, createBlogCategory, updateBlogCategory
};
