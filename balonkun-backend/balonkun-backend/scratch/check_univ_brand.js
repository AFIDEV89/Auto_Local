import mysql from 'mysql2/promise';

(async () => {
    const c = await mysql.createConnection({
        host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', 
        user: 'admin', 
        password: 'Autoform123', 
        database: 'dev-autoform'
    });

    const [brands] = await c.query("SELECT * FROM brands WHERE name LIKE '%Univ%'");
    console.log("Universal Brands:", brands);

    const [models] = await c.query("SELECT * FROM brand_models WHERE name LIKE '%Univ%'");
    console.log("Universal Models:", models);

    c.end();
})().catch(e => console.error(e));
