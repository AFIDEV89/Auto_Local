const { Sequelize } = require('sequelize');
const readline = require('readline');
require('dotenv').config();

const isDryRun = process.argv.includes('--dry-run');

const stagingDb = new Sequelize('dev-autoform', 'admin', 'Autoform123', {
    host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql',
    logging: false
});

const prodDb = new Sequelize(process.env.PROD_DATABASE_NAME || 'dev-autoform', process.env.PROD_DATABASE_USER, process.env.PROD_DATABASE_PASSWORD, {
    host: process.env.PROD_DATABASE_HOST,
    dialect: 'mysql',
    logging: false
});

const JSON_COLUMNS = ['pictures', 'videos', 'reviews', 'tags', 'suggestions'];

function ensureValidJSON(val) {
    if (val === null || val === undefined || val === '') return '[]';
    if (typeof val === 'object') return JSON.stringify(val);
    try { JSON.parse(val); return val; } catch (e) { return '[]'; }
}

async function askConfirmation(message) {
    if (isDryRun) return true;
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question(`${message} (y/N): `, answer => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
        });
    });
}

async function syncTable(tableName) {
    console.log(`\n🔄 Syncing table: ${tableName}${isDryRun ? ' [DRY RUN]' : ''}...`);
    
    // Schema Intelligence
    const [stCols] = await stagingDb.query(`DESCRIBE ${tableName}`);
    const [prCols] = await prodDb.query(`DESCRIBE ${tableName}`);
    const sharedCols = stCols.map(c => c.Field).filter(c => prCols.map(p => p.Field).includes(c));
    
    const [rows] = await stagingDb.query(`SELECT ${sharedCols.join(', ')} FROM ${tableName}`);
    console.log(`📦 Found ${rows.length} rows to sync.`);

    if (rows.length === 0) return;

    if (isDryRun) {
        console.log(`🧪 [DRY RUN]: Would have upserted ${rows.length} rows into Production.`);
        return;
    }

    let count = 0;
    for (const row of rows) {
        for (const col of JSON_COLUMNS) {
            if (row.hasOwnProperty(col)) row[col] = ensureValidJSON(row[col]);
        }

        const columns = Object.keys(row).join(', ');
        const placeholders = Object.keys(row).map(() => '?').join(', ');
        const updates = Object.keys(row).map(c => `${c} = VALUES(${c})`).join(', ');

        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`;
        await prodDb.query(sql, { replacements: Object.values(row) });
        count++;
        if (count % 100 === 0) process.stdout.write(`.`);
    }
    console.log(`\n✅ ${tableName} Sync Complete.`);
}

async function startSync() {
    try {
        console.log('🚀 Starting ENHANCED Zero-Downtime Sync...');
        if (isDryRun) console.log('🛡️ [MODE: DRY RUN] - No changes will be made to Production.');

        await stagingDb.authenticate();
        await prodDb.authenticate();
        console.log('📡 Connected to both environments.');

        const tables = ['categories', 'brands', 'vehicle_types', 'brand_models', 'vehicle_details', 'products', 'product_prices', 'product_variants'];

        if (!isDryRun) {
            const confirmed = await askConfirmation('⚠️ This will push Staging data to Live Production. Continue?');
            if (!confirmed) {
                console.log('🛑 Sync cancelled by user.');
                process.exit(0);
            }
        }

        for (const table of tables) {
            try {
                await syncTable(table);
            } catch (err) {
                console.warn(`⚠️ Error on ${table}: ${err.message}`);
            }
        }

        console.log(`\n✨ SYNC FINISHED: ${isDryRun ? 'Dry run complete. No data was touched.' : 'Live data successfully pushed.'}`);
        process.exit(0);
    } catch (error) {
        console.error('\n🔴 Sync Failed:', error.message);
        process.exit(1);
    }
}

startSync();
