"use strict";

/**
 * Adding Material model
 */
export const MaterialModel = (sequelize, Sequelize) => {
  const model = sequelize.define("material", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: Sequelize.STRING,
    },
  });

  return model;
};
