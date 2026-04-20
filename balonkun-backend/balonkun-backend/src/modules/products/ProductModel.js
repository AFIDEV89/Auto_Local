"use strict";
import { model_values } from '../../constants/index.js';

/**
 * Adding product model
 */
export const ProductModel = (sequelize, Sequelize) => {
  const model = sequelize.define("product", {
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    subcategory_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    vehicle_details_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ratings: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    pictures: {
      type: Sequelize.JSON,
    },
    videos: {
      type: Sequelize.JSON,
    },
    original_price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    discounted_price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    detail: {
      type: Sequelize.TEXT('long'),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT('long'),
      allowNull: true
    },
    vehicle_type_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    product_code: {
      type: Sequelize.STRING,
      allowNull: true
    },
    availability: {
      type: Sequelize.ENUM(model_values.product.availability),
      defaultValue: model_values.product.availability[1]
    },
    viewed: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    reviews: {
      type: Sequelize.JSON,
      allowNull: true
    },
    tags: {
      type: Sequelize.JSON,
      allowNull: true
    },
    suggestions: {
      type: Sequelize.JSON,
      allowNull: true
    },
    additional_info: {
      type: Sequelize.TEXT('long'),
      allowNull: true
    },
    seo_title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    seo_canonical: {
      type: Sequelize.STRING,
      allowNull: true
    },
    seo_description: {
      type: Sequelize.TEXT('long'),
      allowNull: true
    },
    is_latest: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_trending: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_hide: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return model;
};
