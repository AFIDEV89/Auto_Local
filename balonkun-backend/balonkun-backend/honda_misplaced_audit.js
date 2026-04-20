import db from './src/database/index.js';

async function auditMisplaced() {
    console.log("🕵️ AUDITING MISPLACED HONDA PRODUCTS\n");

    // 1. Get products that HAVE 'Honda' in the name but are NOT Brand 10
    const [misbranded] = await db.query(`
        SELECT id, name, brand_id, vehicle_details_id 
        FROM products 
        WHERE name LIKE '%Honda%' AND brand_id != 10
    `);

    console.log(`Total Honda-named products outside Brand 10: ${misbranded.length}\n`);

    const categories = {
        '2W (Brand 37)': [],
        'Other Brands': [],
        'Potential Car Models': []
    };

    misbranded.forEach(p => {
        const name = p.name.toUpperCase();
        if (p.brand_id === 37) {
            categories['2W (Brand 37)'].push(p);
        } else if (name.includes('CITY') || name.includes('CIVIC') || name.includes('JAZZ') || name.includes('BRIO') || name.includes('AMAZE') || name.includes('WRV') || name.includes('ELEVATE') || name.includes('ACCORD') || name.includes('CRV')) {
            categories['Potential Car Models'].push(p);
        } else {
            categories['Other Brands'].push(p);
        }
    });

    console.log(`--- Potential Car Models to Rescue (${categories['Potential Car Models'].length}) ---`);
    categories['Potential Car Models'].forEach(p => {
        console.log(`[ID: ${p.id}] Brand: ${p.brand_id} | Name: ${p.name}`);
    });

    process.exit(0);
}

auditMisplaced().catch(err => {
    console.error(err);
    process.exit(1);
});
