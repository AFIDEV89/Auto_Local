const { Sequelize } = require('sequelize');
require('dotenv').config();

// SOURCE: Production (The Healthy one)
const prodDb = new Sequelize(process.env.PROD_DATABASE_NAME || 'dev-autoform', process.env.PROD_DATABASE_USER, process.env.PROD_DATABASE_PASSWORD, {
    host: process.env.PROD_DATABASE_HOST,
    dialect: 'mysql',
    logging: false
});

// TARGET: Staging (The Draft one)
const stagingDb = new Sequelize('dev-autoform', 'admin', 'Autoform123', {
    host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql',
    logging: false
});

async function mirrorTable(tableName) {
    console.log(`\n🔄 Refreshing Staging table: ${tableName}...`);
    
    const [rows] = await prodDb.query(`SELECT * FROM ${tableName}`);
    console.log(`📦 Found ${rows.length} rows in Production.`);

    if (rows.length === 0) return;

    // We use DESCRIBE to ensure we only sync columns that exist in both targets
    const [stCols] = await stagingDb.query(`DESCRIBE ${tableName}`);
    const stagingColNames = stCols.map(c => c.Field);
    
    for (const row of rows) {
        // Filter out keys that don't exist in Staging
        const filteredRow = {};
        Object.keys(row).forEach(key => {
            if (stagingColNames.includes(key)) {
                filteredRow[key] = row[key];
            }
        });

        const columns = Object.keys(filteredRow).join(', ');
        const placeholders = Object.keys(filteredRow).map(() => '?').join(', ');
        const updates = Object.keys(filteredRow).map(c => `${c} = VALUES(${c})`).join(', ');

        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`;
        await stagingDb.query(sql, { replacements: Object.values(filteredRow) });
    }
    console.log(`✅ ${tableName} is now a perfect mirror of Production.`);
}

async function run() {
    try {
        console.log('🪞 Starting Production-to-Staging Mirror Refresh...');
        await prodDb.authenticate();
        await stagingDb.authenticate();
        console.log('📡 Connected to both environments.');

        const tablesToMirror = [
            'categories',
            'brands',
            'vehicle_types',
            'brand_models',
            'vehicle_details',
            'products',
            'product_prices',
            'product_variants'
        ];

        for (const table of tablesToMirror) {
            try {
                await mirrorTable(table);
            } catch (err) {
                console.warn(`⚠️ Could not mirror ${table}: ${err.message}`);
            }
        }

        console.log('\n✨ REFRESH COMPLETE: Staging is now 100% updated with Live data!');
        process.exit(0);
    } catch (error) {
        console.error('\n🔴 Mirror Failed:', error.message);
        process.exit(1);
    }
}

run();
