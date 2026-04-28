import db from './src/database/index.js';

async function strictRescue() {
    console.log("🚀 STARTING PRECISE PRODUCT RESCUE (STAGING ONLY)\n");

    const rescueManifest = [
        { brandName: 'Honda', modelName: 'Amaze', brandId: 10 },
        { brandName: 'Honda', modelName: 'City', brandId: 10 },
        { brandName: 'Honda', modelName: 'Elevate', brandId: 10 },
        { brandName: 'Toyota', modelName: 'Innova', brandId: 9 },
        { brandName: 'Mahindra', modelName: 'Scorpio', brandId: 14 }
    ];

    for (const item of rescueManifest) {
        console.log(`--- Checking ${item.brandName} ${item.modelName} ---`);

        // 1. Get the authoritative Vehicle Details ID for this Model
        const [vd] = await db.query(`
            SELECT vd.id 
            FROM vehicle_details vd 
            JOIN brand_models m ON vd.model_id = m.id 
            WHERE m.name = :model AND m.brand_id = :brandId
            LIMIT 1
        `, { replacements: { model: item.modelName, brandId: item.brandId } });

        if (!vd || vd.length === 0) {
            console.log(`   ❌ Authority not found for ${item.brandName} ${item.modelName}. Skipping.`);
            continue;
        }
        const targetVdId = vd[0].id;

        // 2. Find Products that match BOTH brand and model in name
        // but have different mapping in the database
        const [prods] = await db.query(`
            SELECT id, name, brand_id, vehicle_details_id 
            FROM products 
            WHERE name LIKE :brandMatch 
              AND name LIKE :modelMatch
              AND (brand_id != :targetBrand OR vehicle_details_id != :targetVdId)
        `, { 
            replacements: { 
                brandMatch: `%${item.brandName}%`, 
                modelMatch: `%${item.modelName}%`,
                targetBrand: item.brandId,
                targetVdId: targetVdId
            } 
        });

        if (prods.length > 0) {
            console.log(`   ✅ Found ${prods.length} mis-mapped items to rescue.`);
            for (const p of prods) {
                console.log(`   [FIXING] ID: ${p.id} | ${p.name}`);
                await db.query(`
                    UPDATE products 
                    SET brand_id = :brandId, vehicle_details_id = :vdId 
                    WHERE id = :id
                `, { replacements: { brandId: item.brandId, vdId: targetVdId, id: p.id } });
            }
        } else {
            console.log("   ✨ All items correctly mapped.");
        }
    }

    console.log("\n✨ Precise Product Rescue Operation Complete.");
    process.exit(0);
}

strictRescue().catch(err => {
    console.error(err);
    process.exit(1);
});
