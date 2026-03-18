"use strict";

/**
 * Adding product category model
 */
export const ProductCategoryModel = (sequelize, Sequelize) => {
  const model = sequelize.define("category", {
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
  });

  return model;
};
