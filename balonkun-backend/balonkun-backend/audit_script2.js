import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== 1. ALL PRODUCT CATEGORIES ===");
const [cats] = await conn.query("SELECT id, name FROM categories ORDER BY id");
cats.forEach(c => console.log(`  Cat ID ${c.id}: ${c.name}`));

console.log("\n=== 2. VEHICLE TYPES ===");
const [vtypes] = await conn.query("SELECT id, name FROM vehicle_types ORDER BY id");
vtypes.forEach(v => console.log(`  VType ID ${v.id}: ${v.name}`));

console.log("\n=== 3. PRODUCT COUNT BY CATEGORY ===");
const [prodByCat] = await conn.query(`
  SELECT c.id, c.name, COUNT(p.id) as cnt
  FROM categories c LEFT JOIN products p ON p.category_id = c.id
  GROUP BY c.id, c.name ORDER BY c.id
`);
prodByCat.forEach(r => console.log(`  [${r.id}] ${r.name}: ${r.cnt} products`));

console.log("\n=== 4. ACCESSORIES - Current Vehicle Detail Mapping ===");
const [accMap] = await conn.query(`
  SELECT 
    COALESCE(b.name, 'NULL/Universal') as brand_name,
    COALESCE(bm.name, 'NULL') as model_name,
    vd.brand_id, vd.model_id,
    COUNT(p.id) as product_count
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Accessor%')
  GROUP BY vd.brand_id, vd.model_id, b.name, bm.name
  ORDER BY b.name, bm.name
`);
accMap.forEach(r => console.log(`  Brand: ${r.brand_name} (ID:${r.brand_id}) | Model: ${r.model_name} (ID:${r.model_id}) => ${r.product_count} products`));

console.log("\n=== 5. MATS - Current Vehicle Detail Mapping ===");
const [matMap] = await conn.query(`
  SELECT 
    COALESCE(b.name, 'NULL/Universal') as brand_name,
    COALESCE(bm.name, 'NULL') as model_name,
    vd.brand_id, vd.model_id,
    COUNT(p.id) as product_count
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Mat%')
  GROUP BY vd.brand_id, vd.model_id, b.name, bm.name
  ORDER BY b.name, bm.name
`);
matMap.forEach(r => console.log(`  Brand: ${r.brand_name} (ID:${r.brand_id}) | Model: ${r.model_name} (ID:${r.model_id}) => ${r.product_count} products`));

console.log("\n=== 6. DISTINCT ACCESSORY PRODUCT NAMES (unique items to map) ===");
const [accNames] = await conn.query(`
  SELECT DISTINCT p.id, p.name, p.vehicle_type_id
  FROM products p
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Accessor%')
  AND p.is_hide = 0
  ORDER BY p.vehicle_type_id, p.name
`);
accNames.forEach(r => console.log(`  [ID:${r.id}] VType:${r.vehicle_type_id} - ${r.name}`));

console.log("\n=== 7. DISTINCT MAT PRODUCT NAMES ===");
const [matNames] = await conn.query(`
  SELECT DISTINCT p.id, p.name, p.vehicle_type_id
  FROM products p
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Mat%')
  AND p.is_hide = 0
  ORDER BY p.vehicle_type_id, p.name
`);
matNames.forEach(r => console.log(`  [ID:${r.id}] VType:${r.vehicle_type_id} - ${r.name}`));

console.log("\n=== 8. ALL 4W BRAND MODELS (targets for mapping) ===");
const [models4w] = await conn.query(`
  SELECT b.id as brand_id, b.name as brand_name, bm.id as model_id, bm.name as model_name
  FROM brands b
  JOIN brand_models bm ON bm.brand_id = b.id
  WHERE b.vehicle_type_id = (SELECT id FROM vehicle_types WHERE name LIKE '%4%' LIMIT 1)
  ORDER BY b.name, bm.name
`);
models4w.forEach(r => console.log(`  ${r.brand_name} > ${r.model_name} (brand:${r.brand_id}, model:${r.model_id})`));

console.log("\n=== 9. vehicle_details TABLE STRUCTURE ===");
const [vdCols] = await conn.query("DESCRIBE vehicle_details");
vdCols.forEach(c => console.log(`  ${c.Field}: ${c.Type} ${c.Null} ${c.Key} ${c.Default}`));

console.log("\n=== 10. products TABLE - relevant columns ===");
const [pCols] = await conn.query("DESCRIBE products");
pCols.forEach(c => console.log(`  ${c.Field}: ${c.Type} ${c.Null} ${c.Key} ${c.Default}`));

await conn.end();
console.log("\nDone!");
