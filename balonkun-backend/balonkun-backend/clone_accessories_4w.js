/**
 * CLONE SCRIPT: Accessory & Mat Products → All 4W Brand/Model Combinations
 * 
 * Strategy:
 *  1. Identify "universal" car accessories (null/Universal brand, NOT bike products)
 *  2. For each one, insert a cloned product row pointing to each 4W vehicle_details ID
 *  3. Also clone product_variants for each cloned product
 *  4. Dry-run mode first — set DRY_RUN = false to execute
 */

import mysql2 from 'mysql2/promise';

const DRY_RUN = false; // ← SET TO FALSE TO ACTUALLY EXECUTE

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306,
  multipleStatements: false
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. Define the product IDs to clone
// ─────────────────────────────────────────────────────────────────────────────

// Pure 4W car accessories (universal brand:38 or null brand via vdid:229)
// Excludes: bike/scooty items (9990-10001, 10035) and specific-model body covers (9252,9253,9254)
const CAR_ACCESSORY_IDS = [
  8985, 8986, 8987, 8988, 8989,                                   // Chargers, screens, head lamp
  9232, 9233,                                                        // Car dusters
  9234, 9235,                                                        // Lumbar support (null brand)
  9236, 9237, 9238, 9239, 9241, 9243,                               // Cushions, lumber, neck (Universal brand)
  9244, 9245, 9246, 9247, 9248,                                     // Organizer, tray, travel pillow
  9249, 9250, 9251,                                                  // Padded covers, odour eliminator
  9255, 9256, 9257, 9258, 9259, 9260,                               // Tissue boxes eco curve
  9261, 9262, 9263, 9264, 9265,                                     // Quilting tissue boxes
  9266, 9267, 9268,                                                  // Orthopedic cushions neck/back/coccyx
  9231,                                                              // Neck rest memory foam (Ford brand but generic)
  9983,                                                              // 3-in-1 back seat cushion
  10007, 10008, 10009,                                               // Inflator, compressor, vacuum cleaner
  10010, 10011, 10012,                                               // Memory foam neckrest, armrest
  10013, 10014,                                                      // Lumbar L3 beige/black
  10015, 10016, 10017, 10018,                                       // Cup tissue holders
  10019, 10020,                                                      // Premium tissue box holders
  10032, 10033, 10037                                                // Ventilated seat, organiser, hanger
];

// 4W car mat IDs (all generic)
const CAR_MAT_IDS = [9211, 9982, 9984, 9985, 9986, 10036];

// ─────────────────────────────────────────────────────────────────────────────
// 2. Fetch all 4W vehicle_details — ALL of these already exist in DB
// ─────────────────────────────────────────────────────────────────────────────
const [vdRows] = await conn.query(`
  SELECT vd.id as vd_id, vd.brand_id, vd.model_id, vd.vehicle_type_id,
         b.name as brand_name, bm.name as model_name
  FROM vehicle_details vd
  LEFT JOIN brands b ON vd.brand_id = b.id
  LEFT JOIN brand_models bm ON vd.model_id = bm.id
  WHERE vd.vehicle_type_id = 2
    AND vd.brand_id IS NOT NULL
    AND vd.brand_id != 38
    AND vd.brand_id != 0
    AND vd.model_id IS NOT NULL
    AND vd.model_id != 0
  ORDER BY b.name, bm.name
`);

console.log(`\n✅ Found ${vdRows.length} target 4W vehicle_details rows`);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Fetch full source product data (accessories + mats)
// ─────────────────────────────────────────────────────────────────────────────
const allSourceIds = [...CAR_ACCESSORY_IDS, ...CAR_MAT_IDS];
const [sourceProducts] = await conn.query(
  `SELECT id, name, category_id, subcategory_id, vehicle_details_id,
          original_price, discounted_price, availability, vehicle_type_id,
          is_latest, is_trending, is_hide, pictures, detail, description,
          tags, suggestions, additional_info, product_code,
          seo_title, seo_canonical, seo_description, quantity
   FROM products
   WHERE id IN (${allSourceIds.join(',')})`,
);

