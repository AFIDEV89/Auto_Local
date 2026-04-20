import db from './src/database/index.js';

const searchTerms = ['Jazz', 'WRV', 'Brio', 'Accord', 'CRV', 'Amaze'];
const dbNames = ['dev-autoform', 'db_autoform_copy', 'db_autoform_copy_1', 'dev_autoform_8_march'];

async function deepAudit() {
    console.log("🔍 STARTING EXHAUSTIVE HONDA AUDIT\n");

    for (const dname of dbNames) {
        console.log(`=== CHECKING DATABASE: ${dname} ===`);
        
        for (const term of searchTerms) {
            try {
                // Search Products
                const [pResults] = await db.query(`
                    SELECT id, name, brand_id, vehicle_details_id 
                    FROM \`${dname}\`.products 
                    WHERE name LIKE :term OR detail LIKE :term OR description LIKE :term
                `, { replacements: { term: `%${term}%` } });

                if (pResults.length > 0) {
                    console.log(`✅ [${dname}] Found "${term}" in PRODUCTS: ${pResults.length}`);
                    pResults.slice(0, 3).forEach(r => {
                        console.log(`   ID: ${r.id} | Brand: ${r.brand_id} | VD: ${r.vehicle_details_id} | Name: ${r.name}`);
                    });
                }

                // Search Junction Table (if exists)
                try {
                    const [jResults] = await db.query(`
                        SELECT pvd.product_id, pvd.vehicle_details_id, p.name
                        FROM \`${dname}\`.product_vehicle_details pvd
                        JOIN \`${dname}\`.products p ON pvd.product_id = p.id
                        WHERE p.name LIKE :term
                    `, { replacements: { term: `%${term}%` } });

                    if (jResults.length > 0) {
                        console.log(`✅ [${dname}] Found "${term}" in JUNCTION: ${jResults.length}`);
                    }
                } catch (e) {
                    // Junction table might not exist in all DBs
                }

            } catch (e) {
                console.log(`❌ Error searching ${dname} for ${term}: ${e.message}`);
            }
        }
        console.log("");
    }

    process.exit(0);
}

deepAudit().catch(err => {
    console.error(err);
    process.exit(1);
});
