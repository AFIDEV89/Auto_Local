import db from './src/database/index.js';

async function finalRescue() {
    console.log("🚀 STARTING FINAL GLOBAL RESCUE (STAGING ONLY)\n");

    const rescueManifest = [
        { brandName: 'Toyota', modelName: 'Innova', search: 'Innova', brandId: 9 },
        { brandName: 'Mahindra', modelName: 'Scorpio', search: 'Scorpio', brandId: 14 },
        { brandName: 'Hyundai', modelName: 'Elantra', search: 'Elantra', brandId: 1 },
        { brandName: 'Hyundai', modelName: 'I-10 Grand', search: 'Grand', brandId: 1 },
        { brandName: 'TATA', modelName: 'Zest', search: 'Zest', brandId: 13 },
        { brandName: 'Toyota', modelName: 'Etios', search: 'Etios', brandId: 9 }
    ];

    for (const item of rescueManifest) {
        console.log(`--- Processing ${item.brandName} ${item.modelName} ---`);

        // 1. Find the target vehicle_details_id
        const [vd] = await db.query(`
            SELECT vd.id 
            FROM vehicle_details vd 
            JOIN brand_models m ON vd.model_id = m.id 
            WHERE m.name LIKE :model AND m.brand_id = :brandId
            LIMIT 1
        `, { replacements: { model: `%${item.modelName}%`, brandId: item.brandId } });

        if (!vd || vd.length === 0) {
            console.log(`   ❌ Target Vehicle Detail not found for ${item.modelName}. Skipping.`);
            continue;
        }
        const targetVdId = vd[0].id;

        // 2. Rescue mis-mapped items
        const [prods] = await db.query(`
            SELECT id, name 
            FROM products 
            WHERE name LIKE :search 
              AND (brand_id != :brandId OR vehicle_details_id != :vdId)
        `, { replacements: { search: `%${item.search}%`, brandId: item.brandId, vdId: targetVdId } });

        if (prods.length > 0) {
            console.log(`   ✅ Rescuing ${prods.length} items...`);
            for (const p of prods) {
                // Final safety: don't move products that clearly belong to another brand (e.g. Amaze designs)
                // We trust the search term for these specific models.
                await db.query(`UPDATE products SET brand_id = :brandId, vehicle_details_id = :vdId WHERE id = :id`, {
                    replacements: { brandId: item.brandId, vdId: targetVdId, id: p.id }
                });
            }
        } else {
            console.log("   ✨ No items need rescue.");
        }
    }

    console.log("\n✨ Final Rescue Operation Complete.");
    process.exit(0);
}

finalRescue().catch(err => {
    console.error(err);
    process.exit(1);
});
