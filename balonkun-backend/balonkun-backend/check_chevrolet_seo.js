import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== SEO DATA MAPPING FOR CHEVROLET (24) ===");
const [rows] = await conn.query(`
  SELECT sdm.id, sdm.product_category_id, sdm.vehicle_category_id, 
         sdm.vehicle_brand_id, sdm.vehicle_model_id,
         sdm.seo_page_title, sdm.category_text, sdm.url, sdm.canonical_url
  FROM seo_data_mappings sdm
  WHERE sdm.vehicle_brand_id = 24
`);

rows.forEach(r => {
    console.log(`[${r.id}] Cat:${r.product_category_id} Brand:${r.vehicle_brand_id} Model:${r.vehicle_model_id} Title:${r.seo_page_title}`);
    console.log(`     Url:${r.url} Canonical:${r.canonical_url}`);
    console.log(`     CategoryText Snippet: ${r.category_text ? r.category_text.substring(0, 50) + '...' : 'null'}`);
    console.log('---');
});

await conn.end();
