import db from './src/database/index.js';
import { Op } from 'sequelize';

async function deepSync() {
    console.log("=== HONDA DEEP SYNC (STAGING) ===\n");

    try {
        // 1. First, make sure vehicleDetails brand_id is synced with its Model's brand_id
        console.log("📡 Syncing VehicleDetails with their Models...");
        const allDetails = await db.vehicleDetails.findAll({
            include: [{ model: db.brandModels }],
            logging: false
        });

        for (const detail of allDetails) {
            if (detail.brandModel && detail.brand_id !== detail.brandModel.brand_id) {
                await detail.update({ brand_id: detail.brandModel.brand_id }, { logging: false });
            }
        }

        // 2. Now sync Products with their linked VehicleDetails
        console.log("📡 Syncing Products with their parent Brands and Sections...");
        const products = await db.products.findAll({
            where: { category_id: 10 },
            include: [{ model: db.vehicleDetails, include: [{ model: db.brands }] }],
            logging: false
        });

        let updated = 0;
        for (const p of products) {
            if (p.vehicle_detail && p.vehicle_detail.brand) {
                const correctBrandId = p.vehicle_detail.brand_id;
                const correctType = p.vehicle_detail.brand.vehicle_type_id;

                if (p.brand_id !== correctBrandId || p.vehicle_type_id !== correctType) {
                    await p.update({
                        brand_id: correctBrandId,
                        vehicle_type_id: correctType
                    }, { logging: false });
                    updated++;
                }
            }
        }

        console.log(`\n✅ DEEP SYNC COMPLETE! Synchronized ${updated} products.`);

    } catch (err) {
        console.error("❌ Deep Sync Error:", err);
    }
    process.exit(0);
}
deepSync();
