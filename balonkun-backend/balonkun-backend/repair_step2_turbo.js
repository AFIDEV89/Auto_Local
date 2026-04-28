import db from './src/database/index.js';
import { Op } from 'sequelize';

const designToSubId = {
  "1": 32, "2": 31, "3": 35, "4": 36, "6": 37, "7": 38, "9": 33, "10": 34,
  "11": 52, "12": 56, "13": 58, "15": 39, "16": 51, "24": 41, "26": 63,
  "35": 49, "54": 42, "55": 61, "56": 62, "57": 47, "58": 48, "59": 57,
  "60": 40, "61": 46, "63": 59, "64": 60, "76": 45, "77": 55, "78": 53,
  "79": 43, "81": 44, "82": 54, "83": 50
};

async function turboRepair() {
    console.log("=== TURBO BATCH REPAIR (STAGING) ===\n");
    try {
        // 1. Map Designs in Batch
        console.log("📦 Batching subcategory updates...");
        for (const [designId, subId] of Object.entries(designToSubId)) {
            const variants = await db.productVariants.findAll({
                where: { design_id: designId },
                attributes: ['product_id'],
                raw: true,
                logging: false
            });
            const pIds = variants.map(v => v.product_id);
            if (pIds.length > 0) {
                await db.products.update(
                    { subcategory_id: subId },
                    { where: { id: { [Op.in]: pIds }, category_id: 10 }, logging: false }
                );
                console.log(`   ✅ Updated ${pIds.length} products to Subcategory [${subId}]`);
            }
        }

        // 2. Map Vehicle Types in Batch (4W)
        console.log("\n📦 Batching Vehicle Type updates (4W)...");
        const brands = await db.brands.findAll({ where: { vehicle_type_id: 2 }, attributes: ['id'], logging: false });
        const bIds = brands.map(b => b.id);
        const [updated4w] = await db.products.update(
            { vehicle_type_id: 2 },
            { where: { brand_id: { [Op.in]: bIds }, category_id: 10 }, logging: false }
        );
        console.log(`   ✅ Corrected Vehicle Type for ${updated4w} 4W products.`);

        // 3. Map Vehicle Types in Batch (2W)
        console.log("\n📦 Batching Vehicle Type updates (2W)...");
        const brands2w = await db.brands.findAll({ where: { vehicle_type_id: 1 }, attributes: ['id'], logging: false });
        const b2wIds = brands2w.map(b => b.id);
        const [updated2w] = await db.products.update(
            { vehicle_type_id: 1 },
            { where: { brand_id: { [Op.in]: b2wIds }, category_id: 10 }, logging: false }
        );
        console.log(`   ✅ Corrected Vehicle Type for ${updated2w} 2W products.`);

        // 4. Safety: Hide Maruti
        console.log("\n🕵️ Enforcing Maruti concealment...");
        const [hidden] = await db.products.update(
            { is_hide: true },
            { where: { name: { [Op.like]: '%Maruti%' } }, logging: false }
        );
        console.log(`   ✅ Ensured ${hidden} Maruti products are hidden.`);

        console.log("\n✅ TURBO REPAIR COMPLETE!");
    } catch (e) { console.error(e); }
    process.exit(0);
}
turboRepair();
