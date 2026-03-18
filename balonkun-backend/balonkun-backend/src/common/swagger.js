"use strict";

const apiCommonResponse = {
  statusCode: {
    type: "integer",
  },
  message: {
    type: "string",
  },
  error: {
    type: "string",
  }
};

const config = {
  response: {
    create: (schema) => ({
      200: {
        description: "Success",
        schema: {
          $ref: `#/definitions/${schema}`,
        },
      },
      500: {
        description: "Server Error",
        schema: {
          properties: apiCommonResponse
        }
      },
    }),
    update: {
      properties: {
      },
    },
    delete: {
      properties: {
      },
    },
    get_list: (schema) => ({
      200: {
        description: "Success",
        schema: {
          $ref: `#/definitions/${schema}`,
        },
      },
      500: {
        description: "Server Error",
        schema: {
          properties: apiCommonResponse
        }
      },
    }),
    rowDates: {
      required: ["createdAt", 'updatedAt'],
      properties: {
        createdAt: {
          type: "string",
        },
        updatedAt: {
          type: "string",
        },
      },
    },
    common: {
      properties: apiCommonResponse,
    },
  },
  security: [
    {
      api_key: [],
      Bearer: [],
      UserType: [],
    },
  ]
};

export default config;
