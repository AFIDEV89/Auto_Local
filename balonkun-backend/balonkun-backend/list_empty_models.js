import db from './src/database/index.js';

async function listEmptyModels() {
    try {
        const query = `
            SELECT 
                b.name AS BrandName, 
                m.name AS ModelName,
                vd.id AS VD_ID
            FROM brands b
            JOIN brand_models m ON m.brand_id = b.id
            JOIN vehicle_details vd ON vd.model_id = m.id
            LEFT JOIN products p ON p.vehicle_details_id = vd.id
            GROUP BY b.id, b.name, m.id, m.name, vd.id
            HAVING COUNT(p.id) = 0
            ORDER BY b.name ASC, m.name ASC
        `;

        const [results] = await db.query(query);

        console.log(`Found ${results.length} Make > Model combinations with ZERO products.\n`);
        
        let currentBrand = '';
        results.forEach(row => {
            if (row.BrandName !== currentBrand) {
                console.log(`\n### ${row.BrandName}`);
                currentBrand = row.BrandName;
            }
            console.log(`- ${row.ModelName} (VD ID: ${row.VD_ID})`);
        });

    } catch (err) {
        console.error("Error executing query:", err);
    }
    process.exit(0);
}

listEmptyModels();
