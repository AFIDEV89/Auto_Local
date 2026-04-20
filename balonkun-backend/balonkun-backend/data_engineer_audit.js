import db from './src/database/index.js';

async function dataEngineerAudit() {
    console.log("🕵️ DATA ENGINEER AUDIT: FINDING HIERARCHY CULPRITS\n");

    // 1. Audit Innova (Mapping Case Study)
    console.log("--- 1. Innova Mapping Analysis ---");
    const [innovaProds] = await db.query(`
        SELECT p.id, p.name, p.brand_id as p_brand, p.vehicle_details_id as p_vd, 
               vd.model_id, m.name as m_name, b.name as b_name 
        FROM products p 
        LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id 
        LEFT JOIN brand_models m ON vd.model_id = m.id 
        LEFT JOIN brands b ON m.brand_id = b.id 
        WHERE p.name LIKE '%Innova%'
    `);
    console.log(`Innova Keyword Matches: ${innovaProds.length}`);
    if (innovaProds.length > 0) {
        const sample = innovaProds[0];
        console.log(`Sample [ID:${sample.id}]: ${sample.name}`);
        console.log(`  Mapping Strategy: Brand(${sample.b_name}) -> Model(${sample.m_name})`);
        console.log(`  Data Integrity: Brand ID Match? ${sample.p_brand == (sample.brand_id || 'N/A')}`);
    }

    // 2. Audit Junction Table vs Primary Column
    console.log("\n--- 2. Junction Table Sync Audit ---");
    const [junctionCount] = await db.query(`SELECT count(*) as count FROM product_vehicle_details`);
    const [prodVdCount] = await db.query(`SELECT count(*) as count FROM products WHERE vehicle_details_id > 0`);
    console.log(`Junction (product_vehicle_details): ${junctionCount[0].count} links`);
    console.log(`Primary (products.vehicle_details_id): ${prodVdCount[0].count} links`);

    // 3. Find "Branded but Broken" products
    console.log("\n--- 3. Mis-mapped Car Products ---");
    const modelsToFind = ['Innova', 'Camry', 'Brio', 'Jazz', 'Scorpio', 'Fortuner', 'Creta', 'Nexon'];
    for (const model of modelsToFind) {
        const [broken] = await db.query(`
            SELECT count(*) as count 
            FROM products 
            WHERE name LIKE :term 
              AND (vehicle_details_id = 0 OR vehicle_details_id IS NULL)
        `, { replacements: { term: `%${model}%` } });
        console.log(`${model}: ${broken[0].count} unmapped products`);
    }

    // 4. Duplicate Model Check (Global)
    console.log("\n--- 4. Global Duplicate Model Check ---");
    const [duplicates] = await db.query(`
        SELECT name, brand_id, count(*) as count 
        FROM brand_models 
        GROUP BY name, brand_id 
        HAVING count > 1
    `);
    console.log(`Duplicate models found: ${duplicates.length}`);
    duplicates.slice(0, 10).forEach(d => console.log(`  [Brand:${d.brand_id}] Model: ${d.name} (${d.count} records)`));

    process.exit(0);
}

dataEngineerAudit().catch(err => {
    console.error(err);
    process.exit(1);
});
