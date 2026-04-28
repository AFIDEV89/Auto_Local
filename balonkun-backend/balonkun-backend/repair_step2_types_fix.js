import db from './src/database/index.js';
import { Op } from 'sequelize';

async function fixTypes() {
    console.log("=== FINAL TYPE CORRECTION (STAGING) ===\n");
    try {
        // 1. Correct 4W products using Vehicle Details mapping
        const details4w = await db.vehicleDetails.findAll({
            include: [{ model: db.brands, where: { vehicle_type_id: 2 } }],
            attributes: ['id'],
            raw: true,
            logging: false
        });
        const dIds4w = details4w.map(d => d.id);
        
        if (dIds4w.length > 0) {
            const [count] = await db.products.update(
                { vehicle_type_id: 2 },
                { where: { vehicle_details_id: { [Op.in]: dIds4w }, category_id: 10 }, logging: false }
            );
            console.log(`✅ Fixed 4W mapping for ${count} products via Vehicle Details.`);
        }

        // 2. Correct 2W products
        const details2w = await db.vehicleDetails.findAll({
            include: [{ model: db.brands, where: { vehicle_type_id: 1 } }],
            attributes: ['id'],
            raw: true,
            logging: false
        });
        const dIds2w = details2w.map(d => d.id);
        
        if (dIds2w.length > 0) {
            const [count] = await db.products.update(
                { vehicle_type_id: 1 },
                { where: { vehicle_details_id: { [Op.in]: dIds2w }, category_id: 10 }, logging: false }
            );
            console.log(`✅ Fixed 2W mapping for ${count} products.`);
        }

        console.log("\n✅ ALL REPAIRS FINISHED!");
    } catch (e) { console.error(e); }
    process.exit(0);
}
fixTypes();
