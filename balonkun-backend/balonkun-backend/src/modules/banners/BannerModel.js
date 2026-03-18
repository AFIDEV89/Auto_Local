"use strict";

/**
 * Adding banner model
 */
export const BannerModel = (sequelize, Sequelize) => {
  const model = sequelize.define("banner", {
    title: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
  });

  return model;
};
