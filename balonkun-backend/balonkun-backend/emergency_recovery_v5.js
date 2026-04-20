import db from './src/database/index.js';

async function performRescue() {
    console.log("🛑 EMERGENCY RECOVERY & PRECISION MAPPING (V5)\n");

    // 1. Revert anything in Brand 42 (Ather) back to Brand 10 (Honda)
    console.log("Step 1: Reverting erroneous Ather mappings...");
    const [revertRes] = await db.query(`
        UPDATE products 
        SET brand_id = 10 
        WHERE brand_id = 42 
          AND (name LIKE '%Seat Cover%' OR name LIKE '%Amaze%' OR name LIKE '%Honda%')
    `);
    console.log(`   Items restored to Honda safe-house.\n`);

    // 2. Fetch the "Authority Map" for only the Car Brands we are remediating
    console.log("Step 2: Building Authority Map for Car Brands...");
    const [authData] = await db.query(`
        SELECT b.id as brandId, b.name as brandName, m.name as modelName, vd.id as vdId
        FROM brands b
        JOIN brand_models m ON b.id = m.brand_id
        JOIN vehicle_details vd ON m.id = vd.model_id
        WHERE b.id IN (1, 9, 10, 13, 14, 15, 16) -- Hyundai, Toyota, Honda, Tata, Mahindra, Ford, Renault
    `);
    
    console.log(`   Loaded ${authData.length} model authorities.\n`);

    // 3. Scan all products in the Honda Brand (10) for de-collision
    const [prods] = await db.query(`SELECT id, name, vehicle_details_id FROM products WHERE brand_id = 10`);
    console.log(`Analyzing ${prods.length} products for precision mapping...\n`);

    let fixedCount = 0;

    for (const p of prods) {
        const name = p.name.toUpperCase();
        let target = null;

        // SPECIFIC CASE MAPPING
        // Rule: Start with narrowest match, end with broadest (Honda Amaze)

        // Find Brand match
        const carBrands = [
            { id: 1, name: 'HYUNDAI' },
            { id: 9, name: 'TOYOTA' },
            { id: 13, name: 'TATA' },
            { id: 14, name: 'MAHINDRA' },
            { id: 15, name: 'MARUTI' },
            { id: 16, name: 'RENAULT' },
            { id: 10, name: 'HONDA' }
        ];

        let matchedBrand = carBrands.find(b => name.includes(b.name));
        
        if (matchedBrand) {
            // Find Model match within that brand
            const possibleModels = authData.filter(a => a.brandId === matchedBrand.id);
            
            // Sort models by length descending to match "Innova Crysta" before "Innova"
            possibleModels.sort((a,b) => b.modelName.length - a.modelName.length);

            let matchedModel = possibleModels.find(m => name.includes(m.modelName.toUpperCase()));

            if (matchedModel) {
                // EXCEPTION: IF name matches "HONDA" AND "CITY" --> Target is City VD
                // IF name matches "HONDA" AND "AMAZE" AND NOT "CITY/CIVIC/ELEVATE" --> Target is Amaze VD
                
                // Let's check if it's already correctly mapped
                if (p.vehicle_details_id !== matchedModel.vdId || matchedBrand.id !== 10) {
                     // We move it
                     console.log(`   [MAPPING] ID: ${p.id} | ${p.name} -> ${matchedBrand.name} ${matchedModel.modelName} (VD: ${matchedModel.vdId})`);
                     await db.query(`UPDATE products SET brand_id = :b, vehicle_details_id = :v WHERE id = :id`, {
                         replacements: { b: matchedBrand.id, v: matchedModel.vdId, id: p.id }
                     });
                     fixedCount++;
                }
            }
        }
    }

    console.log(`\n✅ Finished! ${fixedCount} products precision-mapped.`);
    process.exit(0);
}

performRescue().catch(err => {
    console.error(err);
    process.exit(1);
});
