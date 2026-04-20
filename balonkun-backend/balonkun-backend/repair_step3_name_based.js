import db from './src/database/index.js';
import { Op } from 'sequelize';

async function finalSweep() {
    console.log("=== PHASE 4: FINAL STRING-BASED SWEEP (STAGING) ===\n");

    try {
        const subcats = await db.subcategories.findAll({ where: { category_id: 10 }, logging: false });
        const products = await db.products.findAll({ 
            where: { category_id: 10, subcategory_id: null },
            logging: false 
        });

        console.log(`📡 Analyzing ${products.length} remaining products...\n`);

        let updatedCount = 0;
        for (const product of products) {
            const lowerName = product.name.toLowerCase();
            let updateData = {};

            // 1. Find Subcategory Match (e.g., "u-impress" match)
            const matchedSub = subcats.find(s => lowerName.includes(s.name.toLowerCase().trim()));
            if (matchedSub) {
                updateData.subcategory_id = matchedSub.id;
            }

            // 2. Resolve Vehicle Type (If unknown or 0)
            if (!product.vehicle_type_id || product.vehicle_type_id === 0) {
                // Heuristic: Check for common bike keywords
                const bikeKeywords = ['bike', 'scooter', 'royal enfield', 'bajaj', 'tvs', 'honda scooty', 'activa', 'hero honda', 'yamaha', 'ktm', 'bullet'];
                const isBike = bikeKeywords.some(key => lowerName.includes(key));
                updateData.vehicle_type_id = isBike ? 1 : 2; // 2 = 4W
            }

            // 3. Apply Update
            if (Object.keys(updateData).length > 0) {
                // Safety: Maruti Hiding
                if (lowerName.includes('maruti')) {
                    updateData.is_hide = true;
                }
                
                await product.update(updateData, { logging: false });
                updatedCount++;
                if (updatedCount % 50 === 0) console.log(`   - Processed ${updatedCount} products...`);
            }
        }

        console.log(`\n✅ FINAL SWEEP COMPLETE! Corrected ${updatedCount} products.`);

    } catch (err) {
        console.error("❌ Sweep Error:", err);
    }
    process.exit(0);
}
finalSweep();
