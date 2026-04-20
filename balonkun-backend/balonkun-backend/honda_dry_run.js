import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

const CAR_MODELS = ['CIVIC', 'CITY', 'ELEVATE', 'AMAZE', 'WRV', 'BRIO', 'ACCORD', 'CRV'];
const BIKE_MODELS = [
    'SHINE', 'ACTIVA', 'DIO', 'LIVO', 'NAVI', 'HORNET', 'GRAZIA', 
    'UNICORN', 'X-BLADE', 'CD110', 'DREAM YUGA', 'AVIATOR', 'SP 125', 'SP 160'
];

// Identifiers for subcategories (signals)
const BIKE_SUBCATS = [13, 14, 30, 43, 44, 45, 46, 49, 50, 53, 55, 59, 60];
const CAR_SUBCATS = [9, 15, 19, 21, 29, 31, 32, 39, 40];

async function dryRun() {
    console.log("🚀 Starting Honda Segregation Dry Run...");
    
    const products = await db.products.findAll({
        where: {
            name: { [Op.like]: '%Honda%' }
        },
        attributes: ['id', 'name', 'brand_id', 'subcategory_id'],
        raw: true
    });

    let report = "=== HONDA SEGREGATION DRY RUN REPORT ===\n";
    report += `Total Honda Products Found: ${products.length}\n\n`;
    report += "ID | Current Brand | Proposed Brand | Reason | Product Name\n";
    report += "---|---------------|----------------|--------|-------------\n";

    let leaksToBike = 0;
    let leaksToCar = 0;
    let ambiguous = 0;

    for (const p of products) {
        const nameUpper = p.name.toUpperCase();
        let proposedBrand = p.brand_id;
        let reason = "Current Match";

        // Logic 1: Strict Model Matching (Word Boundaries)
        const words = nameUpper.split(/[^A-Z0-9+]/);
        
        let foundBikeModel = BIKE_MODELS.find(m => words.includes(m));
        let foundCarModel = CAR_MODELS.find(m => words.includes(m));

        if (foundBikeModel) {
            proposedBrand = 37;
            reason = `Model Match (${foundBikeModel})`;
        } else if (foundCarModel) {
            proposedBrand = 10;
            reason = `Model Match (${foundCarModel})`;
        } else {
            // Logic 2: Subcategory Signals
            if (BIKE_SUBCATS.includes(p.subcategory_id)) {
                proposedBrand = 37;
                reason = "Subcategory Signal (2W)";
            } else if (CAR_SUBCATS.includes(p.subcategory_id)) {
                proposedBrand = 10;
                reason = "Subcategory Signal (4W)";
            } else {
                reason = "No Specific Signal (Keeping Current)";
                if (p.brand_id === 10 && nameUpper.includes("SEAT COVER") && !foundCarModel) {
                   // seat covers without a model might be generic car or bike
                   // we'll label as ambiguous for manual review if they are in 4W but no car model found
                   ambiguous++;
                }
            }
        }

        if (p.brand_id === 10 && proposedBrand === 37) {
            leaksToBike++;
            report += `[LEAK 4W->2W] ${p.id} | 10 | 37 | ${reason} | ${p.name}\n`;
        } else if (p.brand_id === 37 && proposedBrand === 10) {
            leaksToCar++;
            report += `[LEAK 2W->4W] ${p.id} | 37 | 10 | ${reason} | ${p.name}\n`;
        } else {
            // report += `[OK] ${p.id} | ${p.brand_id} | ${proposedBrand} | ${reason} | ${p.name}\n`;
        }
    }

    report += `\n--- SUMMARY ---\n`;
    report += `Leaks identified (4W -> 2W): ${leaksToBike}\n`;
    report += `Leaks identified (2W -> 4W): ${leaksToCar}\n`;
    report += `Ambiguous products: ${ambiguous}\n`;

    fs.writeFileSync('honda_segregation_dry_run.txt', report);
    console.log("✅ Dry run complete. Results written to honda_segregation_dry_run.txt");
    process.exit(0);
}

dryRun();
