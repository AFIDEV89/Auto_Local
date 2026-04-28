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
const [activeTriplets] = await conn.query(`
  SELECT DISTINCT product_category_id, vehicle_brand_id, vehicle_model_id
  FROM products
  WHERE vehicle_brand_id IS NOT NULL 
    AND vehicle_model_id IS NOT NULL
    AND vehicle_model_id != 0
`);

// 2. Get all existing mappings from seo_data_mappings
const [existingMappings] = await conn.query(`
  SELECT product_category_id, vehicle_brand_id, vehicle_model_id
  FROM seo_data_mappings
  WHERE vehicle_model_id IS NOT NULL AND url IS NULL
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
console.log(`- Total Unique (Cat/Brand/Model) in Catalog: ${activeTriplets.length}`);
console.log(`- Total Existing Mappings in DB: ${existingMappings.length}`);
console.log(`- TOTAL MISSING MODEL-LEVEL MAPPINGS: ${missing.length}`);

// Breakdown by category
const breakdown = missing.reduce((acc, curr) => {
    acc[curr.product_category_id] = (acc[curr.product_category_id] || 0) + 1;
    return acc;
}, {});

console.log("\nBreakdown of Missing Records by Category ID:");
Object.entries(breakdown).forEach(([cat, count]) => {
    console.log(`  Cat ${cat}: ${count} missing`);
});

await conn.end();
