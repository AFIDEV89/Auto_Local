import db from './src/database/index.js';

async function audit() {
    console.log("=== COMPREHENSIVE HIERARCHY AUDIT (STAGING/LOCAL) ===\n");

    try {
        // Log all available models to be 100% sure of naming
        const availableModels = Object.keys(db).filter(k => db[k] && typeof db[k].findAll === 'function');
        console.log(`📡 Detected Models: ${availableModels.join(', ')}\n`);

        const subModelName = availableModels.find(m => m.toLowerCase() === 'subcategories' || m.toLowerCase() === 'subcategory');
        if (!subModelName) {
            console.error("❌ Could not detect a subcategory model!");
            process.exit(1);
        }

        const categories = await db.categories.findAll();

        for (const cat of categories) {
            const catCount = await db.products.count({ where: { category_id: cat.id } });
            console.log(`📂 CATEGORY [${cat.id}]: "${cat.name}" (${catCount} Total Products)`);

            const subcats = await db[subModelName].findAll({ where: { category_id: cat.id } });

            if (subcats && subcats.length > 0) {
                for (const sub of subcats) {
                    const subCount = await db.products.count({ where: { subcategory_id: sub.id } });
                    console.log(`   ├── SUBCATEGORY [${sub.id}]: "${sub.name}" (${subCount} Products)`);
                }
            } else {
                console.log("   └── No subcategories found for this category.");
            }

            // Check for Products in this Category with NULL or INVALID subcategory_id
            const orphanedProducts = await db.products.count({
                where: {
                    category_id: cat.id,
                    subcategory_id: null
                }
            });

            if (orphanedProducts > 0) {
                console.log(`   ⚠️  UNASSIGNED: ${orphanedProducts} products have no subcategory.`);
            }
            console.log("");
        }

    } catch (err) {
        console.error("❌ Audit Error:", err);
    }
    process.exit(0);
}
audit();
