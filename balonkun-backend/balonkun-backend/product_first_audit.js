import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

async function productFirstAudit() {
    console.log("=== PRODUCT-FIRST 4W SEAT COVER AUDIT ===\n");

    try {
        // 1. Get ALL seat cover products (Cat 10) that are 4W
        const products = await db.products.findAll({
            where: { category_id: 10, vehicle_type_id: 2 },
            attributes: ['id', 'name', 'brand_id', 'vehicle_details_id', 'vehicle_type_id'],
            raw: true,
            logging: false
        });

        // 2. Get ALL 4W brands for reference
        const brands = await db.brands.findAll({ where: { vehicle_type_id: 2 }, logging: false });
        const brandMap = {};
        brands.forEach(b => { brandMap[b.id] = b.name.trim(); });

        // 3. Get ALL brand models for reference
        const models = await db.brandModels.findAll({ logging: false });
        const modelsByBrand = {};
        models.forEach(m => {
            if (!modelsByBrand[m.brand_id]) modelsByBrand[m.brand_id] = [];
            modelsByBrand[m.brand_id].push({ id: m.id, name: m.name.trim() });
        });

        // 4. Get ALL vehicle details for reference
        const vds = await db.vehicleDetails.findAll({ raw: true, logging: false });
        const vdMap = {};
        vds.forEach(v => { vdMap[v.id] = v; });

        let report = `=== PRODUCT-FIRST 4W SEAT COVER AUDIT ===\n`;
        report += `Total 4W Seat Cover Products: ${products.length}\n\n`;

        // 5. For each product, extract Make + Model from name
        // Product names follow: "BrandName ModelName DesignName Artificial Leather Seat Covers (Color)"
        // Example: "Hyundai SANTRO U-IMPRESS Artificial Leather Seat Covers (Black/Silver)"

        const productsByBrand = {};

        for (const p of products) {
            const name = p.name;
            
            // Try to find which brand this product belongs to by NAME
            let matchedBrand = null;
            let matchedBrandId = null;
            for (const b of brands) {
                if (name.toLowerCase().includes(b.name.trim().toLowerCase())) {
                    matchedBrand = b.name.trim();
                    matchedBrandId = b.id;
                    break;
                }
            }

            if (!matchedBrand) {
                matchedBrand = 'UNKNOWN';
                matchedBrandId = 0;
            }

            if (!productsByBrand[matchedBrand]) {
                productsByBrand[matchedBrand] = { brandId: matchedBrandId, products: [] };
            }

            // Try to find which model from name
            let matchedModel = 'Generic';
            let matchedModelId = null;
            const brandModels = modelsByBrand[matchedBrandId] || [];
            
            // Sort models by name length descending so longer names match first
            // (e.g., "I-10 NIOS" before "I-10")
            const sortedModels = [...brandModels].sort((a, b) => b.name.length - a.name.length);
            
            for (const m of sortedModels) {
                if (m.name.length >= 2 && name.toLowerCase().includes(m.name.toLowerCase())) {
                    matchedModel = m.name;
                    matchedModelId = m.id;
                    break;
                }
            }

            // Check if current DB link matches
            const dbBrand = brandMap[p.brand_id] || 'NULL';
            const dbVD = vdMap[p.vehicle_details_id];
            let dbModel = 'NULL';
            if (dbVD) {
                const mod = models.find(m => m.id === dbVD.model_id);
                dbModel = mod ? mod.name.trim() : 'NULL';
            }

            const brandMatch = p.brand_id === matchedBrandId;
            const modelMatch = dbModel.toLowerCase() === matchedModel.toLowerCase();

            productsByBrand[matchedBrand].products.push({
                id: p.id,
                name: name,
                nameModel: matchedModel,
                nameModelId: matchedModelId,
                dbBrandId: p.brand_id,
                dbBrand: dbBrand,
                dbModel: dbModel,
                dbVdId: p.vehicle_details_id,
                brandOK: brandMatch,
                modelOK: modelMatch
            });
        }

        // 6. Generate report grouped by brand
        for (const [brandName, data] of Object.entries(productsByBrand).sort((a, b) => b[1].products.length - a[1].products.length)) {
            const prods = data.products;
            const mismatched = prods.filter(p => !p.brandOK || !p.modelOK);

            report += `\n${'='.repeat(70)}\n`;
            report += `📦 ${brandName} (ID: ${data.brandId}) — ${prods.length} products\n`;
            report += `   ✅ Correctly mapped: ${prods.length - mismatched.length}\n`;
            
            if (mismatched.length > 0) {
                report += `   ❌ MISMATCHED: ${mismatched.length}\n`;

                // Group mismatches by the model extracted from name
                const byModel = {};
                mismatched.forEach(p => {
                    const key = p.nameModel;
                    if (!byModel[key]) byModel[key] = [];
                    byModel[key].push(p);
                });

                for (const [model, mProds] of Object.entries(byModel)) {
                    report += `\n   🔸 Model from Name: "${model}" (${mProds.length} products)\n`;
                    // Show first 2 samples
                    mProds.slice(0, 2).forEach(p => {
                        report += `      [ID:${p.id}] "${p.name}"\n`;
                        report += `         DB Brand: ${p.dbBrand} (${p.dbBrandId}) | DB Model: ${p.dbModel} | VD: ${p.dbVdId}\n`;
                        report += `         Should be: Brand=${brandName} (${data.brandId}), Model=${model}\n`;
                    });
                    if (mProds.length > 2) report += `         ... and ${mProds.length - 2} more\n`;
                }
            }
        }

        report += `\n${'='.repeat(70)}\n`;
        report += `\n📊 GRAND SUMMARY:\n`;
        let totalMismatched = 0;
        for (const [_, data] of Object.entries(productsByBrand)) {
            const mm = data.products.filter(p => !p.brandOK || !p.modelOK).length;
            totalMismatched += mm;
        }
        report += `   Total 4W Seat Cover Products: ${products.length}\n`;
        report += `   Total Correctly Mapped: ${products.length - totalMismatched}\n`;
        report += `   Total Mismatched: ${totalMismatched}\n`;

        fs.writeFileSync('product_first_audit.txt', report);
        console.log(`✅ Product-First Audit complete: product_first_audit.txt`);
        console.log(`   Total: ${products.length} | Correct: ${products.length - totalMismatched} | Mismatched: ${totalMismatched}`);

    } catch (e) {
        console.error("Audit Error:", e);
    }
    process.exit(0);
}
productFirstAudit();
