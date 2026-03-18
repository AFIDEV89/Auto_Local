"use strict";
import config from "../../../common/swagger.js";

const blogCategoryPaths = {
  ["/admin/blog-categories"]: {
    get: {
      tags: ["Blog Category"],
      summary: "To fetch blog category list",
      security: config.security,
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Enter blog category list page no",
        },
        {
          name: "limit",
          in: "query",
          description: "Enter no of blog categories you want to fetch",
        },
      ],
      responses: config.response.get_list('getBlogCategory'),
    },
    post: {
      tags: ["Blog Category"],
      summary: "To add new blog category",
      security: config.security,
      parameters: [
        {
          name: "blog category",
          in: "body",
          description: "Blog category that we want to create",
          schema: {
            $ref: "#/definitions/createBlogCategory",
          },
        },
      ],
      responses: config.response.create('createBlogCategory'),
    },
    put: {
      tags: ["Blog Category"],
      summary: "To update blog category",
      security: config.security,
      parameters: [
        {
          name: "blog category",
          in: "body",
          description: "Blog category that we want to update",
          schema: {
            $ref: "#/definitions/updateBlogCategory",
          },
        },
      ],
      responses: config.response.update
    },
  },
  ["/admin/blog-categories/{id}"]: {
    delete: {
      tags: ["Blog Category"],
      summary: "To delete blog category",
      security: config.security,
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Blog category that we want to delete",
        },
      ],
      responses: config.response.delete
    },
  }
};

export default blogCategoryPaths;
