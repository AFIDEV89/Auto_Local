import db from './src/database/index.js';
import { Op } from 'sequelize';

// Mapping from Design ID to Subcategory ID (Generated from Step 1)
const designToSubId = {
  "1": 32, "2": 31, "3": 35, "4": 36, "6": 37, "7": 38, "9": 33, "10": 34,
  "11": 52, "12": 56, "13": 58, "15": 39, "16": 51, "24": 41, "26": 63,
  "35": 49, "54": 42, "55": 61, "56": 62, "57": 47, "58": 48, "59": 57,
  "60": 40, "61": 46, "63": 59, "64": 60, "76": 45, "77": 55, "78": 53,
  "79": 43, "81": 44, "82": 54, "83": 50
};

async function repair() {
    console.log("=== PHASE 2: BULK DATA REPAIR (STAGING) ===\n");

    try {
        const products = await db.products.findAll({
            where: { category_id: 10 },
            include: [
                { model: db.productVariants },
                { model: db.vehicleDetails, include: [{ model: db.brands }] },
                { model: db.brands }
            ]
        });

        console.log(`📡 Processing ${products.length} products...\n`);

        let updatedCount = 0;
        for (const product of products) {
            let updateData = {};
            
            // 1. Map Subcategory via Designs
            // We'll look for variant with design_id
            const designId = product.product_variants && product.product_variants.length > 0 
                ? product.product_variants.find(v => v.design_id)?.design_id 
                : null;
            
            if (designId && designToSubId[designId]) {
                updateData.subcategory_id = designToSubId[designId];
            }

            // 2. Resolve Vehicle Type via Brand
            let brandType = null;
            if (product.vehicle_detail && product.vehicle_detail.brand) {
                brandType = product.vehicle_detail.brand.vehicle_type_id;
            } else if (product.brand) {
                brandType = product.brand.vehicle_type_id;
            }

            if (brandType) {
                updateData.vehicle_type_id = brandType;
            }

            // 3. Apply updates if changes found
            if (Object.keys(updateData).length > 0) {
                // Safety: Ensure Maruti products stay hidden as per legal requirement
                if (product.name && product.name.toLowerCase().includes('maruti')) {
                    updateData.is_hide = true;
                }

                await product.update(updateData);
                updatedCount++;
                if (updatedCount % 500 === 0) console.log(`   - Processed ${updatedCount} products...`);
            }
        }

        console.log(`\n✅ REPAIR COMPLETE! Updated ${updatedCount} products.`);

    } catch (err) {
        console.error("❌ Repair Error:", err);
    }
    process.exit(0);
}
repair();
