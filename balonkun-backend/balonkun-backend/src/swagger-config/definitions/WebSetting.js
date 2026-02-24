"use strict";
import Common from "./Common.js";

const WebSettingFields = {
  banners_limit: {
    type: 'integer',
  },
  dashboard_products_limit: {
    type: 'integer',
  },
};

const CreateWebSetting = {
  properties: {
    ...WebSettingFields,
  }
};

const UpdateWebSetting = {
  properties: {
    id: {
      type: "integer",
    },
    ...WebSettingFields,
  }
};

const GetWebSetting = {
  properties: {
    ...Common.CommonResponse.properties,
    data: {
      properties: {
        id: {
          type: "integer",
        },
        ...WebSettingFields,
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
  CreateWebSetting, GetWebSetting, UpdateWebSetting
};
