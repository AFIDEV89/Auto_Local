import db from './src/database/index.js';
import fs from 'fs';

async function run() {
    try {
        const products = await db.products.findAll({
            where: { category_id: 10, subcategory_id: null },
            attributes: ['id', 'name'],
            raw: true,
            logging: false
        });

        let output = `=== REMAINING UNCATEGORIZED PRODUCTS - CAT 10 (${products.length}) ===\n\n`;
        products.forEach(p => {
            output += `[ID: ${p.id}] ${p.name}\n`;
        });

        fs.writeFileSync('remaining_products.txt', output);
        console.log(`✅ Extracted ${products.length} products to remaining_products.txt`);

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
run();
