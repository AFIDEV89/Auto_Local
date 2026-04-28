import db from './src/database/index.js';
import { Op } from 'sequelize';

async function auditHondaLeak() {
    console.log("=== AUDITING HONDA 4W -> 2W LEAKAGE ===\n");

    try {
        const bikeKeywords = ['AVIATOR', 'X-BLADE', 'HORNET', 'NAVI', 'SHINE', 'ACTIVA', 'DIO', 'UNICORN', 'GRAZIA', 'CD110', 'LIVO'];
        
        const products = await db.products.findAll({
            where: {
                brand_id: 10,
                category_id: 10,
                [Op.or]: bikeKeywords.map(k => ({ name: { [Op.like]: `%${k}%` } }))
            },
            logging: false
        });

        console.log(`Found ${products.length} potential bike products in Brand 10 (4W HONDA):\n`);

        products.forEach(p => {
            console.log(`[ID: ${p.id}] ${p.name} (Brand: ${p.brand_id}, VD: ${p.vehicle_details_id})`);
        });

    } catch (e) {
        console.error("Audit Error:", e);
    }
    process.exit(0);
}

auditHondaLeak();
