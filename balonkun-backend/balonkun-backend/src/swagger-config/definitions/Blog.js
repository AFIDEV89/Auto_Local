"use strict";
import Common from "./Common.js";

const BlogFields = {
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
};

const CreateBlog = {
  properties: {
    ...BlogFields,
  }
};

const UpdateBlog = {
  properties: {
    id: {
      type: "integer",
    },
    ...BlogFields,
  }
};

const GetBlog = {
  properties: {
    ...Common.CommonResponse.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...BlogFields,
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
  CreateBlog, GetBlog, UpdateBlog
};
