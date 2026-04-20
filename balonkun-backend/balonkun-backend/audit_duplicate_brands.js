import db from './src/database/index.js';

async function audit() {
    try {
        const brands = await db.brands.findAll({ logging: false });
        const nameGroups = {};
        
        console.log("=== BRAND DUPLICATE AUDIT ===\n");
        for (const b of brands) {
            const normalized = b.name.toLowerCase().trim();
            if (!nameGroups[normalized]) nameGroups[normalized] = [];
            nameGroups[normalized].push(b);
        }

        for (const [name, list] of Object.entries(nameGroups)) {
            if (list.length > 1) {
                console.log(`❌ Duplicate found for "${name}":`);
                for (const b of list) {
                    const products = await db.products.count({ where: { brand_id: b.id }, logging: false });
                    const details = await db.vehicleDetails.count({ where: { brand_id: b.id }, logging: false });
                    console.log(`   - ID: ${b.id} Name: "${b.name}" Type: ${b.vehicle_type_id} (Products: ${products}, Details: ${details})`);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
audit();
