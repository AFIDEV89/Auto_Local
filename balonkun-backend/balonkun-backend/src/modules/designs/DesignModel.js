"use strict";

/**
 * Adding design model../../controllers/Index.js
 */
export const DesignModel = (sequelize, Sequelize) => {
  const model = sequelize.define("design", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    image: { // TODO: in future we will remove image
      type: Sequelize.STRING,
      allowNull: true,
      trim: true
    },
    pictures: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });

  return model;
};
