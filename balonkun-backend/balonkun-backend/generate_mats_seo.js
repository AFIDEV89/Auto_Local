import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

async function run() {
  console.log("=== BULK MATS SEO GENERATION (CATEGORY 12) ===");

  // Helper to slugify
  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // 1. GENERATE BRAND-LEVEL MAPPINGS (18 missing)
  const [missingBrands] = await conn.query(`
    SELECT b.id, b.name, b.vehicle_type_id 
    FROM brands b
    LEFT JOIN seo_data_mappings sdm ON (sdm.vehicle_brand_id = b.id AND sdm.product_category_id = 12 AND sdm.vehicle_model_id IS NULL)
    WHERE sdm.id IS NULL
  `);
  
  console.log(`\nGenerating ${missingBrands.length} Brand-level records...`);
  for (const b of missingBrands) {
    const title = `${b.name} Mats`;
    const desc = `Premium ${b.name} car floor mats from Autoform. Durable, stylish, and custom fit for your vehicle.`;
    let slug = slugify(`${b.name}-mats`);
    const categoryText = `<h1>${title}</h1><p>${desc}</p>`;

    try {
      await conn.query(`
        INSERT INTO seo_data_mappings 
        (product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, seo_page_description, category_text, url_text, canonical_url, createdAt, updatedAt)
        VALUES (12, ?, ?, NULL, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [b.vehicle_type_id || 2, b.id, title, desc, categoryText, slug, slug]);
      console.log(`[OK] Brand: ${b.name}`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
          // If duplicate slug, append ID
          slug = slugify(`${b.name}-${b.id}-mats`);
          await conn.query(`
            INSERT INTO seo_data_mappings 
            (product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, seo_page_description, category_text, url_text, canonical_url, createdAt, updatedAt)
            VALUES (12, ?, ?, NULL, ?, ?, ?, ?, ?, NOW(), NOW())
          `, [b.vehicle_type_id || 2, b.id, title, desc, categoryText, slug, slug]);
          console.log(`[OK-DUP] Brand: ${b.name} (Slug: ${slug})`);
      } else {
          throw e;
      }
    }
  }

  // 2. GENERATE MODEL-LEVEL MAPPINGS (474 missing)
  const [missingModels] = await conn.query(`
    SELECT bm.id, bm.name as model_name, bm.vehicle_type_id, b.name as brand_name, bm.brand_id
    FROM brand_models bm
    JOIN brands b ON bm.brand_id = b.id
    LEFT JOIN seo_data_mappings sdm ON (sdm.vehicle_model_id = bm.id AND sdm.product_category_id = 12)
    WHERE sdm.id IS NULL
  `);

  console.log(`\nGenerating ${missingModels.length} Model-level records...`);
  for (const m of missingModels) {
    const title = `${m.brand_name} ${m.model_name} Mats`;
    const desc = `Premium ${m.brand_name} ${m.model_name} custom fit car floor mats. High quality materials and perfect fit guaranteed by Autoform.`;
    let slug = slugify(`${m.brand_name}-${m.model_name}-mats`);
    const categoryText = `<h1>${title}</h1><p>${desc}</p>`;

    try {
      await conn.query(`
        INSERT INTO seo_data_mappings 
        (product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, seo_page_description, category_text, url_text, canonical_url, createdAt, updatedAt)
        VALUES (12, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [m.vehicle_type_id || 2, m.brand_id, m.id, title, desc, categoryText, slug, slug]);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
          slug = slugify(`${m.brand_name}-${m.model_name}-${m.id}-mats`);
          await conn.query(`
            INSERT INTO seo_data_mappings 
            (product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, seo_page_description, category_text, url_text, canonical_url, createdAt, updatedAt)
            VALUES (12, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `, [m.vehicle_type_id || 2, m.brand_id, m.id, title, desc, categoryText, slug, slug]);
      } else {
          console.error(`[FAIL] ${title}: ${e.message}`);
      }
    }
  }

  console.log(`\nCOMPLETED: Successfully generated all missing Mats SEO mappings.`);
  await conn.end();
}

run().catch(console.error);
