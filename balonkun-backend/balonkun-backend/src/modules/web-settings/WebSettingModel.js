"use strict";

/**
 * Web setting model
 */
export const WebSettingModel = (sequelize, Sequelize) => {
  const model = sequelize.define("web_setting", {
    banners_limit: {
      type: Sequelize.INTEGER,
      defaultValue: 5,
    },
    dashboard_products_limit: {
      type: Sequelize.INTEGER,
      defaultValue: 10,
    },
  });

  return model;
};
