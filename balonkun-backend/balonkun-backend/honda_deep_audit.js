import db from './src/database/index.js';

const searchTerms = ['Jazz', 'WRV', 'Brio', 'Accord', 'CRV', 'Amaze'];

async function deepAudit() {
    console.log("🔍 STAGING DATABASE DEEP AUDIT FOR MISSING HONDA MODELS\n");

    for (const term of searchTerms) {
        console.log(`--- Searching for "${term}" ---`);

        // 1. Search Products (All text fields)
        const [pResults] = await db.query(`
            SELECT id, name, brand_id, category_id, vehicle_details_id 
            FROM products 
            WHERE name LIKE :term 
               OR detail LIKE :term 
               OR description LIKE :term 
               OR additional_info LIKE :term
        `, { replacements: { term: `%${term}%` } });

        if (pResults.length > 0) {
            console.log(`✅ Found in PRODUCTS: ${pResults.length}`);
            pResults.slice(0, 5).forEach(r => {
                console.log(`   ID: ${r.id} | Brand: ${r.brand_id} | Cat: ${r.category_id} | Name: ${r.name}`);
            });
        }

        // 2. Search Product Variants
        const [vResults] = await db.query(`
            SELECT id, product_id, item_code 
            FROM product_variants 
            WHERE detail LIKE :term
        `, { replacements: { term: `%${term}%` } });

        if (vResults.length > 0) {
            console.log(`✅ Found in VARIANTS: ${vResults.length}`);
        }

        // 3. Search Model Strings directly
        const [mResults] = await db.query(`
            SELECT id, name, brand_id 
            FROM brand_models 
            WHERE name LIKE :term
        `, { replacements: { term: `%${term}%` } });

        if (mResults.length > 0) {
            console.log(`✅ Found in BRAND_MODELS: ${mResults.length}`);
            mResults.forEach(m => console.log(`   ID: ${m.id} | Name: ${m.name} | Brand: ${m.brand_id}`));
        }

        console.log("");
    }

    // 4. Check for products with NO BRAND or UNKNOWN BRAND
    const [unknowns] = await db.query(`
        SELECT count(*) as count FROM products WHERE brand_id IS NULL OR brand_id = 0
    `);
    console.log(`📊 Products with NULL/0 Brand ID: ${unknowns[0].count}`);

    process.exit(0);
}

deepAudit().catch(err => {
    console.error(err);
    process.exit(1);
});
