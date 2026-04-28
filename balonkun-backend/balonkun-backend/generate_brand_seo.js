import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== GENERATING MISSING BRAND-LEVEL SEO FOR ALL BRANDS ===");

// 1. Get existing brand-level SEO mappings
const [existingSeos] = await conn.query(`
  SELECT product_category_id, vehicle_brand_id
  FROM seo_data_mappings 
  WHERE vehicle_model_id IS NULL AND vehicle_brand_id IS NOT NULL AND url IS NULL
`);
const existingSet = new Set(existingSeos.map(r => `${r.product_category_id}_${r.vehicle_brand_id}`));

// 2. Identify missing brand-level mappings dynamically based on existing model-level mappings
const [missingToGenerate] = await conn.query(`
  SELECT DISTINCT sdm.product_category_id, sdm.vehicle_category_id, sdm.vehicle_brand_id, c.name as category_name, b.name as brand_name
  FROM seo_data_mappings sdm
  JOIN categories c ON sdm.product_category_id = c.id
  JOIN brands b ON sdm.vehicle_brand_id = b.id
  WHERE sdm.vehicle_model_id IS NOT NULL 
    AND sdm.url IS NULL
`);

const toInsert = missingToGenerate.filter(r => !existingSet.has(`${r.product_category_id}_${r.vehicle_brand_id}`));

console.log(`Found ${toInsert.length} missing brand-level combinations.`);
console.log('');

let successCount = 0;

for (const item of toInsert) {
    const { product_category_id, vehicle_category_id, vehicle_brand_id, category_name, brand_name } = item;
    
    // Create clean dynamic titles and descriptions
    let title = `${brand_name} ${category_name}`;
    let description = `Premium ${title.toLowerCase()} from Autoform. Upgrade your ${brand_name} with the best quality ${category_name.toLowerCase()}.`;
    let url_text = `${brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    let html_snippet = `<h1>${title}</h1><p>${description}</p>`;

    try {
        await conn.query(`
            INSERT INTO seo_data_mappings 
            (product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, seo_page_description, category_text, url_text, canonical_url, createdAt, updatedAt)
            VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
            product_category_id, 
            vehicle_category_id, 
            vehicle_brand_id, 
            title, 
            description, 
            html_snippet, 
            url_text, 
            url_text
        ]);

        console.log(`[SUCCESS] Inserted: ${title} (Cat: ${product_category_id}, Brand: ${vehicle_brand_id})`);
        successCount++;
    } catch (e) {
        console.error(`[ERROR] Failed to insert ${title}:`, e.message);
    }
}

console.log(`\n=== COMPLETED: Added ${successCount} new brand-level SEO mappings ===`);
await conn.end();
