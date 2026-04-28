import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

async function deepAudit() {
    console.log("=== HONDA DEEP HIERARCHY AUDIT (STAGING) ===\n");

    try {
        const honda4wId = 10;
        const honda2wId = 37;

        // 1. Check for "Bikes Leaking into 4W"
        const leakingBikes = await db.products.findAll({
            where: { brand_id: honda4wId, vehicle_type_id: 1 },
            attributes: ['id', 'name'],
            logging: false
        });

        // 2. Analyze Specific Models (Brio, Accord, WRV)
        const emptyModels = ['Brio', 'Accord', 'WRV'];
        const modelStats = {};
        for (const name of emptyModels) {
            const products = await db.products.findAll({
                where: { name: { [Op.like]: `%Honda ${name}%` } },
                logging: false
            });
            modelStats[name] = {
                foundByName: products.length,
                brandId: products.length > 0 ? products[0].brand_id : 'N/A',
                typeId: products.length > 0 ? products[0].vehicle_type_id : 'N/A'
            };
        }

        // 3. Generic vs Specific Analysis
        const allHonda4w = await db.products.findAll({
            where: { brand_id: honda4wId },
            logging: false
        });

        let genericCount = 0;
        let modelCount = 0;
        const samples = [];

        for (const p of allHonda4w) {
            const name = p.name;
            // A "Generic" product likely doesn't have multiple capitalized words after Honda or specific model names
            const hasModelMatch = ['city', 'amaze', 'civic', 'elevate', 'wrv', 'brio', 'accord', 'crv', 'jazz', 'brv', 'mobilio']
                                .some(m => name.toLowerCase().includes(m));
            
            if (hasModelMatch) {
                modelCount++;
            } else {
                genericCount++;
                if (samples.length < 5) samples.push(name);
            }
        }

        let report = `=== HONDA PERFECT MAPPING AUDIT ===\n\n`;
        report += `Total products under HONDA (ID 10): ${allHonda4w.length}\n`;
        report += `Model-Specific Products: ${modelCount}\n`;
        report += `Generic Products (Make only): ${genericCount}\n\n`;
        
        report += `⚠️  LEAKAGE CHECK:\n`;
        report += `- 2-Wheeler products mistakenly linked to 4W HONDA: ${leakingBikes.length}\n`;
        if (leakingBikes.length > 0) {
            report += `  Samples: ${leakingBikes.slice(0,3).map(b => b.name).join(', ')}\n`;
        }
        
        report += `\n🔍 EMPTY MODEL INVESTIGATION:\n`;
        for (const [name, stats] of Object.entries(modelStats)) {
            report += `- ${name}: Found ${stats.foundByName} products by name. (BrandID: ${stats.brandId}, TypeID: ${stats.typeId})\n`;
        }

        report += `\n📦 GENERIC PRODUCT SAMPLES:\n`;
        samples.forEach(s => report += `- ${s}\n`);

        fs.writeFileSync('honda_perfect_mapping_report.txt', report);
        console.log("✅ Audit Report generated: honda_perfect_mapping_report.txt");

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
deepAudit();
