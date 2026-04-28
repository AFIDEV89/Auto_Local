import mysql from 'mysql2/promise';

(async () => {
    const c = await mysql.createConnection({
        host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', 
        user: 'admin', 
        password: 'Autoform123', 
        database: 'dev-autoform'
    });

    console.log("Updating outlier accessories to Universal vehicle mappings...");

    // 1. Royal Enfield Seat Cover & New Product (2W) -> Universal 2W (id: 654)
    await c.query(`UPDATE products SET vehicle_details_id = 654 WHERE id IN (9229, 9230)`);
    console.log("Updated 9229, 9230 to 2W Universal (654)");

    // 2. Neck Rest & Car Body Covers (4W Accessories) -> Universal 4W (id: 229)
    await c.query(`UPDATE products SET vehicle_details_id = 229 WHERE id IN (9231, 9252, 9253, 9254)`);
    console.log("Updated 9231, 9252, 9253, 9254 to 4W Universal (229)");

    // 3. 7D U Max Arrow 3 Row Mat (4W 3-Row Mat) -> Universal 4W 3-Row (id: 652)
    await c.query(`UPDATE products SET vehicle_details_id = 652 WHERE id = 9210`);
    console.log("Updated 9210 (3-Row Mat) to 4W Universal 3-Row (652)");

    console.log("Database successfully cleaned up!");
    c.end();
})().catch(e => console.error(e));
