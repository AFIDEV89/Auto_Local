"use strict";

export default {
  UpdateResponse: {
    properties: {
    },
  },
  DeleteResponse: {
    properties: {
    },
  },
  RowDates: {
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
  CommonResponse: {
    properties: {
      statusCode: {
        type: "integer",
      },
      message: {
        type: "string",
      },
    },
  }
};
