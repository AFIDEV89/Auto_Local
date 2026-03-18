"use strict";

const CreateAddress = {
  required: ["street_address", 'city', 'state', 'postal_code', 'country', 'latitude', 'longitude'],
  properties: {
    street_address: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    postal_code: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    latitude: {
      type: 'string',
    },
    longitude: {
      type: 'string',
    },
  }
};

const GetAddress = {
  required: ['id', "store_id", "street_address", 'city', 'state', 'postal_code', 'country', 'latitude', 'longitude', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'integer',
    },
    store_id: {
      type: 'integer',
    },
    street_address: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    postal_code: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    latitude: {
      type: 'string',
    },
    longitude: {
      type: 'string',
    },
    createdAt: {
      type: "string",
    },
    updatedAt: {
      type: "string",
    },
  }
};

export default {
  CreateAddress, GetAddress
};
