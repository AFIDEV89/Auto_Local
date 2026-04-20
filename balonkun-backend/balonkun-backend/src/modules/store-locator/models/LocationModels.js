"use strict";

const StateModel = (sequelize, DataTypes) => {
  return sequelize.define("state", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false }
  }, { tableName: 'states', timestamps: false });
};

const CityModel = (sequelize, DataTypes) => {
  return sequelize.define("city", {
    CityID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    CityName: { type: DataTypes.STRING(100), allowNull: false },
    StateID: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'cities', timestamps: false });
};

const TimingModel = (sequelize, DataTypes) => {
  return sequelize.define("timing", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    StoreID: { type: DataTypes.INTEGER, allowNull: false },
    Monday: { type: DataTypes.STRING(50) },
    Tuesday: { type: DataTypes.STRING(50) },
    Wednesday: { type: DataTypes.STRING(50) },
    Thursday: { type: DataTypes.STRING(50) },
    Friday: { type: DataTypes.STRING(50) },
    Saturday: { type: DataTypes.STRING(50) },
    Sunday: { type: DataTypes.STRING(50) },
    Closed: { type: DataTypes.STRING(200) }
  }, { tableName: 'timings', timestamps: false });
};

const RatingModel = (sequelize, DataTypes) => {
  return sequelize.define("rating", {
    StoreID: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING(100) },
    mobile: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(255), primaryKey: true },
    rating: { type: DataTypes.INTEGER },
    submitted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'ratings', timestamps: false });
};

export { StateModel, CityModel, TimingModel, RatingModel };
