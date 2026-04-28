import mysql from 'mysql2/promise';

(async () => {
    const c = await mysql.createConnection({
        host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', 
        user: 'admin', 
        password: 'Autoform123', 
        database: 'dev-autoform'
    });

    console.log("Reverting products back to original dataset...");

    await c.query(`UPDATE products SET vehicle_details_id = 228 WHERE id = 9231`);
    await c.query(`UPDATE products SET vehicle_details_id = 218 WHERE id = 9230`);
    await c.query(`UPDATE products SET vehicle_details_id = 205 WHERE id = 9229`);
    await c.query(`UPDATE products SET vehicle_details_id = 104 WHERE id = 9252`);
    await c.query(`UPDATE products SET vehicle_details_id = 253 WHERE id = 9253`);
    await c.query(`UPDATE products SET vehicle_details_id = 280 WHERE id = 9254`);
    await c.query(`UPDATE products SET vehicle_details_id = 282 WHERE id = 9210`);

    console.log("Reversion complete!");
    c.end();
})().catch(e => console.error(e));
