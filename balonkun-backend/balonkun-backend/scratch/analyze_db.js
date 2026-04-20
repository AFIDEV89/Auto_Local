import mysql from 'mysql2/promise';

(async () => {
    const c = await mysql.createConnection({
        host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', 
        user: 'admin', 
        password: 'Autoform123', 
        database: 'dev-autoform'
    });

    console.log("=== Checking Products for Categories 11 (Accessories), 12 (Mats) ===");
    
    // Check total products count for these categories
    const [counts] = await c.query('SELECT category_id, COUNT(*) as cnt FROM products WHERE category_id IN (11, 12) GROUP BY category_id');
    console.log("Counts:", counts);

    // Look at how they map to vehicle_details via vehicle_details_id
    const [vd_direct] = await c.query(`
        SELECT p.category_id, vd.brand_id, COUNT(*) as cnt 
        FROM products p 
        LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id 
        WHERE p.category_id IN (11, 12) 
        GROUP BY p.category_id, vd.brand_id
    `);
    console.log("Direct VD Mappings (brand_id frequency):", vd_direct);

    // Look at product_vehicle_details table (many to many mapping?)
    const [pvd_links] = await c.query(`
        SELECT p.category_id, COUNT(*) as cnt 
        FROM products p 
        INNER JOIN product_vehicle_details pvd ON p.id = pvd.product_id 
        WHERE p.category_id IN (11, 12) 
        GROUP BY p.category_id
    `);
    console.log("ProductVehicleDetails Many-to-Many count:", pvd_links);

    // Let's get a few sample accessories and mats to see EXACTLY what data is in them
    const [sample] = await c.query(`
        SELECT p.id, p.name, p.category_id, p.vehicle_details_id 
        FROM products p 
        WHERE p.category_id IN (11, 12) 
        LIMIT 5
    `);
    console.log("Samples:", sample);

    c.end();
})().catch(e => console.error(e));
