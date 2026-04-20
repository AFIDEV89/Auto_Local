import db from './src/database/index.js';

const searchTerms = ['Jazz', 'Brio', 'WRV', 'Accord', 'CRV'];

async function searchEverywhere() {
    const [tables] = await db.query('SHOW TABLES');
    const tableNames = tables.map(r => Object.values(r)[0]);

    console.log(`🕵️ EXHAUSTIVE DATABASE SEARCH FOR: ${searchTerms.join(', ')}\n`);

    for (const tableName of tableNames) {
        // Skip system/meta tables
        if (tableName.includes('schema') || tableName === 'sys_config') continue;

        try {
            const [columns] = await db.query(`DESCRIBE \`${tableName}\``);
            const textCols = columns
                .filter(c => c.Type.includes('char') || c.Type.includes('text') || c.Type.includes('varchar'))
                .map(c => `\`${c.Field}\``);

            if (textCols.length === 0) continue;

            for (const term of searchTerms) {
                const searchStmt = textCols.map(c => `${c} LIKE :term`).join(' OR ');
                const [results] = await db.query(
                    `SELECT * FROM \`${tableName}\` WHERE ${searchStmt} LIMIT 10`,
                    { replacements: { term: `%${term}%` } }
                );

                if (results.length > 0) {
                    console.log(`✅ [TABLE: ${tableName}] Term: "${term}" | Matches: ${results.length}`);
                    results.forEach(r => console.log(`   Sample Data ID: ${r.id || 'N/A'}`));
                }
            }
        } catch (e) {
            // console.log(`Skipping table ${tableName}: ${e.message}`);
        }
    }
    process.exit(0);
}

searchEverywhere().catch(err => {
    console.error(err);
    process.exit(1);
});
