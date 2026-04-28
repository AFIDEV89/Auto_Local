import db from './src/database/index.js';

async function finalHondaClean() {
    console.log("🎯 FINAL HONDA PRECISION CLEANUP (STAGING)\n");

    const modelMap = {
        'CITY': 636,
        'CIVIC': 233,
        'ELEVATE': 246,
        'AMAZE': 657
    };

    // 1. Process all products currently in Brand 10
    const [prods] = await db.query('SELECT id, name, vehicle_details_id FROM products WHERE brand_id = 10');
    console.log(`Auditing ${prods.length} Honda products...\n`);

    let totalFixed = 0;

    for (const p of prods) {
        const name = p.name.toUpperCase();
        let correctVd = null;

        // PRIORITY LOOKUP
        if (name.includes('CITY')) {
            correctVd = modelMap['CITY'];
        } else if (name.includes('CIVIC')) {
            correctVd = modelMap['CIVIC'];
        } else if (name.includes('ELEVATE')) {
            correctVd = modelMap['ELEVATE'];
        } else if (name.includes('AMAZE')) {
            correctVd = modelMap['AMAZE'];
        }

        if (correctVd && p.vehicle_details_id !== correctVd) {
            console.log(`   [FIXING] ${p.name}`);
            console.log(`     Updating Master Record (VD: ${correctVd})`);
            
            // Update Master Products table
            await db.query(`UPDATE products SET vehicle_details_id = :vd WHERE id = :id`, {
                replacements: { vd: correctVd, id: p.id }
            });

            // Update Junction Table - Delete existing and insert fresh to be sure
            await db.query(`DELETE FROM product_vehicle_details WHERE product_id = :id`, {
                replacements: { id: p.id }
            });
            await db.query(`INSERT INTO product_vehicle_details (product_id, vehicle_details_id, createdAt, updatedAt) VALUES (:id, :vd, NOW(), NOW())`, {
                replacements: { id: p.id, vd: correctVd }
            });

            totalFixed++;
        }
    }

    console.log(`\n✅ Successfully re-mapped ${totalFixed} products with 100% priority matching.`);
    console.log("✨ Honda Hierarchy Restoration is Finalized.");
    process.exit(0);
}

finalHondaClean().catch(err => {
    console.error(err);
    process.exit(1);
});