console.log(`\n✅ Found ${sourceProducts.length} source products to clone`);
console.log(`   - Accessories: ${sourceProducts.filter(p => CAR_ACCESSORY_IDS.includes(p.id)).length}`);
console.log(`   - Mats: ${sourceProducts.filter(p => CAR_MAT_IDS.includes(p.id)).length}`);

// ─────────────────────────────────────────────────────────────────────────────
// 4. Fetch product_variants for each source product
// ─────────────────────────────────────────────────────────────────────────────
const [sourceVariants] = await conn.query(
  `SELECT id, product_id, design_id, material_id, major_color_id
   FROM product_variants
   WHERE product_id IN (${allSourceIds.join(',')})`,
);

const variantsByProductId = {};
for (const v of sourceVariants) {
  if (!variantsByProductId[v.product_id]) variantsByProductId[v.product_id] = [];
  variantsByProductId[v.product_id].push(v);
}

console.log(`\n✅ Found ${sourceVariants.length} source variants to clone`);

// ─────────────────────────────────────────────────────────────────────────────
// 5. Check if clones already exist (prevent duplicates)
// ─────────────────────────────────────────────────────────────────────────────
const [existingClones] = await conn.query(`
  SELECT vehicle_details_id, name 
  FROM products
  WHERE vehicle_details_id IN (${vdRows.map(v => v.vd_id).join(',')})
  AND name IN (${sourceProducts.map(p => conn.escape(p.name)).join(',')})
`);

const existingSet = new Set(existingClones.map(r => `${r.vehicle_details_id}::${r.name}`));
console.log(`\n⚠️  ${existingClones.length} clones already exist (will be skipped)`);

// ─────────────────────────────────────────────────────────────────────────────
// 6. Execute the cloning
// ─────────────────────────────────────────────────────────────────────────────
let totalInserted = 0;
let totalSkipped = 0;
let totalVariantsInserted = 0;
const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

for (const vd of vdRows) {
  for (const prod of sourceProducts) {
    const key = `${vd.vd_id}::${prod.name}`;
    if (existingSet.has(key)) {
      totalSkipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  [DRY-RUN] Would clone product [${prod.id}] "${prod.name}" → VD:${vd.vd_id} (${vd.brand_name} > ${vd.model_name})`);
      totalInserted++;
    } else {
      // Insert cloned product
      const [result] = await conn.query(`
        INSERT INTO products 
          (category_id, subcategory_id, vehicle_details_id, name, original_price, discounted_price,
           availability, vehicle_type_id, is_latest, is_trending, is_hide, pictures, detail, description,
           tags, suggestions, additional_info, product_code, quantity, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        prod.category_id, prod.subcategory_id, vd.vd_id, prod.name,
        prod.original_price, prod.discounted_price || 0, prod.availability || 'yes',
        vd.vehicle_type_id,
        prod.is_latest || 0, prod.is_trending || 0, 0, // is_hide = 0 (visible)
        prod.pictures ? JSON.stringify(prod.pictures) : null,
        prod.detail, prod.description,
        prod.tags ? JSON.stringify(prod.tags) : null,
        prod.suggestions ? JSON.stringify(prod.suggestions) : null,
        prod.additional_info, prod.product_code, prod.quantity || 0,
        now, now
      ]);

      const newProductId = result.insertId;
      totalInserted++;

      // Clone product variants
      const variants = variantsByProductId[prod.id] || [];
      for (const variant of variants) {
        await conn.query(`
          INSERT INTO product_variants 
            (product_id, design_id, material_id, major_color_id, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          newProductId, variant.design_id, variant.material_id,
          variant.major_color_id,
          now, now
        ]);
        totalVariantsInserted++;
      }
    }
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`MODE: ${DRY_RUN ? '🟡 DRY RUN (no changes made)' : '🟢 LIVE EXECUTION'}`);
console.log(`Products cloned:          ${totalInserted}`);
console.log(`Products skipped (exist): ${totalSkipped}`);
console.log(`Variants cloned:          ${totalVariantsInserted}`);
console.log(`Target VD rows:           ${vdRows.length}`);
console.log(`Source products:          ${sourceProducts.length}`);
console.log(`Expected total:           ${vdRows.length * sourceProducts.length}`);
console.log(`${'='.repeat(60)}`);

await conn.end();
