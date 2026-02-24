"use strict";
import Common from "./Common.js";

const BannerFields = {
    title: {
        type: "string",
    },
    image: {
        type: "string"
    },
    url: {
        type: "string"
    },
};

const CreateBanner = {
    properties: {
        ...BannerFields,
    }
};

const UpdateBanner = {
    properties: {
        id: {
            type: "integer",
        },
        ...BannerFields,
    }
};

const GetBanner = {
    properties: {
        ...Common.CommonResponse.properties,
        data: {
            properties: {
                id: {
                    type: "integer",
                },
                ...BannerFields,
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
    CreateBanner, GetBanner, UpdateBanner
};
