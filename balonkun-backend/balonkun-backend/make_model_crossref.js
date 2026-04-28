import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

async function crossRef() {
    console.log("=== CROSS-REFERENCING PRODUCTS WITH MAKES/MODELS ===\n");

    try {
        const brands = await db.brands.findAll({ where: { vehicle_type_id: 2 }, order: [['name', 'ASC']], logging: false });
        const allProducts = await db.products.findAll({
            where: { category_id: 10, vehicle_type_id: 2 },
            attributes: ['id', 'name', 'brand_id', 'vehicle_details_id'],
            raw: true,
            logging: false
        });
        const allVDs = await db.vehicleDetails.findAll({ raw: true, logging: false });
        const vdMap = {};
        allVDs.forEach(v => { vdMap[`${v.brand_id}-${v.model_id}`] = v.id; });

        let report = `=== MAKE > MODEL > PRODUCTS CROSS-REFERENCE ===\n`;
        report += `Total 4W Seat Cover Products: ${allProducts.length}\n\n`;

        let totalCorrect = 0;
        let totalWrong = 0;
        let totalNoVD = 0;

        for (const brand of brands) {
            const brandName = brand.name.trim();
            const models = await db.brandModels.findAll({ where: { brand_id: brand.id }, order: [['name', 'ASC']], logging: false });

            // Find ALL products with this brand name in their product name
            const brandProducts = allProducts.filter(p => p.name.toLowerCase().includes(brandName.toLowerCase()));

            if (brandProducts.length === 0 && models.length === 0) continue;

            report += `${'─'.repeat(70)}\n`;
            report += `📦 ${brandName} (ID: ${brand.id}) — ${brandProducts.length} products by name, ${models.length} models\n`;

            // Sort models by name length DESC so longer names match first
            const sortedModels = [...models].sort((a, b) => b.name.trim().length - a.name.trim().length);
            const claimed = new Set(); // track which product IDs are already matched

            for (const model of sortedModels) {
                const modelName = model.name.trim();
                if (modelName.length < 2 || modelName === brandName) continue;

                // Find products whose name contains BOTH brand AND model
                const modelProducts = brandProducts.filter(p => 
                    !claimed.has(p.id) && p.name.toLowerCase().includes(modelName.toLowerCase())
                );

                if (modelProducts.length === 0) {
                    report += `   ├── ${modelName}: 0 products\n`;
                    continue;
                }

                // Mark as claimed
                modelProducts.forEach(p => claimed.add(p.id));

                // Check if they have the correct vehicle_details_id
                const expectedVdId = vdMap[`${brand.id}-${model.id}`];
                
                if (!expectedVdId) {
                    report += `   ├── ${modelName}: ${modelProducts.length} products — ⚠️ NO VEHICLE_DETAILS RECORD\n`;
                    totalNoVD += modelProducts.length;
                    continue;
                }

                const correct = modelProducts.filter(p => p.vehicle_details_id === expectedVdId);
                const wrong = modelProducts.filter(p => p.vehicle_details_id !== expectedVdId);

                if (wrong.length === 0) {
                    report += `   ├── ${modelName}: ${modelProducts.length} products ✅\n`;
                    totalCorrect += modelProducts.length;
                } else {
                    report += `   ├── ${modelName}: ${modelProducts.length} products — ✅ ${correct.length} correct, ❌ ${wrong.length} WRONG VD\n`;
                    wrong.slice(0, 2).forEach(p => {
                        report += `   │      [${p.id}] "${p.name}" → has VD:${p.vehicle_details_id}, should be VD:${expectedVdId}\n`;
                    });
                    if (wrong.length > 2) report += `   │      ... and ${wrong.length - 2} more\n`;
                    totalCorrect += correct.length;
                    totalWrong += wrong.length;
                }
            }

            // Unclaimed products (Generic / brand-only)
            const unclaimed = brandProducts.filter(p => !claimed.has(p.id));
            if (unclaimed.length > 0) {
                report += `   └── (Generic/Unmatched): ${unclaimed.length} products\n`;
                unclaimed.slice(0, 3).forEach(p => {
                    report += `         [${p.id}] "${p.name}"\n`;
                });
                if (unclaimed.length > 3) report += `         ... and ${unclaimed.length - 3} more\n`;
            }

            report += `\n`;
        }

        report += `${'─'.repeat(70)}\n`;
        report += `\n📊 FINAL SUMMARY:\n`;
        report += `   Total 4W Products: ${allProducts.length}\n`;
        report += `   ✅ Correctly linked to VehicleDetails: ${totalCorrect}\n`;
        report += `   ❌ Wrong VehicleDetails link: ${totalWrong}\n`;
        report += `   ⚠️  Missing VehicleDetails record: ${totalNoVD}\n`;

        fs.writeFileSync('make_model_crossref.txt', report);
        console.log(`✅ Cross-reference complete: make_model_crossref.txt`);
        console.log(`   Correct: ${totalCorrect} | Wrong: ${totalWrong} | No VD: ${totalNoVD}`);

    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
crossRef();
