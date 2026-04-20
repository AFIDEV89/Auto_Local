import db from './src/database/index.js';
import { Op } from 'sequelize';

async function audit() {
    console.log("=== DESIGN-BASED HIERARCHY AUDIT (STAGING/LOCAL) ===\n");

    try {
        // 1. Count how many products in Cat 10 have variants with designs
        const productIds = await db.products.findAll({
            where: { category_id: 10 },
            attributes: ['id'],
            raw: true
        });
        const ids = productIds.map(p => p.id);

        const variantCount = await db.productVariants.count({
            where: { product_id: { [Op.in]: ids } }
        });
        console.log(`✅ Total Variants found for Category 10 products: ${variantCount}`);

        // 2. Breakdown of variants by Design
        const designBreakdown = await db.productVariants.findAll({
            where: { product_id: { [Op.in]: ids } },
            attributes: [
                'design_id',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
            ],
            include: [{ model: db.designs }],
            group: ['design_id'],
            raw: true,
            nest: true,
            logging: false
        });

        console.log("\n✅ Top Designs assigned to these products:");
        const sortedDesigns = designBreakdown.sort((a,b) => b.count - a.count).slice(0, 30);
        for (const d of sortedDesigns) {
            const name = d.design ? d.design.name : 'Unknown Design';
            console.log(`   - [Design ID: ${d.design_id}] ${name}: ${d.count} variants`);
        }

    } catch (err) {
        console.error("❌ Audit Error:", err);
    }
    process.exit(0);
}
audit();
