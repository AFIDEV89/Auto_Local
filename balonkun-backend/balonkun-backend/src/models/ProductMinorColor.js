"use strict";

/**
 * Adding product minor color model
 */
export const ProductMinorColorModel = (sequelize, Sequelize) => {
  const model = sequelize.define("product_minor_color", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    color_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  });

  return model;
};
