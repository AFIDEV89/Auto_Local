"use strict";

export default (sequelize, DataTypes) => {
  const model = sequelize.define("store_locator", {
    StoreID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    StoreName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    StoreAdd: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    StoreLoc: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "lat,long string"
    },
    CityID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StateID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'autoform',
    timestamps: false,
  });

  return model;
};
