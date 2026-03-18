"use strict";

/**
 * Adding vehicle type model
 */
export const VehicleTypeModel = (sequelize, Sequelize) => {
  const model = sequelize.define("vehicle_type", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return model;
};
