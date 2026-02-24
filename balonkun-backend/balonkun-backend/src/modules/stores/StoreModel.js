"use strict";

/**
 * Adding store model
 */
export const StoreModel = (sequelize, Sequelize) => {
  const model = sequelize.define("store", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true // Trim leading and trailing spaces
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true // Trim leading and trailing spaces
    },
    contact_no: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true // Trim leading and trailing spaces
    },
  });

  return model;
};
