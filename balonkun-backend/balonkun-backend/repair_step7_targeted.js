import db from './src/database/index.js';
import { Op } from 'sequelize';

// Direct mapping from audit results: product name pattern → vehicle_details_id + brand_id
const mappings = [
    // HONDA (Brand ID 10)
    { brandId: 10, modelName: 'CIVIC', vdId: 58 },
    { brandId: 10, modelName: 'City', vdId: 234 },
    { brandId: 10, modelName: 'Amaze', vdId: null },   // Will find VD
    { brandId: 10, modelName: 'WRV', vdId: null },
    { brandId: 10, modelName: 'Brio', vdId: null },
    { brandId: 10, modelName: 'Accord', vdId: null },
    { brandId: 10, modelName: 'CRV', vdId: null },

    // CHEVROLET (Brand ID 24)
    { brandId: 24, modelName: 'OPTRA', vdId: 205 },
    { brandId: 24, modelName: 'AVEO', vdId: 207 },
    { brandId: 24, modelName: 'CRUZE', vdId: 208 },
    { brandId: 24, modelName: 'SAIL', vdId: 209 },
    { brandId: 24, modelName: 'Beat', vdId: 213 },
    { brandId: 24, modelName: 'SPARK', vdId: 214 },
];

async function targetedRepair() {
    console.log("=== TARGETED BRAND+MODEL REPAIR (STAGING) ===\n");

    try {
        const brands = await db.brands.findAll({ logging: false });
        const brandMap = {};
        brands.forEach(b => { brandMap[b.id] = b; });

        for (const mapping of mappings) {
            const brand = brandMap[mapping.brandId];
            const brandName = brand.name.trim();

            // Find VD if not provided
            let vdId = mapping.vdId;
            if (!vdId) {
                const model = await db.brandModels.findOne({ 
                    where: { brand_id: mapping.brandId, name: { [Op.like]: `%${mapping.modelName}%` } },
                    logging: false
                });
                if (model) {
                    const vd = await db.vehicleDetails.findOne({
                        where: { brand_id: mapping.brandId, model_id: model.id },
                        logging: false
                    });
                    if (vd) {
                        vdId = vd.id;
                    } else {
                        console.log(`   ⚠️  No VehicleDetails for ${brandName} ${mapping.modelName} — skipping`);
                        continue;
                    }
                } else {
                    console.log(`   ⚠️  No Model found for ${brandName} ${mapping.modelName} — skipping`);
                    continue;
                }
            }

            // Find products by name containing BOTH brand AND model
            const namePattern = `%${mapping.modelName}%`;
            const products = await db.products.findAll({
                where: {
                    category_id: 10,
                    name: { [Op.like]: namePattern },
                    [Op.or]: [
                        { brand_id: mapping.brandId },
                        { name: { [Op.like]: `%${brandName}%` } }
                    ]
                },
                attributes: ['id'],
                logging: false
            });

            const pIds = products.map(p => p.id);
            if (pIds.length > 0) {
                const [count] = await db.products.update(
                    { 
                        vehicle_details_id: vdId,
                        brand_id: mapping.brandId,
                        vehicle_type_id: brand.vehicle_type_id
                    },
                    { where: { id: { [Op.in]: pIds } }, logging: false }
                );
                console.log(`   ✅ ${brandName} ${mapping.modelName}: Linked ${count} products → VD ${vdId}`);
            } else {
                console.log(`   ⚠️  ${brandName} ${mapping.modelName}: No products found by name`);
            }
        }

        console.log("\n✅ TARGETED REPAIR COMPLETE!");
    } catch (e) {
        console.error("Repair Error:", e);
    }
    process.exit(0);
}
targetedRepair();
