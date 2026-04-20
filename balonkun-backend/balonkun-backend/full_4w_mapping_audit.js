import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

async function fullAudit() {
    console.log("=== FULL 4W PRODUCT-TO-MODEL MAPPING AUDIT ===\n");

    try {
        // 1. Get ALL 4W brands
        const brands4w = await db.brands.findAll({ 
            where: { vehicle_type_id: 2 }, 
            include: [{ model: db.brandModels }],
            logging: false 
        });

        // 2. Get ALL Seat Cover products (Category 10) with vehicle_type_id = 2 OR brand linked to 4W
        const allProducts = await db.products.findAll({
            where: { category_id: 10 },
            attributes: ['id', 'name', 'brand_id', 'vehicle_type_id', 'vehicle_details_id'],
            logging: false
        });

        let report = `=== FULL 4W SEAT COVER MAPPING AUDIT ===\n`;
        report += `Total Seat Cover Products: ${allProducts.length}\n\n`;

        let totalMapped = 0;
        let totalUnmapped = 0;
        let totalWrongBrand = 0;

        for (const brand of brands4w) {
            const brandName = brand.name.trim();
            const models = brand.brandModels || [];

            // Find products whose NAME contains this brand
            const brandProducts = allProducts.filter(p => 
                p.name.toLowerCase().includes(brandName.toLowerCase())
            );

            report += `\n${'='.repeat(60)}\n`;
            report += `📦 BRAND: ${brandName} (ID: ${brand.id}) — ${models.length} models in DB\n`;
            report += `   Products mentioning "${brandName}" in name: ${brandProducts.length}\n`;

            // Products that have correct brand_id
            const correctlyLinked = brandProducts.filter(p => p.brand_id === brand.id);
            const wronglyLinked = brandProducts.filter(p => p.brand_id !== brand.id);

            report += `   ✅ Correctly linked (brand_id=${brand.id}): ${correctlyLinked.length}\n`;
            if (wronglyLinked.length > 0) {
                report += `   ❌ Wrong brand_id: ${wronglyLinked.length}\n`;
                totalWrongBrand += wronglyLinked.length;
            }

            // Now check each model
            for (const model of models) {
                const modelName = model.name.trim();
                if (!modelName || modelName.length < 2) continue;

                // Find products whose name contains BOTH brand AND model
                const modelProducts = brandProducts.filter(p => 
                    p.name.toLowerCase().includes(modelName.toLowerCase())
                );

                // Check how many have the correct vehicle_details_id
                const vehicleDetails = await db.vehicleDetails.findAll({
                    where: { brand_id: brand.id, model_id: model.id },
                    attributes: ['id'],
                    logging: false
                });
                const vdIds = vehicleDetails.map(v => v.id);

                const properlyMapped = modelProducts.filter(p => vdIds.includes(p.vehicle_details_id));
                const notMapped = modelProducts.filter(p => !vdIds.includes(p.vehicle_details_id));

                if (modelProducts.length > 0) {
                    totalMapped += properlyMapped.length;
                    totalUnmapped += notMapped.length;

                    if (notMapped.length > 0) {
                        report += `   🔸 Model "${modelName}": ${modelProducts.length} products found, ${properlyMapped.length} mapped, ${notMapped.length} UNMAPPED\n`;
                    }
                }
            }

            // Find brand products that don't match ANY model (Generic / Make-only)
            const genericProducts = brandProducts.filter(p => {
                const lowerName = p.name.toLowerCase();
                return !models.some(m => lowerName.includes(m.name.trim().toLowerCase()));
            });
            if (genericProducts.length > 0) {
                report += `   🟡 Generic (no model match): ${genericProducts.length}\n`;
                if (genericProducts.length <= 3) {
                    genericProducts.forEach(g => report += `      → ${g.name}\n`);
                }
            }
        }

        // Products that don't match ANY 4W brand at all
        const allBrandNames = brands4w.map(b => b.name.trim().toLowerCase());
        const orphanProducts = allProducts.filter(p => {
            const lowerName = p.name.toLowerCase();
            return !allBrandNames.some(bn => lowerName.includes(bn));
        });

        report += `\n${'='.repeat(60)}\n`;
        report += `\n📊 SUMMARY:\n`;
        report += `   Total Products with correct vehicle_details: ${totalMapped}\n`;
        report += `   Total Products UNMAPPED (name has brand+model but no link): ${totalUnmapped}\n`;
        report += `   Total Products with WRONG brand_id: ${totalWrongBrand}\n`;
        report += `   Products not matching ANY 4W brand by name: ${orphanProducts.length}\n`;

        if (orphanProducts.length > 0 && orphanProducts.length <= 30) {
            report += `\n   🔴 ORPHAN SAMPLES:\n`;
            orphanProducts.slice(0, 30).forEach(o => report += `      [ID: ${o.id}] ${o.name}\n`);
        }

        fs.writeFileSync('full_4w_mapping_audit.txt', report);
        console.log("✅ Full audit written to: full_4w_mapping_audit.txt");

    } catch (e) {
        console.error("Audit Error:", e);
    }
    process.exit(0);
}
fullAudit();
