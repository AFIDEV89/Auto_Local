import db from './src/database/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

async function audit() {
    let output = "=== DESIGN-BASED HIERARCHY AUDIT (STAGING/LOCAL) ===\n\n";

    try {
        // 1. Get Category 10 products
        const products = await db.products.findAll({
            where: { category_id: 10 },
            attributes: ['id'],
            raw: true,
            logging: false
        });
        const ids = products.map(p => p.id);
        output += `✅ Total Products in Category 10: ${ids.length}\n`;

        // 2. Breakdown by Design ID (via productVariants)
        const designBreakdown = await db.productVariants.findAll({
            where: { product_id: { [Op.in]: ids } },
            attributes: [
                'design_id',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('product_variants.product_id')), 'count']
            ],
            include: [{ model: db.designs, attributes: ['id', 'name'] }],
            group: ['design_id'],
            raw: true,
            nest: true,
            logging: false
        });

        output += "\n✅ DESIGN HIERARCHY (Top 50):\n";
        const sorted = designBreakdown.sort((a,b) => b.count - a.count).slice(0, 50);
        
        for (const item of sorted) {
            const name = item.design ? item.design.name : 'No Design Link';
            output += `   - [ID: ${item.design_id}] ${name}: ${item.count} variants\n`;
        }

        // 3. Count products with NO variants
        const productsWithVariants = new Set();
        const variants = await db.productVariants.findAll({
            where: { product_id: { [Op.in]: ids } },
            attributes: ['product_id'],
            raw: true,
            logging: false
        });
        variants.forEach(v => productsWithVariants.add(v.product_id));
        
        const orphanedProducts = ids.length - productsWithVariants.size;
        output += `\n⚠️  ORPHANED PRODUCTS (No variants/designs): ${orphanedProducts}\n`;

        fs.writeFileSync('design_summary.txt', output);
        console.log("✅ Audit complete. Summary written to design_summary.txt");

    } catch (err) {
        fs.writeFileSync('design_summary.txt', `❌ Error: ${err.message}`);
        console.error("❌ Error:", err);
    }
    process.exit(0);
}
audit();
