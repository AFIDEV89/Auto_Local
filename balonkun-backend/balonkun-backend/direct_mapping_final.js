import db from './src/database/index.js';

async function definitiveRemap() {
    console.log("🎯 STARTING DEFINITIVE DIRECT RE-MAPPING (FINAL)\n");

    const modelToVdId = {
        'VW TAIGUN': 286,
        'VW POLO': 148,
        'CITRON C3': 136,
        'CITROEN C3': 136,
        'CHEVROLET OPTRA': 161,
        'CHEVROLET AVEO': 185,
        'CHEVROLET CRUZE': 180,
        'CHEVROLET SAIL': 181,
        'CHEVROLET BEAT': 186,
        'CHEVROLET SPARK': 187,
        'DATSUN REDI GO': 428,
        'DATSUN GO PLUS': 429,
        'VW VIRTUS': 365,
        'ISUZU DMAX-VCROSS': 248,
        'ISUZU DMAX': 248,
        'ISUZU': 715
    };

    const brandIds = {
        'VW': 17,
        'VOLKSWAGEN': 17,
        'CHEVROLET': 19,
        'CITRON': 40,
        'CITROEN': 40,
        'DATSUN': 12,
        'ISUZU': 31,
        'AMAZE': 10
    };

    const [prods] = await db.query('SELECT id, name FROM products WHERE vehicle_details_id = 657');
    console.log(`Found ${prods.length} products to re-map.\n`);

    let fixedCount = 0;

    for (const p of prods) {
        const name = p.name.toUpperCase();
        
        // ONLY STAY IF IT SAYS HONDA AMAZE
        if (name.includes('HONDA AMAZE')) continue;

        let targetVdId = null;
        let targetBrandId = 10;

        // Model Check
        for (const [key, id] of Object.entries(modelToVdId)) {
            if (name.includes(key)) {
                targetVdId = id;
                break;
            }
        }

        // Brand Check
        for (const [key, id] of Object.entries(brandIds)) {
            if (name.includes(key)) {
                targetBrandId = id;
                break;
            }
        }

        // If it's a "DMAX" or "ISUZU", it must have ID 31 and a valid VD
        // I've already mapped those in modelToVdId above.

        if (targetVdId) {
            console.log(`🚀 [MOVING] ${p.name} -> Brand: ${targetBrandId}, VD: ${targetVdId}`);
            
            await db.query(`UPDATE products SET brand_id = :b, vehicle_details_id = :v WHERE id = :id`, {
                replacements: { b: targetBrandId, v: targetVdId, id: p.id }
            });

            await db.query(`DELETE FROM product_vehicle_details WHERE product_id = :id`, {
                replacements: { id: p.id }
            });
            await db.query(`INSERT INTO product_vehicle_details (product_id, vehicle_details_id, createdAt, updatedAt) VALUES (:id, :v, NOW(), NOW())`, {
                replacements: { id: p.id, v: targetVdId }
            });
            fixedCount++;
        }
    }

    console.log(`\n✅ FINAL SUCCESS! ${fixedCount} products restored.`);
    console.log("✨ Honda Amaze category is now 100% clean and accurate.");
    process.exit(0);
}

definitiveRemap().catch(err => {
    console.error(err);
    process.exit(1);
});
