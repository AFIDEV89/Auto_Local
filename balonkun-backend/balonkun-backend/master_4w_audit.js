import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

async function masterAudit() {
    console.log("=== MASTER 4W HIERARCHY AUDIT ===\n");

    try {
        // Step 1: Get ALL brands and ALL their models
        const allBrands = await db.brands.findAll({ logging: false });
        const allModels = await db.brandModels.findAll({ logging: false });
        const allProducts = await db.products.findAll({
            where: { category_id: 10 },
            attributes: ['id', 'name', 'brand_id', 'vehicle_type_id', 'vehicle_details_id'],
            raw: true,
            logging: false
        });
        const allVehicleDetails = await db.vehicleDetails.findAll({
            attributes: ['id', 'brand_id', 'model_id'],
            raw: true,
            logging: false
        });

        let report = `=== MASTER 4W BRAND > MODEL > PRODUCT AUDIT ===\n`;
        report += `Total Brands: ${allBrands.length}\n`;
        report += `Total Models (brandModels table): ${allModels.length}\n`;
        report += `Total Seat Cover Products (Cat 10): ${allProducts.length}\n`;
        report += `Total Vehicle Details: ${allVehicleDetails.length}\n\n`;

        // Step 2: Group models by brand
        report += `${'='.repeat(70)}\n`;
        report += `SECTION A: BRANDS AND THEIR MODELS\n`;
        report += `${'='.repeat(70)}\n\n`;

        const brands4w = allBrands.filter(b => b.vehicle_type_id === 2);
        
        for (const brand of brands4w) {
            const brandModels = allModels.filter(m => m.brand_id === brand.id);
            report += `📦 ${brand.name} (ID: ${brand.id}, Type: 4W) — ${brandModels.length} models\n`;
            
            if (brandModels.length > 0) {
                for (const m of brandModels) {
                    report += `   └── [${m.id}] ${m.name} (type: ${m.vehicle_type_id})\n`;
                }
            } else {
                report += `   ⚠️  NO MODELS FOUND!\n`;
            }
            report += `\n`;
        }

        // Step 3: Name-based matching
        report += `\n${'='.repeat(70)}\n`;
        report += `SECTION B: PRODUCT NAME → BRAND+MODEL MATCHING\n`;
        report += `${'='.repeat(70)}\n\n`;

        let totalNeedMapping = 0;

        for (const brand of brands4w) {
            const brandName = brand.name.trim().toLowerCase();
            const brandProducts = allProducts.filter(p => p.name.toLowerCase().includes(brandName));
            
            if (brandProducts.length === 0) continue;

            report += `\n📦 ${brand.name} (${brandProducts.length} products by name)\n`;

            // Get models for this brand
            const brandModels = allModels.filter(m => m.brand_id === brand.id);

            // For each model, find matching products
            const modelMatches = {};
            const unmatchedProducts = [...brandProducts];

            for (const model of brandModels) {
                const modelName = model.name.trim().toLowerCase();
                if (modelName.length < 2) continue;

                const matched = unmatchedProducts.filter(p => 
                    p.name.toLowerCase().includes(modelName)
                );

                if (matched.length > 0) {
                    modelMatches[model.name] = {
                        modelId: model.id,
                        count: matched.length,
                        hasVehicleDetails: false,
                        sampleProducts: matched.slice(0, 2).map(p => p.name)
                    };

                    // Check if vehicle_details exists for this brand+model
                    const vd = allVehicleDetails.find(v => v.brand_id === brand.id && v.model_id === model.id);
                    if (vd) {
                        modelMatches[model.name].hasVehicleDetails = true;
                        modelMatches[model.name].vdId = vd.id;
                        
                        // How many products already point to this vd?
                        const linkedCount = matched.filter(p => p.vehicle_details_id === vd.id).length;
                        modelMatches[model.name].alreadyLinked = linkedCount;
                        modelMatches[model.name].needsLinking = matched.length - linkedCount;
                        totalNeedMapping += matched.length - linkedCount;
                    } else {
                        modelMatches[model.name].needsLinking = matched.length;
                        totalNeedMapping += matched.length;
                    }

                    // Remove matched from unmatched list
                    matched.forEach(m => {
                        const idx = unmatchedProducts.indexOf(m);
                        if (idx > -1) unmatchedProducts.splice(idx, 1);
                    });
                }
            }

            for (const [modelName, info] of Object.entries(modelMatches)) {
                const status = info.needsLinking > 0 ? '❌' : '✅';
                report += `   ${status} Model "${modelName}" [ID:${info.modelId}]: ${info.count} products`;
                if (info.hasVehicleDetails) {
                    report += ` (VD: ${info.vdId}, Linked: ${info.alreadyLinked}, Needs: ${info.needsLinking})`;
                } else {
                    report += ` (⚠️ NO vehicle_details record!)`;
                }
                report += `\n`;
            }

            if (unmatchedProducts.length > 0) {
                report += `   🟡 ${unmatchedProducts.length} products don't match any model (Generic/Make-only)\n`;
                unmatchedProducts.slice(0, 3).forEach(p => 
                    report += `      → [${p.id}] ${p.name}\n`
                );
            }
        }

        report += `\n${'='.repeat(70)}\n`;
        report += `SUMMARY:\n`;
        report += `   Total products needing vehicle_details mapping: ${totalNeedMapping}\n`;
        report += `${'='.repeat(70)}\n`;

        fs.writeFileSync('master_4w_audit.txt', report);
        console.log("✅ Master audit written to: master_4w_audit.txt");

    } catch (e) {
        console.error("Audit Error:", e);
    }
    process.exit(0);
}
masterAudit();
