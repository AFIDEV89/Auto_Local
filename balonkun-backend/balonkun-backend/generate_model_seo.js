import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

console.log("=== GENERATING 109 MISSING MODEL-LEVEL SEO MAPPINGS ===");

// 1. Identify missing (Category, Brand, Model) triplets based on active products
const [missingEntries] = await conn.query(`
  SELECT DISTINCT p.category_id as product_category_id, p.brand_id as vehicle_brand_id, vd.model_id as vehicle_model_id, 
         c.name as category_name, b.name as brand_name, bm.name as model_name, vd.vehicle_type_id
  FROM products p
  JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
  JOIN categories c ON p.category_id = c.id
  JOIN brands b ON p.brand_id = b.id
  JOIN brand_models bm ON vd.model_id = bm.id
  LEFT JOIN seo_data_mappings sdm ON (
    sdm.product_category_id = p.category_id AND 
    sdm.vehicle_brand_id = p.brand_id AND 
    sdm.vehicle_model_id = vd.model_id AND
    sdm.url IS NULL
  )
  WHERE sdm.id IS NULL
`);

console.log(`Found ${missingEntries.length} entries to generate.`);

let count = 0;
for (const item of missingEntries) {
    const { product_category_id, vehicle_brand_id, vehicle_model_id, category_name, brand_name, model_name, vehicle_type_id } = item;
    
    const title = `${brand_name} ${model_name} ${category_name}`;
    const description = `Premium ${title} from Autoform. Best quality ${category_name.toLowerCase()} custom fit for your ${brand_name} ${model_name}.`;
    const slug = `${brand_name}-${model_name}-${category_name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoryText = `<h1>${title}</h1><p>${description}</p>`;

    try {
        await conn.query(`
            INSERT INTO seo_data_mappings 
            (product_category_id, vehicle_category_id, vehicle_brand_id, vehicle_model_id, seo_page_title, seo_page_description, category_text, url_text, canonical_url, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [product_category_id, vehicle_type_id, vehicle_brand_id, vehicle_model_id, title, description, categoryText, slug, slug]);
        
        console.log(`[Inserted] ${title}`);
        count++;
    } catch (e) {
        console.error(`[Error] Failed to insert ${title}:`, e.message);
    }
}

console.log(`\nDONE: Successfully generated ${count} model-level SEO records.`);
await conn.end();
