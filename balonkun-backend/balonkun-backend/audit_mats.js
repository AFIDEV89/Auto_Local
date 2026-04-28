import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

async function run() {
  console.log("=== MATS DATA & SEO AUDIT ===");

  // 1. Check existing SEO mappings for Mats (Cat 12)
  const [matsSeo] = await conn.query("SELECT count(*) as count FROM seo_data_mappings WHERE product_category_id = 12");
  console.log(`\nCurrent SEO Records for Mats: ${matsSeo[0].count}`);

  // 2. Identify missing Brand-level SEO for Mats
  const [missingBrands] = await conn.query(`
    SELECT b.id, b.name 
    FROM brands b
    LEFT JOIN seo_data_mappings sdm ON (sdm.vehicle_brand_id = b.id AND sdm.product_category_id = 12 AND sdm.vehicle_model_id IS NULL)
    WHERE sdm.id IS NULL
  `);
  console.log(`Missing Brand-level SEO for Mats: ${missingBrands.length}`);

  // 3. Identify missing Model-level SEO for Mats (where products exist)
  // Since we only have 8 products, we'll also look at ALL active models to see coverage
  const [missingModels] = await conn.query(`
    SELECT DISTINCT bm.id, bm.name, b.name as brand_name
    FROM brand_models bm
    JOIN brands b ON bm.brand_id = b.id
    LEFT JOIN seo_data_mappings sdm ON (sdm.vehicle_model_id = bm.id AND sdm.product_category_id = 12)
    WHERE sdm.id IS NULL
  `);
  console.log(`Missing Model-level SEO for Mats (Total): ${missingModels.length}`);

  // 4. Check for products with 'mat' in name that are NOT in Cat 12
  const [misCat] = await conn.query("SELECT id, name, category_id FROM products WHERE name LIKE '%mat%' AND category_id != 12");
  console.log(`\nProducts with 'mat' in name but NOT in Cat 12: ${misCat.length}`);
  misCat.forEach(p => console.log(`  - [ID ${p.id}] ${p.name} (Cat ${p.category_id})`));

  await conn.end();
}

run().catch(console.error);
