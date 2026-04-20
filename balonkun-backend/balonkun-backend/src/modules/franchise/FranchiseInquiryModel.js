"use strict";

/**
 * Franchise Inquiry Model for the isolated Hostinger DB
 */
export const FranchiseInquiryModel = (sequelize, Sequelize) => {
  const model = sequelize.define("franchise_inquiry", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contact_person_name: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true
    },
    mobile_number: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true
    },
    store_name: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true
    },
    store_area: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true
    },
    status: {
      type: Sequelize.ENUM('New', 'Contacted'),
      defaultValue: 'New',
      allowNull: false
    }
  });

  return model;
};
