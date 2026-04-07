import Sequelize from "sequelize";
import * as Models from "../models/index.js";
import config from "../../config.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * ZER0-DOWNTIME STAGING TO LIVE SYNC SCRIPT
 * This script pulls new products, categories, variants, etc. from the Staging Database
 * and perfectly Upserts them into the Live Database securely.
 */

const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DIALECT } = config;

// The Staging DB connection (Pulled from .env STAGING_DATABASE_HOST)
const STAGING_HOST = process.env.STAGING_DATABASE_HOST;
if (!STAGING_HOST) {
    console.error("ERROR: STAGING_DATABASE_HOST missing from .env!");
    console.log("Please add your AWS RDS Staging Database Endpoint to your backend .env file.");
    process.exit(1);
}

const stagingDb = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: STAGING_HOST,
    dialect: DATABASE_DIALECT,
    logging: false, // keep terminal clean
});

// The Live DB connection
const liveDb = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
    logging: false,
});

// Initialize Models for Staging
const stgProducts = Models.ProductModel(stagingDb, Sequelize);
const stgCategories = Models.ProductCategoryModel(stagingDb, Sequelize);
const stgVariants = Models.ProductVariantModel(stagingDb, Sequelize);
const stgMinorColors = Models.ProductVariantMinorColorModel(stagingDb, Sequelize);

// Initialize Models for Live
const liveProducts = Models.ProductModel(liveDb, Sequelize);
const liveCategories = Models.ProductCategoryModel(liveDb, Sequelize);
const liveVariants = Models.ProductVariantModel(liveDb, Sequelize);
const liveMinorColors = Models.ProductVariantMinorColorModel(liveDb, Sequelize);

async function syncTable(stgModel, liveModel, tableName) {
    console.log(`\n--- Syncing Table: ${tableName} ---`);
    try {
        const rowsToSync = await stgModel.findAll({ raw: true });
        console.log(`Found ${rowsToSync.length} rows in Staging ${tableName}.`);

        let inserted = 0;
        let updated = 0;

        for (const row of rowsToSync) {
            // Upsert (Update if exists, Insert if new) based on primary key 'id'
            const [model, created] = await liveModel.upsert(row);
            if (created) inserted++;
            else updated++;
        }
        
        console.log(`SUCCESS: Inserted ${inserted} new | Updated ${updated} existing in Live ${tableName}.`);
    } catch (e) {
        console.error(`FAILED syncing ${tableName}:`, e.message);
    }
}

async function runSync() {
    try {
        console.log("Connecting to both databases...");
        await stagingDb.authenticate();
        await liveDb.authenticate();
        console.log("Connected Successfully! Beginning zero-downtime transfer...");

        // Order of sync matters for Foreign Keys! (Parents first, then Children)
        await syncTable(stgCategories, liveCategories, "Categories");
        await syncTable(stgProducts, liveProducts, "Products");
        await syncTable(stgVariants, liveVariants, "Product Variants");
        await syncTable(stgMinorColors, liveMinorColors, "Variant Minor Colors");

        console.log("\n=========================================");
        console.log("SYNC COMPLETE! Live website is now updated with Staging Products.");
        console.log("=========================================\n");
        process.exit(0);

    } catch (error) {
        console.error("FATAL ERROR During Sync:", error);
        process.exit(1);
    }
}

// Execute the sync
runSync();
