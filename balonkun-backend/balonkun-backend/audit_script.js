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
console.table(cats);

console.log("\n=== 2. VEHICLE TYPES ===");
const [vtypes] = await conn.query("SELECT id, name FROM vehicle_types ORDER BY id");
console.table(vtypes);

console.log("\n=== 3. ALL BRANDS (with vehicle_type_id) ===");
const [brands] = await conn.query("SELECT id, name, vehicle_type_id FROM brands ORDER BY vehicle_type_id, name");
console.table(brands);

console.log("\n=== 4. PRODUCT COUNT BY CATEGORY ===");
const [prodByCat] = await conn.query(`
  SELECT c.id, c.name, COUNT(p.id) as product_count
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id
  GROUP BY c.id, c.name
  ORDER BY c.id
`);
console.table(prodByCat);

console.log("\n=== 5. CURRENT ACCESSORY PRODUCTS (4W) - vehicle_details mapping ===");
const [acc4w] = await conn.query(`
  SELECT p.id as product_id, p.name as product_name, p.category_id,
         p.vehicle_type_id, p.vehicle_details_id,
         vd.brand_id, vd.model_id, vd.vehicle_type_id as vd_vehicle_type_id,
         b.name as brand_name, bm.name as model_name
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Accessor%')
  ORDER BY p.id
  LIMIT 50
`);
console.table(acc4w);

console.log("\n=== 6. HOW MANY ACCESSORIES HAVE NULL/0 brand_id (Universal) ===");
const [accUniv] = await conn.query(`
  SELECT 
    COUNT(*) as total_accessories,
    SUM(CASE WHEN vd.brand_id IS NULL OR vd.brand_id = 0 THEN 1 ELSE 0 END) as universal_count,
    SUM(CASE WHEN vd.brand_id IS NOT NULL AND vd.brand_id > 0 THEN 1 ELSE 0 END) as specific_count
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Accessor%')
`);
console.table(accUniv);

console.log("\n=== 7. MATS PRODUCTS - vehicle_details mapping ===");
const [mats] = await conn.query(`
  SELECT p.id as product_id, p.name as product_name, p.category_id,
         p.vehicle_type_id, p.vehicle_details_id,
         vd.brand_id, vd.model_id,
         b.name as brand_name, bm.name as model_name
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Mat%')
  ORDER BY p.id
  LIMIT 50
`);
console.table(mats);

console.log("\n=== 8. 4W BRANDS WITH THEIR MODEL COUNTS ===");
const [brands4w] = await conn.query(`
  SELECT b.id as brand_id, b.name as brand_name, COUNT(bm.id) as model_count
  FROM brands b
  LEFT JOIN brand_models bm ON bm.brand_id = b.id
  WHERE b.vehicle_type_id = (SELECT id FROM vehicle_types WHERE name LIKE '%4%' LIMIT 1)
  GROUP BY b.id, b.name
  ORDER BY b.name
`);
console.table(brands4w);

console.log("\n=== 9. SAMPLE: How seat covers are mapped (first 20) ===");
const [seatCovers] = await conn.query(`
  SELECT p.id as product_id, p.name as product_name, 
         vd.brand_id, vd.model_id, vd.vehicle_type_id,
         b.name as brand_name, bm.name as model_name
  FROM products p
  LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Seat Cover%')
  AND vd.brand_id IS NOT NULL AND vd.brand_id > 0
  ORDER BY b.name, bm.name
  LIMIT 20
`);
console.table(seatCovers);

console.log("\n=== 10. DISTINCT BRANDS THAT HAVE SEAT COVERS (4W) ===");
const [scBrands] = await conn.query(`
  SELECT DISTINCT b.id as brand_id, b.name as brand_name
  FROM products p
  JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  JOIN brands b ON vd.brand_id = b.id
  WHERE p.category_id IN (SELECT id FROM categories WHERE name LIKE '%Seat Cover%')
  AND b.vehicle_type_id = (SELECT id FROM vehicle_types WHERE name LIKE '%4%' LIMIT 1)
  ORDER BY b.name
`);
console.table(scBrands);

await conn.end();
console.log("\nDone!");
