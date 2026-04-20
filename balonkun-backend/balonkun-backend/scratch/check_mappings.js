import mysql from 'mysql2/promise';

async function checkMapping() {
    const dbConfig = {
        host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
        user: 'admin',
        password: 'Autoform123',
        database: 'dev-autoform',
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Let's find product categories
        const [categories] = await connection.execute("SELECT * FROM product_categories");
        console.log("Categories:", categories.map(c => ({id: c.id, name: c.name})));

        // Find some Accessories (say category_id = 2)
        const [products] = await connection.execute("SELECT id, name, category_id FROM products WHERE category_id = 2 LIMIT 3");
        console.log("Sample Accessories:", products);
        
        // Find their vehicle_details
        if (products.length > 0) {
            const prodIds = products.map(p => p.id).join(',');
            const [mappings] = await connection.execute(`SELECT * FROM product_vehicle_details WHERE product_id IN (${prodIds})`);
            console.log("Product vehicle details for sample accessories:", mappings);
            
            // Also check if they use 'vehicle_details_id' in products table directly (from old logic)
            const [productsWithVdId] = await connection.execute(`SELECT id, vehicle_details_id FROM products WHERE id IN (${prodIds})`);
            console.log("vehicle_details_id in products table:", productsWithVdId);
            
            // Check vehicle_details table for those IDs
            const vdIds = productsWithVdId.map(p => p.vehicle_details_id).filter(id => id).join(',');
            if (vdIds) {
                const [vd] = await connection.execute(`SELECT * FROM vehicle_details WHERE id IN (${vdIds})`);
                console.log("Vehicle Details content:", vd);
            }
        }
        
        // Let's see how many products have brand_id=0, model_id=0 in vehicle_details
        const [universalCount] = await connection.execute(`SELECT COUNT(*) as count FROM vehicle_details WHERE brand_id = 0 AND model_id = 0`);
        console.log("Universal vehicle_details count:", universalCount[0].count);

        await connection.end();
    } catch (e) {
        console.error("Error:", e);
    }
}

checkMapping();
