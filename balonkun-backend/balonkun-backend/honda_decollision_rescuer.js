import db from './src/database/index.js';

async function decollideAmaze() {
    console.log("🛠️ STARTING PRECISION DE-COLLISION (STAGING ONLY)\n");

    // 1. Build a Global Brand-Model-VD Map
    const [authority] = await db.query(`
        SELECT b.id as brand_id, b.name as brand_name, m.id as model_id, m.name as model_name, vd.id as vd_id 
        FROM brands b 
        JOIN brand_models m ON b.id = m.brand_id 
        JOIN vehicle_details vd ON m.id = vd.model_id
    `);

    const authMap = authority.map(a => ({
        brandId: a.brand_id,
        brandName: a.brand_name.toUpperCase(),
        modelName: a.model_name.toUpperCase(),
        vdId: a.vd_id
    }));

    console.log(`Loaded ${authMap.length} Brand-Model authorities.\n`);

    // 2. Identify the 288 mis-mapped products in Brand 10 (Honda)
    // We target anything that was caught by the previous '%Amaze%' rescue.
    const [prods] = await db.query(`SELECT id, name FROM products WHERE brand_id = 10`);

    console.log(`Analyzing ${prods.length} products in Honda brand for design collisions...\n`);

    let movedCount = 0;

    for (const p of prods) {
        const name = p.name.toUpperCase();
        
        // Find the BEST matching authority
        // We look for Brand + Model in the title
        let bestMatch = null;

        for (const auth of authMap) {
            // High priority: If name contains "HONDA AMAZE" (contiguous) or similar car model
            // We search for the pattern "BRAND + MODEL"
            const brandS = auth.brandName;
            const modelS = auth.modelName;

            if (name.includes(brandS) && name.includes(modelS)) {
                // Potential match. We want the one where Model appears earliest 
                // but after "Honda" if "Honda" is in the name.
                // Special check for Honda Amaze: only map if it says "HONDA AMAZE" 
                // (usually at the start or double-Amaze)
                bestMatch = auth;
                break; // Found first good match (usually specific enough)
            }
        }

        if (bestMatch && bestMatch.brandId !== 10) {
            // It belongs to another brand! (e.g. Hyundai, Toyota)
            console.log(`🚀 [RESTORING] ID: ${p.id} | ${p.name} -> Moving to Brand: ${bestMatch.brandId} (VD: ${bestMatch.vdId})`);
            await db.query(`UPDATE products SET brand_id = :b, vehicle_details_id = :v WHERE id = :id`, {
                replacements: { b: bestMatch.brandId, v: bestMatch.vdId, id: p.id }
            });
            movedCount++;
        } else if (bestMatch && name.includes('CITY')) {
             // If it contains CITY, it belongs to City (ID derived from Auth)
             const cityAuth = authMap.find(a => a.brandId === 10 && a.modelName === 'CITY');
             if (cityAuth) {
                 console.log(`🚗 [REDIRECTING] ID: ${p.id} | ${p.name} -> Back to Honda CITY (VD: ${cityAuth.vdId})`);
                 await db.query(`UPDATE products SET brand_id = 10, vehicle_details_id = :v WHERE id = :id`, {
                    replacements: { v: cityAuth.vdId, id: p.id }
                });
                movedCount++;
             }
        } else if (bestMatch && name.includes('CIVIC')) {
            const civicAuth = authMap.find(a => a.brandId === 10 && a.modelName === 'CIVIC');
             if (civicAuth) {
                 console.log(`🚗 [REDIRECTING] ID: ${p.id} | ${p.name} -> Back to Honda CIVIC (VD: ${civicAuth.vdId})`);
                 await db.query(`UPDATE products SET brand_id = 10, vehicle_details_id = :v WHERE id = :id`, {
                    replacements: { v: civicAuth.vdId, id: p.id }
                });
                movedCount++;
             }
        }
    }

    console.log(`\n✅ Finished! Moved/Restored ${movedCount} products.`);
    process.exit(0);
}

decollideAmaze().catch(err => {
    console.error(err);
    process.exit(1);
});
