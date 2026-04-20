import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

// 1. Check what SEO entries currently exist
const [allSeo] = await conn.query(`
  SELECT sdm.id, sdm.product_category_id, sdm.vehicle_category_id, 
         sdm.vehicle_brand_id, sdm.vehicle_model_id,
         sdm.seo_page_title, sdm.category_text,
         pc.name as category_name, b.name as brand_name, bm.name as model_name
  FROM seo_data_mappings sdm
  LEFT JOIN categories pc ON sdm.product_category_id = pc.id
  LEFT JOIN brands b ON sdm.vehicle_brand_id = b.id
  LEFT JOIN brand_models bm ON sdm.vehicle_model_id = bm.id
  WHERE sdm.url IS NULL
  ORDER BY sdm.product_category_id, sdm.vehicle_brand_id, sdm.vehicle_model_id
`);

console.log(`=== ALL SEO ENTRIES (url IS NULL): ${allSeo.length} total ===\n`);

// Group by type
const brandOnly = allSeo.filter(r => r.vehicle_brand_id && !r.vehicle_model_id);
const brandModel = allSeo.filter(r => r.vehicle_brand_id && r.vehicle_model_id);
const categoryOnly = allSeo.filter(r => !r.vehicle_brand_id && !r.vehicle_model_id);

console.log(`Category-only entries: ${categoryOnly.length}`);
categoryOnly.forEach(r => console.log(`  [${r.id}] cat: ${r.category_name} | title: ${r.seo_page_title}`));

console.log(`\nBrand-only entries (NO model): ${brandOnly.length}`);
brandOnly.forEach(r => console.log(`  [${r.id}] ${r.category_name} > ${r.brand_name} | title: ${r.seo_page_title}`));

console.log(`\nBrand+Model entries: ${brandModel.length}`);
brandModel.forEach(r => console.log(`  [${r.id}] ${r.category_name} > ${r.brand_name} > ${r.model_name} | title: ${r.seo_page_title}`));

// 2. Check which brands have brand+model entries but NO brand-only entry
console.log("\n=== BRANDS MISSING BRAND-ONLY SEO ENTRIES ===");
const brandModelCategories = {};
for (const r of brandModel) {
  const key = `${r.product_category_id}_${r.vehicle_brand_id}`;
  if (!brandModelCategories[key]) {
    brandModelCategories[key] = { category: r.category_name, brand: r.brand_name, catId: r.product_category_id, brandId: r.vehicle_brand_id, vcId: r.vehicle_category_id };
  }
}

const brandOnlySet = new Set(brandOnly.map(r => `${r.product_category_id}_${r.vehicle_brand_id}`));

const missingBrandOnly = [];
for (const [key, val] of Object.entries(brandModelCategories)) {
  if (!brandOnlySet.has(key)) {
    missingBrandOnly.push(val);
    console.log(`  MISSING: ${val.category} > ${val.brand} (cat:${val.catId}, brand:${val.brandId})`);
  }
}
console.log(`\nTotal missing brand-only entries: ${missingBrandOnly.length}`);

// 3. Get ALL 4W brands that have products
const [allBrands4w] = await conn.query(`SELECT id, name FROM brands WHERE vehicle_type_id = 2 ORDER BY name`);
console.log(`\n=== ALL 4W BRANDS: ${allBrands4w.length} ===`);

// Check which 4W brands have ANY SEO entry at all
const brandsWithSeo = new Set(allSeo.map(r => r.vehicle_brand_id).filter(Boolean));
const brandsWithoutAnySeo = allBrands4w.filter(b => !brandsWithSeo.has(b.id));
console.log(`Brands with NO SEO at all: ${brandsWithoutAnySeo.length}`);
brandsWithoutAnySeo.forEach(b => console.log(`  ${b.id}: ${b.name}`));

// 4. Get category IDs for Seat Covers, Accessories, Mats
const [cats] = await conn.query(`SELECT id, name FROM categories WHERE name IN ('Seat Covers', 'Accessories', 'Mats') ORDER BY id`);
console.log(`\n=== CATEGORY IDS ===`);
cats.forEach(c => console.log(`  ${c.id}: ${c.name}`));

await conn.end();
