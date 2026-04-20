import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== CATEGORIES ===");
const [cats] = await conn.query("SELECT id, name FROM categories ORDER BY id");
cats.forEach(c => console.log(`  ${c.id}: ${c.name}`));

console.log("\n=== ACCESSORIES VEHICLE MAPPING (grouped) ===");
const [accMap] = await conn.query(`
  SELECT 
    COALESCE(b.name, 'NULL_BRAND') as brand_name,
    COALESCE(bm.name, 'NULL_MODEL') as model_name,
    vd.brand_id, vd.model_id,
    COUNT(p.id) as cnt
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Accessor%')
  GROUP BY vd.brand_id, vd.model_id, b.name, bm.name
  ORDER BY b.name, bm.name
`);
accMap.forEach(r => console.log(`  ${r.brand_name}(${r.brand_id}) > ${r.model_name}(${r.model_id}) => ${r.cnt} products`));

console.log("\n=== MATS VEHICLE MAPPING (grouped) ===");
const [matMap] = await conn.query(`
  SELECT 
    COALESCE(b.name, 'NULL_BRAND') as brand_name,
    COALESCE(bm.name, 'NULL_MODEL') as model_name,
    vd.brand_id, vd.model_id,
    COUNT(p.id) as cnt
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Mat%')
  GROUP BY vd.brand_id, vd.model_id, b.name, bm.name
  ORDER BY b.name, bm.name
`);
matMap.forEach(r => console.log(`  ${r.brand_name}(${r.brand_id}) > ${r.model_name}(${r.model_id}) => ${r.cnt} products`));

console.log("\n=== ACCESSORY PRODUCTS LIST (visible, with vehicle_type) ===");
const [accList] = await conn.query(`
  SELECT p.id, p.name, p.vehicle_type_id, p.vehicle_details_id,
         vd.brand_id, vd.model_id, vd.vehicle_type_id as vd_vtype
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Accessor%')
  AND p.is_hide = 0
  ORDER BY p.vehicle_type_id, p.id
`);
accList.forEach(r => console.log(`  [${r.id}] vtype:${r.vehicle_type_id} vdid:${r.vehicle_details_id} brand:${r.brand_id} model:${r.model_id} - ${r.name}`));

console.log("\n=== HOW MANY UNIQUE vehicle_details entries exist? ===");
const [vdCount] = await conn.query(`SELECT COUNT(*) as cnt FROM vehicle_details`);
console.log(`  Total vehicle_details rows: ${vdCount[0].cnt}`);

console.log("\n=== SAMPLE vehicle_details with brand+model for 4W ===");
const [vdSample] = await conn.query(`
  SELECT vd.id, vd.vehicle_type_id, vd.brand_id, vd.model_id, b.name as brand, bm.name as model
  FROM vehicle_details vd
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE vd.vehicle_type_id = 2
  ORDER BY b.name, bm.name
  LIMIT 30
`);
vdSample.forEach(r => console.log(`  VD_ID:${r.id} => ${r.brand}(${r.brand_id}) > ${r.model}(${r.model_id})`));

await conn.end();
