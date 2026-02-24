"use strict";
import config from "../../../common/swagger.js";

const blogPaths = {
  // Admin app blog api's
  ["/admin/blogs"]: {
    post: {
      tags: ["Blog"],
      summary: "To add new blog",
      security: config.security,
      parameters: [
        {
          name: "blog",
          in: "body",
          description: "Blog that we want to create",
          schema: {
            $ref: "#/definitions/upsertBlog",
          },
        },
      ],
      responses: config.response.create('getBlog'),
    },
    get: {
      tags: ["Blog"],
      summary: "To fetch blog list",
      security: config.security,
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Enter blog list page no",
        },
        {
          name: "limit",
          in: "query",
          description: "Enter no of blogs you want to fetch",
        },
      ],
      responses: config.response.get_list('getBlog'),
    },
  },
  ["/admin/blogs/{id}"]: {
    put: {
      tags: ["Blog"],
      summary: "To update existing blog",
      security: config.security,
      parameters: [
        {
          name: "blog",
          in: "body",
          description: "Blog that we want to update",
          schema: {
            $ref: "#/definitions/upsertBlog",
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
    delete: {
      tags: ["Blog"],
      summary: "To delete existing blog",
      security: config.security,
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Blog that we want to delete",
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
  },

  // User app blog api's
  ["/user/blogs/dashboard"]: {
    get: {
      tags: ["Blog"],
      summary: "To fetch blog list",
      security: config.security,
      responses: config.response.get_list('getBlog'),
    },
  },
  ["/user/blogs/{id}"]: {
    get: {
      tags: ["Blog"],
      summary: "To fetch blog details",
      security: config.security,
      parameters: [
        {
          name: "id",
          in: "param",
          description: "Enter blog id",
        }
      ],
      responses: config.response.get_list('getBlog'),
    },
  },
  ["/user/blogs"]: {
    get: {
      tags: ["Blog"],
      summary: "To fetch blog list",
      security: config.security,
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Enter blog list page no",
        },
        {
          name: "limit",
          in: "query",
          description: "Enter no of blogs you want to fetch",
        },
      ],
      responses: config.response.get_list('getBlog'),
    },
  }
};

export default blogPaths;
