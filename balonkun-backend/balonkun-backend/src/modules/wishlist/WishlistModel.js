"use strict";

/**
 * Adding product wishlist model
 */
export const WishlistModel = (sequelize, Sequelize) => {
  const model = sequelize.define("wishlist", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return model;
};
