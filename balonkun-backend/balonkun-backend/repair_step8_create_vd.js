import db from './src/database/index.js';
import { Op } from 'sequelize';

// Models that need vehicle_details created + products linked
const missingModels = [
    { brandId: 10, modelName: 'WRV', modelId: 247 },
    { brandId: 10, modelName: 'Brio', modelId: 248 },
    { brandId: 10, modelName: 'Accord', modelId: 249 },
    { brandId: 10, modelName: 'CRV', modelId: 274 },
];

async function createAndLink() {
    console.log("=== CREATING MISSING VEHICLE DETAILS + LINKING (STAGING) ===\n");

    try {
        for (const entry of missingModels) {
            // 1. Create the vehicle_details record
            const [vd, created] = await db.vehicleDetails.findOrCreate({
                where: { brand_id: entry.brandId, model_id: entry.modelId },
                defaults: { 
                    brand_id: entry.brandId, 
                    model_id: entry.modelId,
                    vehicle_type_id: 2  // 4W
                },
                logging: false
            });
            
            const status = created ? 'CREATED' : 'EXISTS';
            console.log(`   📦 VehicleDetail for HONDA ${entry.modelName}: ${status} (VD ID: ${vd.id})`);

            // 2. Find products by name and link them
            const products = await db.products.findAll({
                where: {
                    category_id: 10,
                    name: { [Op.like]: `%${entry.modelName}%` },
                    [Op.or]: [
                        { brand_id: entry.brandId },
                        { name: { [Op.like]: '%Honda%' } },
                        { name: { [Op.like]: '%HONDA%' } }
                    ]
                },
                attributes: ['id'],
                logging: false
            });

            const pIds = products.map(p => p.id);
            if (pIds.length > 0) {
                const [count] = await db.products.update(
                    { vehicle_details_id: vd.id, brand_id: entry.brandId, vehicle_type_id: 2 },
                    { where: { id: { [Op.in]: pIds } }, logging: false }
                );
                console.log(`   ✅ Linked ${count} products to VD ${vd.id}`);
            } else {
                console.log(`   ⚠️  No products found for ${entry.modelName}`);
            }
        }

        console.log("\n✅ ALL MISSING MODELS CREATED AND LINKED!");
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
createAndLink();
