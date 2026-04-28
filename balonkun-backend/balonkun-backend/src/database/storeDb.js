"use strict";
import Sequelize from "sequelize";

/**
 * Isolated Database Connection (Hostinger — credentials via .env)
 */
const storeDbSequelize = new Sequelize(process.env.STORE_DB_NAME, process.env.STORE_DB_USER, process.env.STORE_DB_PASSWORD, {
    host: process.env.STORE_DB_HOST,
    dialect: process.env.STORE_DB_DIALECT || "mysql",
    operatorsAliases: 0,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false, // Turn on for debugging if needed
});

import * as Models from "../models/index.js";
import StoreLocatorModel from "../modules/store-locator/models/StoreLocatorModel.js";
import { CityModel, StateModel, TimingModel, RatingModel } from "../modules/store-locator/models/LocationModels.js";

const storeDb = {
    Sequelize,
    sequelize: storeDbSequelize
};

// Isolated Models
storeDb.franchiseInquiries = Models.FranchiseInquiryModel(storeDbSequelize, Sequelize);
storeDb.testimonials = Models.TestimonialModel(storeDbSequelize, Sequelize);

// Schema-Aligned Store Locator Models (Hostinger DB)
storeDb.stores = StoreLocatorModel(storeDbSequelize, Sequelize.DataTypes);
storeDb.states = StateModel(storeDbSequelize, Sequelize.DataTypes);
storeDb.cities = CityModel(storeDbSequelize, Sequelize.DataTypes);
storeDb.timings = TimingModel(storeDbSequelize, Sequelize.DataTypes);
storeDb.ratings = RatingModel(storeDbSequelize, Sequelize.DataTypes);

// Associations
storeDb.stores.belongsTo(storeDb.cities, { foreignKey: 'CityID', targetKey: 'CityID', as: 'city' });
storeDb.stores.belongsTo(storeDb.states, { foreignKey: 'StateID', targetKey: 'id', as: 'state' });
storeDb.cities.belongsTo(storeDb.states, { foreignKey: 'StateID', targetKey: 'id', as: 'state' });

// Test Connection
storeDbSequelize.authenticate()
    .then(() => {
        console.log("Successfully connected to the isolated Hostinger Store Database.");
        // DO NOT SYNC OR ALTER PRE-EXISTING HOSTINGER TABLES
    })
    .catch((err) => {
        console.error("Unable to connect to the isolated Hostinger Store Database:", err);
    });

export default storeDb;
