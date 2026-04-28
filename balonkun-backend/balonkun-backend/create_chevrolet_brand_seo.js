import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== CREATING BRAND-LEVEL SEO FOR CHEVROLET ACCESSORIES ===");

// Check if it already exists
const [existing] = await conn.query(`
  SELECT id FROM seo_data_mappings 
  WHERE product_category_id = 11 
    AND vehicle_brand_id = 24 
    AND vehicle_model_id IS NULL
`);

if (existing.length > 0) {
    console.log(`Record already exists with ID: ${existing[0].id}`);
} else {
    const title = "Chevrolet Car Accessories";
    const description = "Discover premium Chevrolet accessories at Autoform India. From interior comfort to exterior styling, we have everything to upgrade your ride.";
    const categoryText = `<h1>Chevrolet Car Accessories</h1><p>Welcome to the premium collection of Chevrolet car accessories. Enhance your driving experience with our curated range of comfort and styling essentials.</p>`;
    const urlText = "chevrolet-accessories";

    const [result] = await conn.query(`
        INSERT INTO seo_data_mappings 
        (product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, seo_page_description, category_text, url_text, canonical_url, createdAt, updatedAt)
        VALUES (11, 2, 24, NULL, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [title, description, categoryText, urlText, urlText]);

    console.log(`Created brand-level SEO record with ID: ${result.insertId}`);
}

await conn.end();
