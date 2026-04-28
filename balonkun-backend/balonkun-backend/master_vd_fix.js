import db from './src/database/index.js';
import { Op } from 'sequelize';

async function masterFix() {
    console.log("=== MASTER VEHICLE_DETAILS FIX (STAGING) ===\n");

    try {
        // Get all 4W brands
        const brands = await db.brands.findAll({ where: { vehicle_type_id: 2 }, logging: false });
        
        // Get all seat cover products
        const allProducts = await db.products.findAll({
            where: { category_id: 10 },
            attributes: ['id', 'name', 'brand_id', 'vehicle_details_id', 'vehicle_type_id'],
            logging: false
        });

        // Get all vehicle details
        const allVDs = await db.vehicleDetails.findAll({ raw: true, logging: false });

        let totalFixed = 0;

        for (const brand of brands) {
            const brandName = brand.name.trim();
            const models = await db.brandModels.findAll({ where: { brand_id: brand.id }, logging: false });

            // Sort models by name length DESC (longer names first to avoid partial matches)
            models.sort((a, b) => b.name.trim().length - a.name.trim().length);

            for (const model of models) {
                const modelName = model.name.trim();
                if (modelName.length < 2 || modelName === brandName) continue;

                // Find ALL vehicle_details for this brand+model
                const vds = allVDs.filter(v => v.brand_id === brand.id && v.model_id === model.id);
                if (vds.length === 0) continue;

                // Use the LATEST vehicle_details (highest ID = most recent)
                const correctVD = vds.sort((a, b) => b.id - a.id)[0];

                // Find products by name containing BOTH brand AND model
                const matchingProducts = allProducts.filter(p => {
                    const lowerName = p.name.toLowerCase();
                    return lowerName.includes(brandName.toLowerCase()) && 
                           lowerName.includes(modelName.toLowerCase());
                });

                // Filter to only those with WRONG vehicle_details_id
                const wrongProducts = matchingProducts.filter(p => p.vehicle_details_id !== correctVD.id);

                if (wrongProducts.length > 0) {
                    const pIds = wrongProducts.map(p => p.id);
                    const [count] = await db.products.update(
                        { 
                            vehicle_details_id: correctVD.id,
                            brand_id: brand.id,
                            vehicle_type_id: 2
                        },
                        { where: { id: { [Op.in]: pIds } }, logging: false }
                    );
                    totalFixed += count;
                    console.log(`   ✅ ${brandName} ${modelName}: Fixed ${count} products → VD ${correctVD.id}`);
                }
            }
        }

        console.log(`\n🚀 MASTER FIX COMPLETE! Total products fixed: ${totalFixed}`);

    } catch (e) {
        console.error("Fix Error:", e);
    }
    process.exit(0);
}
masterFix();
