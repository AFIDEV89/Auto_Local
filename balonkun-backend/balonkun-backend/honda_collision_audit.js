import db from './src/database/index.js';

async function auditHondaCollision() {
    console.log("🕵️ AUDITING HONDA AMAZE COLLISION\n");

    // 1. Get Honda Model ID Map
    const [models] = await db.query(`
        SELECT m.id as model_id, m.name as model_name, vd.id as vd_id 
        FROM brand_models m 
        JOIN vehicle_details vd ON m.id = vd.model_id 
        WHERE m.brand_id = 10
    `);
    
    const modelToVd = {};
    models.forEach(m => {
        modelToVd[m.model_name.trim().toUpperCase()] = m.vd_id;
    });

    console.log("Honda Model -> VD Map:", modelToVd);

    // 2. Scan all Honda Products (Brand 10)
    const [prods] = await db.query(`SELECT id, name, vehicle_details_id FROM products WHERE brand_id = 10`);
    console.log(`Analyzing ${prods.length} total products in Honda Brand...\n`);

    const remediationList = [];

    prods.forEach(p => {
        const name = p.name.toUpperCase();
        let correctVdId = null;

        // Order of checks matters: specific models first
        if (name.includes('CITY')) {
            correctVdId = modelToVd['CITY'];
        } else if (name.includes('CIVIC')) {
            correctVdId = modelToVd['CIVIC'];
        } else if (name.includes('ELEVATE')) {
            correctVdId = modelToVd['ELEVATE'];
        } else if (name.includes('AMAZE')) {
            // It has Amaze in the name. Is it the car or just the design?
            // If it doesn't have City/Civic/Elevate, it's likely the Amaze car.
            correctVdId = modelToVd['AMAZE'];
        }

        if (correctVdId && p.vehicle_details_id !== correctVdId) {
            remediationList.push({
                id: p.id,
                name: p.name,
                currentVd: p.vehicle_details_id,
                targetVd: correctVdId
            });
        }
    });

    console.log(`Total items mis-mapped: ${remediationList.length}`);
    if (remediationList.length > 0) {
        console.log("\nSamples of Mis-mapped items:");
        remediationList.slice(0, 10).forEach(item => {
            console.log(`[ID:${item.id}] ${item.name} | Curr: ${item.currentVd} -> Target: ${item.targetVd}`);
        });
    }

    process.exit(0);
}

auditHondaCollision().catch(err => {
    console.error(err);
    process.exit(1);
});
