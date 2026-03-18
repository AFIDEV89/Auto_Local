"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase } from '../../utils/index.js';

const security = [
  {
    api_key: [],
    Bearer: [],
  },
];

const CreateWebSetting = {
  post: {
    tags: [titleCase(MODULE_TYPE.WEB_SETTING)],
    summary: "To set website settings",
    security,
    parameters: [
      {
        name: "Web Setting",
        in: "body",
        description: "Web settings that we want to add",
        schema: {
          $ref: "#/definitions/CreateWebSetting",
        },
      },
    ],
    responses: {
      201: {
        description: "Success",
        schema: {
          $ref: "#/definitions/GetWebSetting",
        },
      },
    },
  },
};

const GetWebSetting = {
  get: {
    tags: [titleCase(MODULE_TYPE.WEB_SETTING)],
    summary: "To fetch web settings",
    security,
    responses: {
      200: {
        description: "Success",
        schema: {
          $ref: "#/definitions/GetWebSetting",
        },
      },
    },
  },
};

const UpdateWebSetting = {
  put: {
    tags: [titleCase(MODULE_TYPE.WEB_SETTING)],
    summary: "To update web settings",
    security,
    parameters: [
      {
        name: "Web Setting",
        in: "body",
        description: "Web settings that we want to update",
        schema: {
          $ref: "#/definitions/UpdateWebSetting",
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

export default {
  ['/' + MODULE_TYPE.WEB_SETTING + "/create"]: CreateWebSetting,
  ['/' + MODULE_TYPE.WEB_SETTING + "/detail"]: GetWebSetting,
  ['/' + MODULE_TYPE.WEB_SETTING + "/update"]: UpdateWebSetting,
};
