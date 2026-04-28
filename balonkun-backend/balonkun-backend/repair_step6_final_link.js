import db from './src/database/index.js';
import { Op } from 'sequelize';

async function finalLink() {
    console.log("=== FINAL HONDA RE-ASSIGNMENT (STAGING) ===\n");
    try {
        // 1. Move all VehicleDetails that belong to Car Models into Brand 10 (HONDA 4W)
        const carModels = await db.brandModels.findAll({ 
            where: { brand_id: 10 }, 
            attributes: ['id'], 
            logging: false 
        });
        const mIds = carModels.map(m => m.id);

        if (mIds.length > 0) {
            const [vCount] = await db.vehicleDetails.update(
                { brand_id: 10, vehicle_type_id: 2 },
                { where: { model_id: { [Op.in]: mIds } }, logging: false }
            );
            console.log(`✅ Moved ${vCount} Vehicle Details to HONDA (4W).`);

            // 2. Now sync all products that point to these vehicle details
            const details = await db.vehicleDetails.findAll({ 
                where: { brand_id: 10 }, 
                attributes: ['id'], 
                logging: false 
            });
            const dIds = details.map(d => d.id);

            const [pCount] = await db.products.update(
                { brand_id: 10, vehicle_type_id: 2 },
                { where: { vehicle_details_id: { [Op.in]: dIds }, category_id: 10 }, logging: false }
            );
            console.log(`✅ Restored ${pCount} Honda Car products to the 4W section.`);
        }
        
        // 3. Similarly for Bikes (honda - ID 37)
        const bikeModels = await db.brandModels.findAll({ 
            where: { brand_id: 37 }, 
            attributes: ['id'], 
            logging: false 
        });
        const bIds = bikeModels.map(m => m.id);
        if (bIds.length > 0) {
            await db.vehicleDetails.update(
                { brand_id: 37, vehicle_type_id: 1 },
                { where: { model_id: { [Op.in]: bIds } }, logging: false }
            );
            
            const bDetails = await db.vehicleDetails.findAll({ where: { brand_id: 37 }, attributes: ['id'], logging: false });
            const bdIds = bDetails.map(d => d.id);
            const [bpCount] = await db.products.update(
                { brand_id: 37, vehicle_type_id: 1 },
                { where: { vehicle_details_id: { [Op.in]: bdIds }, category_id: 10 }, logging: false }
            );
            console.log(`✅ Cleaned up ${bpCount} Honda Bike products to the 2W section.`);
        }

        console.log("\n✅ ALL HONDA PRODUCTS ARE NOW IN THEIR CORRECT HOMES!");
    } catch (e) { console.error(e); }
    process.exit(0);
}
finalLink();
