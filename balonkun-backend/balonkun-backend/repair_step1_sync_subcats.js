import db from './src/database/index.js';

const designs = [
  { id: 2, name: "Amaze Duo+" },
  { id: 1, name: "Amaze+" },
  { id: 9, name: "D3" },
  { id: 10, name: "D5" },
  { id: 3, name: "E1" },
  { id: 4, name: "E2" },
  { id: 6, name: "E4" },
  { id: 7, name: "E5" },
  { id: 15, name: "H-Cross" },
  { id: 60, name: "H-Grand" },
  { id: 24, name: "Navigation+" },
  { id: 54, name: "Q2" },
  { id: 79, name: "U-ACTIVE Bike" },
  { id: 81, name: "U-ACTIVE PLUS Bike" },
  { id: 76, name: "U-ACTIVE PLUS Scooter" },
  { id: 61, name: "U-Active Scooter" },
  { id: 57, name: "U-Arrow" },
  { id: 58, name: "U-Blade" },
  { id: 35, name: "U-CROSS Bike" },
  { id: 83, name: "U-DRIVE Bike" },
  { id: 16, name: "U-Focus" },
  { id: 11, name: "U-Highway" },
  { id: 14, name: "U-Impress" },
  { id: 78, name: "U-IMPRESS Bike" },
  { id: 82, name: "U-IMPRESS EVS" },
  { id: 77, name: "U-IMPRESS Scooter" },
  { id: 12, name: "U-Joy" },
  { id: 59, name: "U-Ladder" },
  { id: 13, name: "U-Pat" },
  { id: 63, name: "U-Sportz Bike" },
  { id: 64, name: "U-Sportz Scooter" },
  { id: 55, name: "U-Volt" },
  { id: 56, name: "Xclusive" },
  { id: 26, name: "Xclusive+" }
];

async function sync() {
    console.log("=== PHASE 1: SUBCATEGORY SYNC ===\n");
    try {
        const catId = 10;
        for (const design of designs) {
            // Check if subcategory already exists with this name (case-insensitive)
            const existing = await db.subcategories.findOne({ 
                where: { name: design.name, category_id: catId } 
            });

            if (!existing) {
                // Also check with trimmed name
                const trimmed = await db.subcategories.findOne({ 
                    where: { name: design.name.trim(), category_id: catId } 
                });
                
                if (!trimmed) {
                    const sub = await db.subcategories.create({
                        name: design.name,
                        category_id: catId,
                        canonical: design.name.toLowerCase().replace(/\s+/g, '-').replace(/[+]/g, 'plus')
                    });
                    console.log(`✅ Created Subcategory: "${design.name}" [SubID: ${sub.id}]`);
                } else {
                    console.log(`⚠️  Subcategory exists (trimmed): "${design.name}" [SubID: ${trimmed.id}]`);
                }
            } else {
                console.log(`⚠️  Subcategory exists: "${design.name}" [SubID: ${existing.id}]`);
            }
        }
    } catch (e) { 
        console.error("❌ Sync Error:", e); 
    }
    process.exit(0);
}
sync();
