import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== COMPREHENSIVE SEO AUDIT: MISSING MODEL-LEVEL RECORDS ===");

// 1. Get all active Category/Brand/Model triplets from the products table
// Based on product schema: category_id, brand_id, vehicle_details_id
// We need to join vehicle_details to get the true model_id
const [activeTriplets] = await conn.query(`
  SELECT DISTINCT p.category_id as product_category_id, p.brand_id as vehicle_brand_id, vd.model_id as vehicle_model_id
  FROM products p
  JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  WHERE p.brand_id IS NOT NULL 
    AND vd.model_id IS NOT NULL
`);

// 2. Get all existing mappings from seo_data_mappings
const [existingMappings] = await conn.query(`
  SELECT product_category_id, vehicle_brand_id, vehicle_model_id
  FROM seo_data_mappings
  WHERE vehicle_model_id IS NOT NULL 
    AND url IS NULL
`);

const mappingSet = new Set(existingMappings.map(m => 
  `${m.product_category_id}_${m.vehicle_brand_id}_${m.vehicle_model_id}`
));

const missing = [];
for (const triplet of activeTriplets) {
    const key = `${triplet.product_category_id}_${triplet.vehicle_brand_id}_${triplet.vehicle_model_id}`;
    if (!mappingSet.has(key)) {
        missing.push(triplet);
    }
}

console.log(`Summary:`);
console.log(`- Total Unique (Cat/Brand/Model) in Products: ${activeTriplets.length}`);
console.log(`- Total Existing Mapping Records: ${existingMappings.length}`);
console.log(`- TOTAL MISSING MODEL-LEVEL MAPPINGS: ${missing.length}`);

// Sample missing records for reporting
if (missing.length > 0) {
    console.log("\nSample Missing Records:");
    for (let i = 0; i < Math.min(missing.length, 5); i++) {
        console.log(`  Cat: ${missing[i].product_category_id}, Brand: ${missing[i].vehicle_brand_id}, Model: ${missing[i].vehicle_model_id}`);
    }
}

await conn.end();
