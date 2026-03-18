"use strict";

/**
 * Adding blog model
 */
export const BlogModel = (sequelize, Sequelize) => {
  const model = sequelize.define("blogs", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    creator_name: {
      type: Sequelize.STRING,
      defaultValue: "Admin",
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT('long'),
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT('long'),
      allowNull: false,
    },
    blog_category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    is_popular: {
      type: Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },
    is_header: {
      type: Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    blog_author_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return model;
};
