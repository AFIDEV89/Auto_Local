import db from './src/database/index.js';
import { Op } from 'sequelize';

async function turboSync() {
    console.log("=== TURBO DEEP SYNC (STAGING) ===\n");
    try {
        const brands = await db.brands.findAll({ logging: false });
        
        for (const brand of brands) {
            console.log(`📦 Syncing ${brand.name} (ID: ${brand.id})...`);
            
            // 1. Find all vehicle details for this brand
            const details = await db.vehicleDetails.findAll({ 
                where: { brand_id: brand.id }, 
                attributes: ['id'], 
                raw: true, 
                logging: false 
            });
            const dIds = details.map(d => d.id);

            if (dIds.length > 0) {
                // 2. Update all products for these vehicle details in ONE GO
                const [count] = await db.products.update(
                    { brand_id: brand.id, vehicle_type_id: brand.vehicle_type_id },
                    { where: { vehicle_details_id: { [Op.in]: dIds }, category_id: 10 }, logging: false }
                );
                if (count > 0) console.log(`   ✅ Synchronized ${count} products.`);
            }
        }
        console.log("\n✅ TURBO DEEP SYNC COMPLETE!");
    } catch (e) { console.error(e); }
    process.exit(0);
}
turboSync();
