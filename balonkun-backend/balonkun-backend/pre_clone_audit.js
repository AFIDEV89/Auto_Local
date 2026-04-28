import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

// ============================================================
// STEP 1: Get the vehicle_type_id for 4W
// ============================================================
const [vtypes] = await conn.query("SELECT id, name FROM vehicle_types ORDER BY id");
console.log("=== VEHICLE TYPES ===");
vtypes.forEach(v => console.log(`  ${v.id}: ${v.name}`));

// ============================================================
// STEP 2: Get the ACCESSORY category IDs
// ============================================================
const [accCats] = await conn.query("SELECT id, name FROM categories WHERE name LIKE '%Accessor%'");
console.log("\n=== ACCESSORY CATEGORIES ===");
accCats.forEach(c => console.log(`  ${c.id}: ${c.name}`));

// ============================================================
// STEP 3: Get the MAT category IDs
// ============================================================
const [matCats] = await conn.query("SELECT id, name FROM categories WHERE name LIKE '%Mat%'");
console.log("\n=== MAT CATEGORIES ===");
matCats.forEach(c => console.log(`  ${c.id}: ${c.name}`));

// ============================================================
// STEP 4: All 4W brands (with vehicle_type)
// ============================================================
const [brands4w] = await conn.query(`
  SELECT id, name, vehicle_type_id 
  FROM brands 
  WHERE vehicle_type_id = 2
  ORDER BY name
`);
console.log("\n=== 4W BRANDS ===");
brands4w.forEach(b => console.log(`  brand_id:${b.id} - ${b.name}`));

// ============================================================
// STEP 5: All 4W brand-model combinations
// ============================================================
const [models4w] = await conn.query(`
  SELECT bm.id as model_id, bm.name as model_name, bm.brand_id, b.name as brand_name
  FROM brand_models bm
  JOIN brands b ON bm.brand_id = b.id
  WHERE bm.vehicle_type_id = 2 OR b.vehicle_type_id = 2
  ORDER BY b.name, bm.name
`);
console.log(`\n=== 4W BRAND-MODEL COMBOS: ${models4w.length} total ===`);
models4w.forEach(m => console.log(`  brand:${m.brand_id}(${m.brand_name}) > model:${m.model_id}(${m.model_name})`));

// ============================================================
// STEP 6: Universal/null-brand accessories (the products to clone)
// ============================================================
const accCatIds = accCats.map(c => c.id);
const [univAccs] = await conn.query(`
  SELECT p.id, p.name, p.category_id, p.subcategory_id, p.vehicle_details_id,
         p.original_price, p.discounted_price, p.availability, p.vehicle_type_id,
         p.is_latest, p.is_trending, p.is_hide,
         p.pictures, p.detail, p.description, p.tags, p.product_code,
         vd.brand_id, vd.model_id, vd.vehicle_type_id as vd_vtype
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  WHERE p.category_id IN (${accCatIds.join(',')})
  AND  p.is_hide = 0
  AND (vd.brand_id IS NULL OR vd.brand_id = 0 OR vd.brand_id = 38)
  AND p.id != 9229
  ORDER BY p.id
`);
console.log(`\n=== ACCESSORIES TO CLONE (Universal/Null brand): ${univAccs.length} total ===`);
univAccs.forEach(p => console.log(`  [${p.id}] brand:${p.brand_id} model:${p.model_id} - ${p.name}`));

// ============================================================
// STEP 7: Universal/null-brand mats (the products to clone)
// ============================================================
const matCatIds = matCats.map(c => c.id);
const [univMats] = await conn.query(`
  SELECT p.id, p.name, p.category_id, p.subcategory_id, p.vehicle_details_id,
         p.original_price, p.discounted_price, p.availability, p.vehicle_type_id,
         p.is_latest, p.is_trending, p.is_hide,
         p.pictures, p.detail, p.description, p.tags, p.product_code,
         vd.brand_id, vd.model_id
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  WHERE p.category_id IN (${matCatIds.join(',')})
  AND  p.is_hide = 0
  AND (vd.brand_id IS NULL OR vd.brand_id = 0 OR vd.brand_id = 38)
  ORDER BY p.id
`);
// Exclude scooty mat
const carMats = univMats.filter(m => !m.name.toLowerCase().includes('scooty'));
console.log(`\n=== CAR MATS TO CLONE: ${carMats.length} total ===`);
carMats.forEach(p => console.log(`  [${p.id}] - ${p.name}`));

// ============================================================
// STEP 8: Check existing vehicle_details for each 4W brand+model
// Tells us which VD rows already exist that we can REUSE
// ============================================================
console.log(`\n=== CHECKING EXISTING vehicle_details for 4W brand+model ===`);
const existingVDs = {};
for (const m of models4w) {
  const [rows] = await conn.query(
    `SELECT id FROM vehicle_details WHERE brand_id = ? AND model_id = ? AND vehicle_type_id = 2 LIMIT 1`,
    [m.brand_id, m.model_id]
  );
  if (rows.length > 0) {
    existingVDs[`${m.brand_id}_${m.model_id}`] = rows[0].id;
    console.log(`  EXISTS vd_id:${rows[0].id} for ${m.brand_name} > ${m.model_name}`);
  } else {
    console.log(`  MISSING - ${m.brand_name}(${m.brand_id}) > ${m.model_name}(${m.model_id})`);
  }
}

const existingCount = Object.keys(existingVDs).length;
const missingCount = models4w.length - existingCount;
console.log(`\n  Summary: ${existingCount} existing VD rows, ${missingCount} need creating`);

// ============================================================
// STEP 9: Also check 2W data
// ============================================================
const [brands2w] = await conn.query(`SELECT id, name FROM brands WHERE vehicle_type_id = 1 ORDER BY name`);
console.log(`\n=== 2W BRANDS: ${brands2w.length} total ===`);
brands2w.forEach(b => console.log(`  ${b.id}: ${b.name}`));

const [models2w] = await conn.query(`
  SELECT bm.id as model_id, bm.name as model_name, bm.brand_id, b.name as brand_name
  FROM brand_models bm JOIN brands b ON bm.brand_id = b.id
  WHERE bm.vehicle_type_id = 1 OR b.vehicle_type_id = 1
  ORDER BY b.name, bm.name
`);
console.log(`  Total 2W models: ${models2w.length}`);

// Accessories with 2W universal mapping
const [univ2wAccs] = await conn.query(`
  SELECT p.id, p.name
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  WHERE p.category_id IN (${accCatIds.join(',')})
  AND p.is_hide = 0
  AND vd.id = 654
  ORDER BY p.id
`);
console.log(`\n=== 2W ACCESSORIES TO CLONE: ${univ2wAccs.length} total ===`);
univ2wAccs.forEach(p => console.log(`  [${p.id}] - ${p.name}`));

const scootypMat2w = univMats.filter(m => m.name.toLowerCase().includes('scooty'));
console.log(`\n=== 2W MATS TO CLONE: ${scootypMat2w.length} total ===`);
scootypMat2w.forEach(p => console.log(`  [${p.id}] - ${p.name}`));

await conn.end();
console.log("\n=== PRE-CLONE AUDIT COMPLETE ===");
