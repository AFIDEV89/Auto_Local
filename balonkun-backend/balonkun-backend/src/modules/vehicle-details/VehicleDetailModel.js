"use strict";

/**
 * Adding vehicle details model
 */
export const VehicleDetailsModel = (sequelize, Sequelize) => {
  const model = sequelize.define("vehicle_details", {
    vehicle_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    model_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    vehicle_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    model_variant: {
      type: Sequelize.STRING,
      allowNull: true
    },
    month: {
      type: Sequelize.STRING,
      allowNull: true
    },
    year: {
      type: Sequelize.STRING,
      allowNull: true
    },
  }, {
    freezeTableName: true,
    tableName: 'vehicle_details'
  });

  return model;
};
