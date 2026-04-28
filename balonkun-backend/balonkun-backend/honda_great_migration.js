import db from './src/database/index.js';
import { Op } from 'sequelize';

async function migrate() {
    console.log("=== THE GREAT HONDA MIGRATION (STAGING) ===\n");

    try {
        const sequelize = db; // db IS the sequelize instance
        if (!sequelize || typeof sequelize.query !== 'function') {
             throw new Error("Could not find sequelize query function in db export.");
        }

        // 1. PHASE 1: Schema Change (Case Sensitivity)
        console.log("📡 Phase 1: Making brands.name case-sensitive...");
        await sequelize.query('ALTER TABLE brands MODIFY name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL');
        
        // 2. PHASE 2: Clean Rename
        console.log("📡 Phase 2: Restoring clean names (HONDA vs honda)...");
        await db.brands.update({ name: 'HONDA', vehicle_type_id: 2 }, { where: { id: 10 }, logging: false });
        await db.brands.update({ name: 'honda', vehicle_type_id: 1 }, { where: { id: 37 }, logging: false });

        // 3. PHASE 3: The Model Migration
        console.log("📡 Phase 3: Migrating models to correct brands...");
        // A. Move all models with "City", "Amaze", "Civic", "Elevate", "WRV", "Brio", "Accord", "CRV" to ID 10 (4W)
        const carKeywords = ['city', 'amaze', 'civic', 'elevate', 'wrv', 'brio', 'accord', 'crv', 'jazz'];
        const allHondaModels = await db.brandModels.findAll({ 
            where: { brand_id: [10, 37] },
            logging: false 
        });

        let carsMoved = 0;
        let bikesMoved = 0;

        for (const model of allHondaModels) {
            const lowerModel = model.name.toLowerCase();
            const isCar = carKeywords.some(keyword => lowerModel.includes(keyword));
            const isHondaBrand = lowerModel === 'honda'; // Catch-all for generic Honda model

            if (isCar || (isHondaBrand && model.id === 742)) {
                if (model.brand_id !== 10) {
                    await model.update({ brand_id: 10, vehicle_type_id: 2 }, { logging: false });
                    carsMoved++;
                } else if (model.vehicle_type_id !== 2) {
                    await model.update({ vehicle_type_id: 2 }, { logging: false });
                }
            } else {
                // Must be a bike
                if (model.brand_id !== 37) {
                    await model.update({ brand_id: 37, vehicle_type_id: 1 }, { logging: false });
                    bikesMoved++;
                } else if (model.vehicle_type_id !== 1) {
                    await model.update({ vehicle_type_id: 1 }, { logging: false });
                }
            }
        }
        console.log(`   ✅ Moved ${carsMoved} cars to HONDA (4W) and ${bikesMoved} bikes to honda (2W).`);

        // 4. PHASE 4: Product Re-Sync
        console.log("📡 Phase 4: Re-syncing product IDs and types...");
        // Update all products linked to newly cleaned brands
        const [p4w] = await db.products.update({ vehicle_type_id: 2 }, { where: { brand_id: 10, category_id: 10 }, logging: false });
        const [p2w] = await db.products.update({ vehicle_type_id: 1 }, { where: { brand_id: 37, category_id: 10 }, logging: false });
        
        // Also re-sync via VehicleDetails
        const details4w = await db.vehicleDetails.findAll({ where: { brand_id: 10 }, attributes: ['id'], raw: true, logging: false });
        const [vd4w] = await db.products.update({ vehicle_type_id: 2 }, { where: { vehicle_details_id: { [Op.in]: details4w.map(d => d.id) } }, logging: false });

        const details2w = await db.vehicleDetails.findAll({ where: { brand_id: 37 }, attributes: ['id'], raw: true, logging: false });
        const [vd2w] = await db.products.update({ vehicle_type_id: 1 }, { where: { vehicle_details_id: { [Op.in]: details2w.map(d => d.id) } }, logging: false });

        console.log(`   ✅ Synchronized ${p4w + vd4w} 4W products and ${p2w + vd2w} 2W products.`);

        console.log("\n🚀 THE GREAT HONDA MIGRATION COMPLETE!");

    } catch (err) {
        console.error("❌ Migration Error:", err);
    }
    process.exit(0);
}
migrate();
