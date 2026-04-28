"use strict";

export const TestimonialModel = (sequelize, Sequelize) => {
  const model = sequelize.define("testimonial", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientName: {
      type: Sequelize.STRING,
      allowNull: false,
      trim: true
    },
    role: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      trim: true
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true
    },
    type: {
      type: Sequelize.ENUM('carOwners', 'franchisePartners'),
      allowNull: false,
      defaultValue: 'carOwners'
    },
    status: {
      type: Sequelize.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
      allowNull: false
    }
  });

  return model;
};
