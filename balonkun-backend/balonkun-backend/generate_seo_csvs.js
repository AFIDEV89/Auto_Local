import mysql2 from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

// Helper to escape CSV fields
const escapeCSV = (text) => {
  if (!text) return '""';
  const escaped = text.toString().replace(/"/g, '""');
  return `"${escaped}"`;
};

// Helper to slugify (reusing logic from previous script)
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORIES = [
  { id: 10, name: 'Seat Covers', shortName: 'seat_covers' },
  { id: 11, name: 'Accessories', shortName: 'accessories' },
  { id: 12, name: 'Mats', shortName: 'mats' }
];

const VEHICLE_TYPES = [
  { id: 2, name: '4W', label: '4w' },
  { id: 1, name: '2W', label: '2w' }
];

async function generateCSVs() {
  console.log("=== STARTING PHASED SEO CSV GENERATION ===");

  // Fetch all models and brands
  const [models] = await conn.query(`
    SELECT bm.id, bm.name as model_name, bm.vehicle_type_id, b.name as brand_name, bm.brand_id
    FROM brand_models bm
    JOIN brands b ON bm.brand_id = b.id
    ORDER BY b.name, bm.name
  `);

  for (const vt of VEHICLE_TYPES) {
    const filteredModels = models.filter(m => m.vehicle_type_id === vt.id);
    console.log(`\nProcessing Phase: ${vt.name} (${filteredModels.length} models)...`);

    for (const cat of CATEGORIES) {
      const fileName = `seo_${vt.label}_${cat.shortName}.csv`;
      const filePath = path.join(process.cwd(), fileName);
      console.log(`- Generating ${fileName}...`);

      const rows = [
        ['Vehicle Type', 'Category', 'Brand', 'Model', 'Perfect Title', 'Optimized Description', 'Target URL Slug'].map(escapeCSV).join(',')
      ];

      for (const m of filteredModels) {
        let title = '';
        let desc = '';
        let slug = slugify(`${m.brand_name}-${m.model_name}-${cat.shortName}`);

        if (cat.id === 10) { // Seat Covers
          title = `Premium ${m.brand_name} ${m.model_name} Seat Covers | Custom Fit Luxury | Autoform India`;
          desc = `Transform your ${m.brand_name} ${m.model_name} interior with Autoform's premium custom-fit seat covers. Engineered for comfort, durability, and a flawless luxury fit.`;
        } else if (cat.id === 11) { // Accessories
          title = `Top ${m.brand_name} ${m.model_name} Accessories | Enhance Your Drive | Autoform India`;
          desc = `Explore the best exterior and interior accessories for your ${m.brand_name} ${m.model_name}. High-quality and stylish upgrades designed specifically for your vehicle.`;
        } else if (cat.id === 12) { // Mats
          title = `Custom ${m.brand_name} ${m.model_name} Car Mats | 7D & Anti-Slip Protection | Autoform India`;
          desc = `Keep your ${m.brand_name} ${m.model_name} floors spotless with Autoform's custom 7D car mats. All-weather protection, easy to clean, and perfectly tailored fit.`;
        }

        const row = [
          vt.name,
          cat.name,
          m.brand_name,
          m.model_name,
          title,
          desc,
          slug
        ].map(escapeCSV).join(',');
        
        rows.push(row);
      }

      fs.writeFileSync(filePath, rows.join('\n'));
    }
  }

  console.log("\nSUCCESS: All 6 CSV sheets generated in the workspace root.");
  console.log("- seo_4w_seat_covers.csv");
  console.log("- seo_4w_accessories.csv");
  console.log("- seo_4w_mats.csv");
  console.log("- seo_2w_seat_covers.csv");
  console.log("- seo_2w_accessories.csv");
  console.log("- seo_2w_mats.csv");
  
  await conn.end();
}

generateCSVs().catch(console.error);
