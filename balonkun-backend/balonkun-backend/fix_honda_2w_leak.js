import db from './src/database/index.js';
import { Op } from 'sequelize';

async function fixHonda2w() {
    console.log("=== HONDA 2W/4W SEPARATION FIX ===\n");

    try {
        const honda4wId = 10; // HONDA (cars)
        const honda2wId = 37; // honda (bikes)

        // Get all 2W honda models
        const bikeModels = await db.brandModels.findAll({ where: { brand_id: honda2wId }, logging: false });
        console.log(`📡 honda (2W) has ${bikeModels.length} bike models\n`);

        // Get all products currently under HONDA (4W) brand
        const products4w = await db.products.findAll({
            where: { brand_id: honda4wId, category_id: 10 },
            attributes: ['id', 'name', 'vehicle_type_id', 'vehicle_details_id'],
            logging: false
        });

        console.log(`📡 Products currently under HONDA (4W): ${products4w.length}\n`);

        // Check each product: if its name contains a 2W model name, it's a bike product
        let bikeProducts = [];
        let carProducts = [];

        for (const p of products4w) {
            const lowerName = p.name.toLowerCase();
            let isBike = false;

            for (const model of bikeModels) {
                const modelName = model.name.trim().toLowerCase();
                if (modelName.length >= 3 && lowerName.includes(modelName)) {
                    isBike = true;
                    break;
                }
            }

            if (isBike) {
                bikeProducts.push(p);
            } else {
                carProducts.push(p);
            }
        }

        console.log(`🚗 Confirmed CAR products: ${carProducts.length}`);
        console.log(`🏍️ BIKE products incorrectly in 4W: ${bikeProducts.length}`);

        if (bikeProducts.length > 0) {
            console.log(`\n📦 Sample bike products found in 4W HONDA:`);
            bikeProducts.slice(0, 5).forEach(p => console.log(`   - [${p.id}] ${p.name}`));

            // Move bike products to honda (2W)
            const bikeIds = bikeProducts.map(p => p.id);
            const [count] = await db.products.update(
                { brand_id: honda2wId, vehicle_type_id: 1 },
                { where: { id: { [Op.in]: bikeIds } }, logging: false }
            );
            console.log(`\n✅ Moved ${count} bike products to honda (2W)`);

            // Also link them to correct vehicle_details based on their model name
            for (const model of bikeModels) {
                const modelName = model.name.trim();
                if (modelName.length < 3) continue;

                const modelProducts = bikeProducts.filter(p => 
                    p.name.toLowerCase().includes(modelName.toLowerCase())
                );

                if (modelProducts.length > 0) {
                    // Find vehicle_details for this bike model
                    const vd = await db.vehicleDetails.findOne({
                        where: { brand_id: honda2wId, model_id: model.id },
                        logging: false
                    });

                    if (vd) {
                        const mIds = modelProducts.map(p => p.id);
                        await db.products.update(
                            { vehicle_details_id: vd.id },
                            { where: { id: { [Op.in]: mIds } }, logging: false }
                        );
                        console.log(`   ✅ ${modelName}: ${modelProducts.length} products → VD ${vd.id}`);
                    }
                }
            }
        }

        // Final count
        const final4w = await db.products.count({ where: { brand_id: honda4wId, category_id: 10 }, logging: false });
        const final2w = await db.products.count({ where: { brand_id: honda2wId, category_id: 10 }, logging: false });
        console.log(`\n📊 FINAL: HONDA (4W): ${final4w} products | honda (2W): ${final2w} products`);

    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
fixHonda2w();
