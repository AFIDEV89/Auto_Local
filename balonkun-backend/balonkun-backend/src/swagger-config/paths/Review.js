"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const CreateReview = {
    post: {
        tags: [titleCase(MODULE_TYPE.REVIEW)],
        summary: "To add new review",
        security,
        parameters: [
            {
                name: "review",
                in: "body",
                description: "Review that we want to create",
                schema: {
                    $ref: "#/definitions/Review",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Review",
                },
            },
        },
    },
};

const GetReviewList = {
    get: {
        tags: [titleCase(MODULE_TYPE.REVIEW)],
        summary: "To fetch review list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Review",
                },
            },
        },
    },
};

const UpdateReview = {
    put: {
        tags: [titleCase(MODULE_TYPE.REVIEW)],
        summary: "To update existing review",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Review ID",
            },
            {
                name: "review",
                in: "body",
                description: "Review that we want to update",
                schema: {
                    $ref: "#/definitions/Review",
                },
            },
        ],
        responses: {
            204: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/Review",
                },
            },
        },
    },
};

const DeleteReview = {
    delete: {
        tags: [titleCase(MODULE_TYPE.REVIEW)],
        summary: "To delete existing review",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Review that we want to delete",
            },
        ],
        responses: {
            204: {
                description: "Success",
            },
        },
    },
};

export default {
    ['/' + MODULE_TYPE.REVIEW + "/create"]: CreateReview,
    ['/' + MODULE_TYPE.REVIEW + "/get-list"]: GetReviewList,
    ['/' + MODULE_TYPE.REVIEW + getSwaggerPath("/update/:id")]: UpdateReview,
    ['/' + MODULE_TYPE.REVIEW + getSwaggerPath("/delete/:id")]: DeleteReview,
};
