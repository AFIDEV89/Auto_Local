import mysql from 'mysql2/promise';

const databases = [
    { name: 'autoformdb', host: 'autoformdb.cqeiiqigmr30.ap-south-1.rds.amazonaws.com', user: 'admin', password: 'Qwerty123', database: 'autoform' },
    { name: 'autoformdbn', host: 'autoformdbn.cqeiiqigmr30.ap-south-1.rds.amazonaws.com', user: 'admin', password: 'Qwerty123', database: 'dev-autoform' },
    { name: 'autoformdb-rollback', host: 'autoformdb-rollback.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', user: 'admin', password: 'Autoform123', database: 'dev-autoform' },
    { name: 'staging-autoformdb', host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', user: 'admin', password: 'Autoform123', database: 'dev-autoform' },
];

async function checkDbs() {
    for (let dbConfig of databases) {
        console.log(`\n============================================`);
        console.log(`Checking ${dbConfig.name} (${dbConfig.host})...`);
        try {
            const connection = await mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database,
                connectTimeout: 5000,
            });

            // Try to find products table
            const [tables] = await connection.execute("SHOW TABLES LIKE '%product%';");
            console.log(`Tables containing 'product':`, tables.map(t => Object.values(t)[0]));

            if (tables.length > 0) {
                // assume the table is called 'products' or 'Products'
                const prodTable = tables.find(t => Object.values(t)[0].toLowerCase() === 'products') || tables[0];
                const tableName = Object.values(prodTable)[0];

                const [countRows] = await connection.execute(`SELECT COUNT(*) as cnt FROM ${tableName}`);
                console.log(`Total rows in ${tableName}: ${countRows[0].cnt}`);
                
                // try to count product to model mappings
                const [modelTables] = await connection.execute("SHOW TABLES LIKE '%model%';");
                console.log(`Tables containing 'model':`, modelTables.map(t => Object.values(t)[0]));
            }

            await connection.end();
        } catch (error) {
            console.error(`Error connecting to ${dbConfig.name}:`, error.message);
        }
    }
}

checkDbs();
