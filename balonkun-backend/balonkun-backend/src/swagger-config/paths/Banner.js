"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
    },
];

const userTypeSecurity = [
    {
        UserType: [],
    },
];

const CreateBanner = {
    post: {
        tags: [titleCase(MODULE_TYPE.BANNER)],
        summary: "To add new banner",
        security,
        parameters: [
            {
                name: "banner",
                in: "body",
                description: "Banner that we want to create",
                schema: {
                    $ref: "#/definitions/CreateBanner",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBanner",
                },
            },
        },
    },
};

const GetBannerList = {
    get: {
        tags: [titleCase(MODULE_TYPE.BANNER)],
        summary: "To fetch banner list",
        security: userTypeSecurity,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/GetBanner",
                },
            },
        },
    },
};

const UpdateBanner = {
    put: {
        tags: [titleCase(MODULE_TYPE.BANNER)],
        summary: "To update existing banner",
        security,
        parameters: [
            {
                name: "banner",
                in: "body",
                description: "Banner that we want to update",
                schema: {
                    $ref: "#/definitions/UpdateBanner",
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

const DeleteBanner = {
    delete: {
        tags: [titleCase(MODULE_TYPE.BANNER)],
        summary: "To delete existing banner",
        security,
        parameters: [
            {
                name: "id",
                in: "path",
                description: "Banner that we want to delete",
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
    ['/' + MODULE_TYPE.BANNER + "/create"]: CreateBanner,
    ['/' + MODULE_TYPE.BANNER + "/get-list"]: GetBannerList,
    ['/' + MODULE_TYPE.BANNER + "/update"]: UpdateBanner,
    ['/' + MODULE_TYPE.BANNER + getSwaggerPath("/delete/:id")]: DeleteBanner,
};
