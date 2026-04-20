import db from './src/database/index.js';

async function findAmazeData() {
    console.log("🕵️ AUDITING AMAZE DATA\n");

    // 1. Find generic products currently in ID 657
    const [generics] = await db.query(`
        SELECT id, name, vehicle_details_id 
        FROM products 
        WHERE vehicle_details_id = 657 
          AND name NOT LIKE '%Honda Amaze%'
    `);
    
    console.log("Generics found in Amaze ID (should be moved to 640):");
    generics.forEach(g => console.log(`[ID:${g.id}] ${g.name}`));

    // 2. Find missing car products (should be moved to 657)
    // We search for products that specifically mention the car "Honda Amaze"
    const [carProds] = await db.query(`
        SELECT id, name, vehicle_details_id 
        FROM products 
        WHERE name LIKE '%Honda Amaze%' 
          AND vehicle_details_id != 657
    `);

    console.log("\nCar products found outside Amaze ID (should be moved to 657):");
    carProds.forEach(p => console.log(`[ID:${p.id}] ${p.name} | Current ID: ${p.vehicle_details_id}`));
    console.log(`\nTotal car products found: ${carProds.length}`);

    process.exit(0);
}

findAmazeData().catch(err => {
    console.error(err);
    process.exit(1);
});
