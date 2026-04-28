import db from './src/database/index.js';

async function research() {
    try {
        console.log("=== HONDA MODEL HIERARCHY AUDIT ===\n");

        const honda4wId = 10;
        const honda2wId = 37;

        const models4w = await db.brandModels.findAll({ where: { brand_id: honda4wId }, logging: false });
        const models2w = await db.brandModels.findAll({ where: { brand_id: honda2wId }, logging: false });

        console.log(`📡 Current Models for [ID: ${honda4wId}] "HONDA":`);
        models4w.forEach(m => console.log(`   - [ID: ${m.id}] ${m.name}`));

        console.log(`\n📡 Current Models for [ID: ${honda2wId}] "honda":`);
        models2w.forEach(m => console.log(`   - [ID: ${m.id}] ${m.name}`));

        // Check collation
        const [res] = await db.sequelize.query("SHOW FULL COLUMNS FROM brands WHERE Field = 'name'", { logging: false });
        console.log(`\nCollation of name column: ${res[0].Collation}`);

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
research();
