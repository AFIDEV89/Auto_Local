"use strict";

/**
 * SubCategory Model
 */
export const SubCategoryModel = (sequelize, Sequelize) => {
  const model = sequelize.define("subcategory", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    canonical: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "subCategories",
    freezeTableName: true
  });

  return model;
};
