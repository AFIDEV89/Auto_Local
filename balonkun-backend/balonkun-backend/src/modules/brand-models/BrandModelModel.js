"use strict";

/**
 * Adding model model
 */
export const BrandModelModel = (sequelize, Sequelize) => {
  const model = sequelize.define("brand_model", {
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    vehicle_type_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
  });

  return model;
};
