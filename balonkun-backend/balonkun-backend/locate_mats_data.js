import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

async function run() {
  console.log("=== SCANNING FOR MATS DATA ===");

  // 1. Search products by name
  const [nameMatches] = await conn.query("SELECT id, name, category_id, brand_id, vehicle_details_id FROM products WHERE name LIKE '%mat%'");
  console.log(`\nProducts with 'mat' in name: ${nameMatches.length}`);
  
  const catSummary = nameMatches.reduce((acc, p) => {
    acc[p.category_id] = (acc[p.category_id] || 0) + 1;
    return acc;
  }, {});
  console.log("Category breakdown for 'mat' products:", catSummary);

  // 2. Search subcategories
  const [subMatches] = await conn.query("SELECT id, name, category_id FROM subcategories WHERE name LIKE '%mat%' OR name LIKE '%7D%' OR name LIKE '%3D%'");
  console.log(`\nSubcategories with 'mat', '7D', or '3D': ${subMatches.length}`);
  subMatches.forEach(s => console.log(`  - [ID ${s.id}] ${s.name} (Cat ${s.category_id})`));

  // 3. Check for orphaned mats in product_vehicle_details
  // If products are mapped to vehicles but missing brand/model IDs in the product table itself
  const [pvdMatches] = await conn.query(`
    SELECT count(DISTINCT p.id) as count
    FROM products p
    JOIN product_vehicle_details pvd ON p.id = pvd.product_id
    WHERE p.category_id = 12
  `);
  console.log(`\nMats (Cat 12) products mapped in product_vehicle_details: ${pvdMatches[0].count}`);

  await conn.end();
}

run().catch(console.error);
