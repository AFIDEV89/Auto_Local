"use strict";

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateBlog = {
    post: {
        tags: ["Blog"],
        summary: "To add new blog",
        security,
        parameters: [
            {
                name: "blog",
                in: "body",
                description: "Blog that we want to create",
                schema: {
                    $ref: "#/definitions/CreateBlog",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBlog",
                },
            },
        },
    },
};

const GetBlogList = {
    get: {
        tags: ["Blog"],
        summary: "To fetch blog list",
        security,
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
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBlog",
                },
            },
        },
    },
};

const UpdateBlog = {
    put: {
        tags: ["Blog"],
        summary: "To update existing blog",
        security,
        parameters: [
            {
                name: "blog",
                in: "body",
                description: "Blog that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateBlog",
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

const DeleteBlog = {
    delete: {
        tags: ["Blog"],
        summary: "To delete existing blog",
        security,
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
};

export default {
    ["/blogs"]: CreateBlog,
    ["/blogs"]: GetBlogList,
    ["/blogs/:id"]: UpdateBlog,
    ["/blogs/:id"]: DeleteBlog,
};
