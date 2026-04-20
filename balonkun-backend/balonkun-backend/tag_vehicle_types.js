import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== VEHICLE TYPE TAGGING — Accessories & Mats ===\n");

// ── 4W CAR ACCESSORIES ───────────────────────────────────────────────────────
const car4w_accessory_ids = [
  8985, 8986, 8987, 8988, 8989,
  9231, 9232, 9233, 9234, 9235,
  9236, 9237, 9238, 9239, 9241, 9243,
  9244, 9245, 9246, 9247, 9248,
  9249, 9250, 9251, 9252, 9253, 9254,
  9255, 9256, 9257, 9258, 9259, 9260,
  9261, 9262, 9263, 9264, 9265,
  9266, 9267, 9268,
  9983,
  10007, 10008, 10009,
  10010, 10011, 10012,
  10013, 10014,
  10015, 10016, 10017, 10018,
  10019, 10020,
  10032, 10033, 10037
];

const [r1] = await conn.query(`
  UPDATE products SET vehicle_type_id = 2
  WHERE id IN (${car4w_accessory_ids.join(',')})
`);
console.log(`✅ 4W Accessories tagged: ${r1.affectedRows} products (vehicle_type_id = 2)`);

// ── 4W CAR MATS ──────────────────────────────────────────────────────────────
const car4w_mat_ids = [9210, 9211, 9982, 9984, 9985, 9986, 10036];

const [r2] = await conn.query(`
  UPDATE products SET vehicle_type_id = 2
  WHERE id IN (${car4w_mat_ids.join(',')})
`);
console.log(`✅ 4W Mats tagged:        ${r2.affectedRows} products (vehicle_type_id = 2)`);

// ── 2W ACCESSORIES ───────────────────────────────────────────────────────────
const bike2w_accessory_ids = [
  9990, 9992, 9993, 9994, 9995, 9996,
  9997, 9998, 9999, 10000, 10001, 10035
];

const [r3] = await conn.query(`
  UPDATE products SET vehicle_type_id = 1
  WHERE id IN (${bike2w_accessory_ids.join(',')})
`);
console.log(`✅ 2W Accessories tagged: ${r3.affectedRows} products (vehicle_type_id = 1)`);

// ── 2W MATS ──────────────────────────────────────────────────────────────────
const bike2w_mat_ids = [9991];

const [r4] = await conn.query(`
  UPDATE products SET vehicle_type_id = 1
  WHERE id IN (${bike2w_mat_ids.join(',')})
`);
console.log(`✅ 2W Mats tagged:        ${r4.affectedRows} products (vehicle_type_id = 1)`);

// ── TAG vehicle_details ROWS TOO ─────────────────────────────────────────────
// vdid:229 = null-brand car accessories
const [r5] = await conn.query(`UPDATE vehicle_details SET vehicle_type_id = 2 WHERE id = 229`);
console.log(`✅ VD 229 (null/car)      tagged: ${r5.affectedRows} row (vehicle_type_id = 2)`);

// vdid:277, 279, 280 = Universal brand car accessories  
const [r6] = await conn.query(`UPDATE vehicle_details SET vehicle_type_id = 2 WHERE id IN (277, 279, 280)`);
console.log(`✅ VD 277/279/280 (Universal) tagged: ${r6.affectedRows} rows (vehicle_type_id = 2)`);

// vdid:654 = 2W universal accessories
const [r7] = await conn.query(`UPDATE vehicle_details SET vehicle_type_id = 1 WHERE id = 654`);
console.log(`✅ VD 654 (2W universal)  tagged: ${r7.affectedRows} row (vehicle_type_id = 1)`);

// ── VERIFY ───────────────────────────────────────────────────────────────────
console.log("\n=== VERIFICATION ===");

const [check1] = await conn.query(`
  SELECT vehicle_type_id, COUNT(*) as cnt
  FROM products
  WHERE id IN (${[...car4w_accessory_ids, ...car4w_mat_ids, ...bike2w_accessory_ids, ...bike2w_mat_ids].join(',')})
  GROUP BY vehicle_type_id
`);
console.log("\nProduct vehicle_type_id distribution after update:");
check1.forEach(r => console.log(`  vehicle_type_id: ${r.vehicle_type_id} → ${r.cnt} products`));

const [remaining0] = await conn.query(`
  SELECT COUNT(*) as cnt FROM products
  WHERE id IN (${[...car4w_accessory_ids, ...car4w_mat_ids, ...bike2w_accessory_ids, ...bike2w_mat_ids].join(',')})
  AND vehicle_type_id = 0
`);
console.log(`\n  Products still at vehicle_type_id=0: ${remaining0[0].cnt} (should be 0)`);

await conn.end();
console.log("\n✅ Done! All accessories and mats are now correctly tagged.");
