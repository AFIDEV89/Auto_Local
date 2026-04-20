import db from './src/database/index.js';

async function theHammer() {
    console.log("🔨 THE DOUBLE-AMAZE SURGICAL PURGE (V7)\n");

    const brandIds = {
        'VW': 17,
        'VOLKSWAGEN': 17,
        'CHEVROLET': 19,
        'CITRON': 40,
        'CITROEN': 40,
        'DATSUN': 31,
        'ISUZU': 32
    };

    // 1. Target ID 657 (The master Amaze VD ID)
    const targetVdId = 657;

    const [prods] = await db.query('SELECT id, name FROM products WHERE vehicle_details_id = :id', {
        replacements: { id: targetVdId }
    });

    console.log(`Analyzing ${prods.length} items in Honda Amaze category...\n`);

    let evictedCount = 0;

    for (const p of prods) {
        const name = p.name.toUpperCase();

        // THE GOLDEN RULE: If it doesn't say HONDA AMAZE, it's out.
        if (!name.includes('HONDA AMAZE')) {
            console.log(`🚀 [EVICTING] ID: ${p.id} | ${p.name}`);

            // Try to find the correct brand id based on keyword
            let targetBrandId = 10; // Default to Honda (Brand 10) but un-linked if no brand name found
            for (const [key, id] of Object.entries(brandIds)) {
                if (name.includes(key)) {
                    targetBrandId = id;
                    break;
                }
            }

            // Move it out!
            // We set vehicle_details_id to NULL (or 0) so it doesn't show in model filters
            // and update the Brand ID.
            await db.query(`UPDATE products SET brand_id = :b, vehicle_details_id = NULL WHERE id = :id`, {
                replacements: { b: targetBrandId, id: p.id }
            });

            // Clean the junction table
            await db.query(`DELETE FROM product_vehicle_details WHERE product_id = :id`, {
                replacements: { id: p.id }
            });

            evictedCount++;
        }
    }

    console.log(`\n✅ Surgical Purge Complete! ${evictedCount} ghost products evicted.`);
    process.exit(0);
}

theHammer().catch(err => {
    console.error(err);
    process.exit(1);
});
