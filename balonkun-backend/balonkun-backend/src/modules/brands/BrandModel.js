"use strict";

/**
 * Adding brand model
 */
export const BrandModel = (sequelize, Sequelize) => {
  const model = sequelize.define("brand", {
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
