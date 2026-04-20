import db from './src/database/index.js';

async function trimHierarchy() {
    console.log("🛠️ STARTING HIERARCHY CLEANUP (STAGING ONLY)\n");

    // 1. Find models with trailing spaces
    const [models] = await db.query(`SELECT id, name, brand_id FROM brand_models`);
    console.log(`Auditing ${models.length} models...`);

    let updatedCount = 0;
    for (const model of models) {
        const trimmedName = model.name.trim();
        if (trimmedName !== model.name) {
            console.log(`[FIXING] "${model.name}" -> "${trimmedName}" (ID: ${model.id})`);
            await db.query(`UPDATE brand_models SET name = :trimmed WHERE id = :id`, {
                replacements: { trimmed: trimmedName, id: model.id }
            });
            updatedCount++;
        }
    }

    console.log(`\n✅ Trimmed ${updatedCount} model names.`);

    // 2. Identify remaining duplicates (same name, same brand)
    const [duplicates] = await db.query(`
        SELECT name, brand_id, GROUP_CONCAT(id) as ids, COUNT(*) as count 
        FROM brand_models 
        GROUP BY name, brand_id 
        HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
        console.log(`\n⚠️ Found ${duplicates.length} duplicate model records to merge.`);
        for (const d of duplicates) {
            const ids = d.ids.split(',');
            const keepId = ids[0];
            const mergeIds = ids.slice(1);
            console.log(`   Merging "${d.name}" (Brand:${d.brand_id}): Keeping ID ${keepId}, Merging IDs ${mergeIds.join(', ')}`);
            
            for (const oldId of mergeIds) {
                // Update vehicle_details to point to the kept model ID
                await db.query(`UPDATE vehicle_details SET model_id = :keepId WHERE model_id = :oldId`, {
                    replacements: { keepId, oldId }
                });
                // Delete the redundant model record
                await db.query(`DELETE FROM brand_models WHERE id = :oldId`, {
                    replacements: { oldId }
                });
            }
        }
    }

    console.log("\n✨ Hierarchy cleanup complete.");
    process.exit(0);
}

trimHierarchy().catch(err => {
    console.error(err);
    process.exit(1);
});
