import db from './src/database/index.js';

async function robustMerge() {
    console.log("🛠️ ROBUST HIERARCHY MERGE (STAGING ONLY)\n");

    // 1. Fetch all models for every brand
    const [allModels] = await db.query(`SELECT id, name, brand_id FROM brand_models`);
    
    // Group them by [brand_id]-[trimmed_name]
    const modelGroups = {};
    allModels.forEach(m => {
        const key = `${m.brand_id}-${m.name.trim().toUpperCase()}`;
        if (!modelGroups[key]) modelGroups[key] = [];
        modelGroups[key].push(m);
    });

    console.log(`Processing ${Object.keys(modelGroups).length} unique model names across all brands...`);

    let mergedCount = 0;
    let trimmedCount = 0;

    for (const key in modelGroups) {
        const group = modelGroups[key];
        
        // Strategy: 
        // - Pick the first ID as the MASTER.
        // - Move all vehicle_details from OTHER IDs to MASTER ID.
        // - Delete OTHER IDs.
        // - Trim the MASTER name.

        const master = group[0];
        const redundant = group.slice(1);

        if (redundant.length > 0) {
            console.log(`\n📦 Merging Group: ${key}`);
            console.log(`   Keeping master ID: ${master.id} ("${master.name}")`);
            for (const red of redundant) {
                console.log(`   Merging ID: ${red.id} ("${red.name}")`);
                
                // Move links
                await db.query(`UPDATE vehicle_details SET model_id = :masterId WHERE model_id = :oldId`, {
                    replacements: { masterId: master.id, oldId: red.id }
                });
                
                // Delete redundant record
                await db.query(`DELETE FROM brand_models WHERE id = :oldId`, {
                    replacements: { oldId: red.id }
                });
                mergedCount++;
            }
        }

        // Always trim the master name if needed
        const trimmedMaster = master.name.trim();
        if (master.name !== trimmedMaster) {
            console.log(`   Trimming master: "${master.name}" -> "${trimmedMaster}"`);
            await db.query(`UPDATE brand_models SET name = :trimmed WHERE id = :id`, {
                replacements: { trimmed: trimmedMaster, id: master.id }
            });
            trimmedCount++;
        }
    }

    console.log(`\n✅ Results: ${mergedCount} models merged, ${trimmedCount} master records trimmed.`);
    console.log("✨ Robust Hierarchy Cleanup Complete.");
    process.exit(0);
}

robustMerge().catch(err => {
    console.error(err);
    process.exit(1);
});
