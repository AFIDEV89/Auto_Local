import db from './src/database/index.js';

async function rescueProducts() {
    console.log("🚀 STARTING GLOBAL PRODUCT RESCUE (STAGING ONLY)\n");

    const rescueManifest = [
        { model: 'Amaze', targetBrand: 10, search: 'Amaze' },
        { model: 'Innova', targetBrand: 9, search: 'Innova' },
        { model: 'Scorpio', targetBrand: 14, search: 'Scorpio' }
    ];

    for (const item of rescueManifest) {
        console.log(`--- Rescuing ${item.model} -> Brand ID: ${item.targetBrand} ---`);

        // 1. Find the target vehicle_details_id for this model in the target brand
        const [vd] = await db.query(`
            SELECT vd.id 
            FROM vehicle_details vd 
            JOIN brand_models m ON vd.model_id = m.id 
            WHERE m.name = :name AND m.brand_id = :brand
            LIMIT 1
        `, { replacements: { name: item.model, brand: item.targetBrand } });

        if (!vd || vd.length === 0) {
            console.log(`❌ Target Vehicle Detail for ${item.model} (Brand:${item.targetBrand}) not found. Skipping.`);
            continue;
        }

        const targetVdId = vd[0].id;
        console.log(`   Target VD ID identified: ${targetVdId}`);

        // 2. Identify products by keyword that are NOT in the target brand or mapped correctly
        const [prods] = await db.query(`
            SELECT id, name, brand_id, vehicle_details_id 
            FROM products 
            WHERE name LIKE :search 
              AND (brand_id != :targetBrand OR vehicle_details_id != :targetVdId)
        `, { replacements: { search: `%${item.search}%`, targetBrand: item.targetBrand, targetVdId } });

        console.log(`   Found ${prods.length} products to rescue.`);

        for (const p of prods) {
            // Check if it belongs to another brand (e.g. 'Tata Zest' shouldn't be moved if we are searching 'Zest')
            // This is a safety check. For Innova and Amaze it is usually safe.
            console.log(`   [RESCUING] ID: ${p.id} | ${p.name}`);
            await db.query(`
                UPDATE products 
                SET brand_id = :brand, vehicle_details_id = :vd 
                WHERE id = :id
            `, { replacements: { brand: item.targetBrand, vd: targetVdId, id: p.id } });
        }
    }

    // Special Case: Move Orphaned Amaze (Brand 38)
    console.log("\n--- Special Case: Amaze ID 9959, 9960 ---");
    const [amazeVD] = await db.query(`SELECT id FROM vehicle_details vd JOIN brand_models m ON vd.model_id = m.id WHERE m.name = 'Amaze' LIMIT 1`);
    if (amazeVD.length > 0) {
        await db.query(`UPDATE products SET brand_id = 10, vehicle_details_id = :vd WHERE id IN (9959, 9960)`, {
            replacements: { vd: amazeVD[0].id }
        });
        console.log("   IDs 9959, 9960 moved to Honda Amaze.");
    }

    console.log("\n✨ Product Rescue Operation Complete.");
    process.exit(0);
}

rescueProducts().catch(err => {
    console.error(err);
    process.exit(1);
});
