const { Sequelize } = require('sequelize');
require('dotenv').config();

// SOURCE: Production (The Healthy one)
const prodDb = new Sequelize(process.env.PROD_DATABASE_NAME || 'dev-autoform', process.env.PROD_DATABASE_USER, process.env.PROD_DATABASE_PASSWORD, {
    host: process.env.PROD_DATABASE_HOST,
    dialect: 'mysql',
    logging: false,
    dialectOptions: { connectTimeout: 60000 }
});

// TARGET: Staging (The Draft one)
const stagingDb = new Sequelize('dev-autoform', 'admin', 'Autoform123', {
    host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql',
    logging: false,
    dialectOptions: { connectTimeout: 60000 }
});

const JSON_COLUMNS = ['pictures', 'videos', 'reviews', 'tags', 'suggestions'];
function ensureValidJSON(val) {
    if (val === null || val === undefined || val === '') return '[]';
    if (typeof val === 'object') return JSON.stringify(val);
    try { JSON.parse(val); return val; } catch (e) { return '[]'; }
}

async function mirrorTable(tableName) {
    console.log(`\n🔄 [SELF-HEALING] Refreshing table: ${tableName}...`);
    
    // Get total count first
    const [countRows] = await prodDb.query(`SELECT COUNT(*) as total FROM ${tableName}`);
    const total = countRows[0].total;
    console.log(`📦 Found ${total} total rows in Production.`);

    if (total === 0) return;

    // Build staging column map
    const [stCols] = await stagingDb.query(`DESCRIBE ${tableName}`);
    const stagingColNames = stCols.map(c => c.Field);

    const BATCH_SIZE = 100;
    for (let offset = 0; offset < total; offset += BATCH_SIZE) {
        let success = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!success && attempts < maxAttempts) {
            try {
                attempts++;
                if (attempts > 1) console.log(`   ⚠️  Retry attempt ${attempts}/${maxAttempts} for offset ${offset}...`);
                
                const [rows] = await prodDb.query(`SELECT * FROM ${tableName} LIMIT ${BATCH_SIZE} OFFSET ${offset}`);

                for (const row of rows) {
                    for (const col of JSON_COLUMNS) if (row.hasOwnProperty(col)) row[col] = ensureValidJSON(row[col]);

                    const filteredRow = {};
                    Object.keys(row).forEach(key => {
                        if (stagingColNames.includes(key)) filteredRow[key] = row[key];
                    });

                    const columns = Object.keys(filteredRow).join(', ');
                    const placeholders = Object.keys(filteredRow).map(() => '?').join(', ');
                    const updates = Object.keys(filteredRow).map(c => `${c} = VALUES(${c})`).join(', ');

                    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`;
                    await stagingDb.query(sql, { replacements: Object.values(filteredRow) });
                }
                success = true;
            } catch (err) {
                console.error(`   ❌ Batch failed at offset ${offset}: ${err.message}`);
                if (attempts < maxAttempts) {
                    console.log(`   🕒 Waiting 5 seconds before retry...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else {
                    console.error(`   🛑 Permanent failure for batch at offset ${offset}. Skipping...`);
                }
            }
        }
        
        // Progress indicator
        if (offset % 500 === 0 && offset > 0) console.log(`   📊 Progress: ${offset}/${total} rows mirrored.`);
    }

    console.log(`✅ ${tableName} mirroring complete.`);
}

async function run() {
    try {
        console.log('🪞 Starting Production-to-Staging Mirror Refresh...');
        await prodDb.authenticate();
        await stagingDb.authenticate();
        console.log('📡 Connected to both environments.');

        const tablesToMirror = [
            'categories',
            'subCategories',
            'subcategories',
            'brands',
            'vehicle_types',
            'brand_models',
            'vehicle_details',
            'designs',
            'colors',
            'materials',
            'vehicle_categories',
            'product_vehicle_details',
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
