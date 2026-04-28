import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

async function audit() {
    let output = "=== COMPREHENSIVE HIERARCHY AUDIT (STAGING/LOCAL) ===\n\n";

    try {
        // 1. Categories
        const categories = await db.categories.findAll({ logging: false });
        for (const cat of categories) {
            output += `📂 CATEGORY [${cat.id}]: "${cat.name}"\n`;

            // 2. Official Subcategories
            const subcats = await db.subcategories.findAll({ 
                where: { category_id: cat.id },
                logging: false 
            });
            
            if (subcats.length > 0) {
                output += "   🔍 Official Subcategories:\n";
                for (const sub of subcats) {
                    const count = await db.products.count({ where: { subcategory_id: sub.id }, logging: false });
                    output += `      ├── [SubID: ${sub.id}] "${sub.name}" (${count} products)\n`;
                }
            }

            // 3. Special Case: Category 10 (Seat Covers) uses Designs as Sub-levels
            if (cat.id === 10) {
                output += "   🎨 Design-based Sub-levels (Linked via Variants):\n";
                
                // Get all variants for products in this category
                const variants = await db.productVariants.findAll({
                    include: [
                        { model: db.products, where: { category_id: 10 }, attributes: [] },
                        { model: db.designs, attributes: ['id', 'name'] }
                    ],
                    logging: false
                });

                const designCounts = {};
                for (const v of variants) {
                    const dName = v.design ? v.design.name : 'Unknown Design';
                    designCounts[dName] = (designCounts[dName] || 0) + 1;
                }

                const sorted = Object.entries(designCounts).sort((a,b) => b[1] - a[1]);
                for (const [name, count] of sorted) {
                    output += `      ├── [Design] "${name}" (${count} variants)\n`;
                }
            }

            const unassigned = await db.products.count({ 
                where: { category_id: cat.id, subcategory_id: null },
                logging: false 
            });
            output += `   ⚠️  UNCATEGORIZED: ${unassigned} products have no official subcategory.\n\n`;
        }

        fs.writeFileSync('hierarchy_final_report.txt', output);
        console.log("✅ Audit complete. Summary written to hierarchy_final_report.txt");

    } catch (err) {
        fs.writeFileSync('hierarchy_final_report.txt', `❌ Error: ${err.message}\n${err.stack}`);
        console.error("❌ Error:", err);
    }
    process.exit(0);
}
audit();
