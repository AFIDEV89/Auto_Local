import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== SEARCHING FOR 'car-seat-covers' AND 'Optra' MAPPINGS ===");
const [rows] = await conn.query(`
  SELECT id, product_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, url_text, canonical_url, url
  FROM seo_data_mappings
  WHERE url_text = 'car-seat-covers' 
     OR canonical_url = 'car-seat-covers'
     OR url = 'car-seat-covers'
     OR seo_page_title LIKE '%Chevrolet Optra%'
`);

rows.forEach(r => {
    console.log(`[${r.id}] Title: ${r.seo_page_title}`);
    console.log(`     UrlText: ${r.url_text} Canonical: ${r.canonical_url} Url: ${r.url}`);
    console.log(`     Cat: ${r.product_category_id} Brand: ${r.vehicle_brand_id} Model: ${r.vehicle_model_id}`);
    console.log('---');
});

await conn.end();
