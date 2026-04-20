import mysql from 'mysql2/promise';

(async () => {
    const c = await mysql.createConnection({
        host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', 
        user: 'admin', 
        password: 'Autoform123', 
        database: 'dev-autoform'
    });

    const [cat] = await c.query('SELECT * FROM categories');
    console.log('Categories:', cat.map(c => ({id: c.id, name: c.name})));

    const [p] = await c.query(`
        SELECT p.id, p.name as product_name, p.category_id, vd.brand_id, vd.model_id, vd.vehicle_type_id 
        FROM products p 
        LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id 
        WHERE p.category_id IN (11, 12) 
        LIMIT 10
    `);
    console.log("Universal Products:", p);

    c.end();
})().catch(e => console.error(e));
