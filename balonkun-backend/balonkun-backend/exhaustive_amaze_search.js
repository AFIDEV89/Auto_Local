import db from './src/database/index.js';

async function exhaustiveAmaze() {
    console.log("🕵️ EXHAUSTIVE AMAZE SEARCH\n");

    const [prods] = await db.query(`
        SELECT p.id, p.name, b.name as brand_name, p.brand_id, p.vehicle_details_id 
        FROM products p 
        JOIN brands b ON p.brand_id = b.id 
        WHERE p.name LIKE '%Amaze%'
    `);

    console.log(`Found ${prods.length} total products containing 'Amaze' in name.\n`);

    const carSpecific = [];
    const generics = [];

    prods.forEach(p => {
        const nameUpper = p.name.toUpperCase();
        // Heuristic: If it has other model names like 'VW', 'CITROEN', 'INNOVA', etc. it's for those cars.
        // If it strictly says "HONDA AMAZE" it's for the Amaze car.
        // If it just says "Amaze Plus" it's a generic design name.
        
        if (nameUpper.includes('HONDA AMAZE')) {
            carSpecific.push(p);
        } else if (nameUpper.includes('AMAZE PLUS') || nameUpper.includes('AMAZE DUO') || nameUpper.includes('AMAZE +')) {
            generics.push(p);
        }
    });

    console.log(`--- Potential Honda Amaze Car Products (${carSpecific.length}) ---`);
    carSpecific.forEach(p => console.log(`[ID:${p.id}] ${p.name} | Brand: ${p.brand_name} | VD: ${p.vehicle_details_id}`));

    console.log(`\n--- Potential Generic 'Amaze' Designs (${generics.length}) ---`);
    generics.forEach(p => console.log(`[ID:${p.id}] ${p.name} | Brand: ${p.brand_name} | VD: ${p.vehicle_details_id}`));

    process.exit(0);
}

exhaustiveAmaze().catch(err => {
    console.error(err);
    process.exit(1);
});
