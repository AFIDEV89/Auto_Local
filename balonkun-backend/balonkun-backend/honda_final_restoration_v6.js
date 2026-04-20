import db from './src/database/index.js';

async function finalRestoration() {
    console.log("🏁 STARTING EXHAUSTIVE DATA RESTORATION (STAGING - V6.1)\n");

    const carBrands = [
        { id: 1, name: 'HYUNDAI' },
        { id: 9, name: 'TOYOTA' },
        { id: 13, name: 'TATA' },
        { id: 14, name: 'MAHINDRA' },
        { id: 15, name: 'MARUTI' },
        { id: 16, name: 'RENAULT' },
        { id: 11, name: 'FORD' },
        { id: 12, name: 'NISSAN' },
        { id: 17, name: 'VOLKSWAGEN' },
        { id: 2, name: 'SKODA' },
        { id: 4, name: 'KIA' },
        { id: 3, name: 'MG' },
        { id: 5, name: 'JEEP' }
    ];

    const hondaModels = {
        'CITY': 636,
        'CIVIC': 233,
        'ELEVATE': 246,
        'AMAZE': 657
    };

    // 1. Build a map of Brand -> Generic Model VD ID
    const [authority] = await db.query(`
        SELECT b.id as b_id, vd.id as vd_id 
        FROM brands b 
        JOIN brand_models m ON b.id = m.brand_id 
        JOIN vehicle_details vd ON m.id = vd.model_id
    `);

    const brandToGenericVd = {};
    authority.forEach(a => {
        if (!brandToGenericVd[a.b_id]) brandToGenericVd[a.b_id] = a.vd_id;
    });

    // 2. Fetch all products currently in Honda Brand (10)
    const [prods] = await db.query('SELECT id, name FROM products WHERE brand_id = 10');
    console.log(`Analyzing ${prods.length} products in Honda category...\n`);

    let purgedCount = 0;
    let alignedCount = 0;

    for (const p of prods) {
        const name = p.name.toUpperCase();
        
        // --- STAGE 1: THE PURGE (Move ALL other brands out) ---
        let otherBrand = carBrands.find(b => name.includes(b.name));
        
        if (otherBrand) {
            const targetVd = brandToGenericVd[otherBrand.id];
            console.log(`🚀 [PURGING] ID: ${p.id} | ${p.name} -> Moving to Brand ${otherBrand.id} (VD: ${targetVd})`);
            
            await db.query(`UPDATE products SET brand_id = :b, vehicle_details_id = :v WHERE id = :id`, {
                replacements: { b: otherBrand.id, v: targetVd, id: p.id }
            });
            await db.query(`DELETE FROM product_vehicle_details WHERE product_id = :id`, { replacements: { id: p.id } });
            await db.query(`INSERT INTO product_vehicle_details (product_id, vehicle_details_id, createdAt, updatedAt) VALUES (:id, :v, NOW(), NOW())`, {
                replacements: { id: p.id, v: targetVd }
            });
            purgedCount++;
            continue;
        }

        // --- STAGE 2: INTERNAL HONDA ALIGNMENT ---
        let correctVd = null;
        if (name.includes('CITY')) correctVd = hondaModels['CITY'];
        else if (name.includes('CIVIC')) correctVd = hondaModels['CIVIC'];
        else if (name.includes('ELEVATE')) correctVd = hondaModels['ELEVATE'];
        else if (name.includes('AMAZE')) correctVd = hondaModels['AMAZE'];

        if (correctVd) {
             console.log(`🚗 [ALIGNING] ID: ${p.id} | ${p.name} -> Target: ${correctVd}`);
             await db.query(`UPDATE products SET brand_id = 10, vehicle_details_id = :v WHERE id = :id`, {
                 replacements: { v: correctVd, id: p.id }
             });
             await db.query(`DELETE FROM product_vehicle_details WHERE product_id = :id`, { replacements: { id: p.id } });
             await db.query(`INSERT INTO product_vehicle_details (product_id, vehicle_details_id, createdAt, updatedAt) VALUES (:id, :v, NOW(), NOW())`, {
                 replacements: { id: p.id, v: correctVd }
             });
             alignedCount++;
        }
    }

    console.log(`\n✅ Finished! Purged ${purgedCount} foreign products, Aligned ${alignedCount} Honda products.`);
    process.exit(0);
}

finalRestoration().catch(err => {
    console.error(err);
    process.exit(1);
});
