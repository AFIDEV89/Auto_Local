"use strict";

/**
 * Adding blog category model
 */
export const BlogCategoryModel = (sequelize, Sequelize) => {
  const model = sequelize.define("blog_categories", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return model;
};
