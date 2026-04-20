"use strict";

/**
 * Adding vehicle category model
 */
export const VehicleCategoryModel = (sequelize, Sequelize) => {
  const model = sequelize.define("vehicle_categories", {
    name: {
      type: Sequelize.STRING,
    },
  }, {
    freezeTableName: true,
    tableName: 'vehicle_categories'
  });

  return model;
};
