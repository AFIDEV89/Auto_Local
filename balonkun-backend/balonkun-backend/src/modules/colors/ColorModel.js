"use strict";

/**
 * Adding color model
 */
export const ColorModel = (sequelize, Sequelize) => {
  const model = sequelize.define("color", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: Sequelize.STRING,
    },
    hexadecimal_code: {
      type: Sequelize.STRING(7),
      allowNull: true,
      trim: true
    },
  });

  return model;
};
