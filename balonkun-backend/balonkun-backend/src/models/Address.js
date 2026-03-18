"use strict";

/**
 * Adding address model
 */
export const AddressModel = (sequelize, Sequelize) => {
  const model = sequelize.define("address", {
    store_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      trim: true // Trim leading and trailing spaces
    },
    street_address: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true // Trim leading and trailing spaces
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true // Trim leading and trailing spaces
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true // Trim leading and trailing spaces
    },
    postal_code: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true // Trim leading and trailing spaces
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true // Trim leading and trailing spaces
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true // Trim leading and trailing spaces
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true // Trim leading and trailing spaces
    },
  });

  return model;
};
