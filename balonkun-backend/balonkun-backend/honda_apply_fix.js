import db from './src/database/index.js';
import { Op } from 'sequelize';

const CAR_MODELS = ['CIVIC', 'CITY', 'ELEVATE', 'AMAZE', 'WRV', 'BRIO', 'ACCORD', 'CRV'];
const BIKE_MODELS_DICT = {
    'SHINE': 513, 'ACTIVA': 533, 'DIO': 541, 'LIVO': 525, 'NAVI': 527, 
    'HORNET': 528, 'GRAZIA': 538, 'UNICORN': 522, 'X-BLADE': 529, 
    'CD110': 526, 'DREAM YUGA': 523, 'AVIATOR': 543
};

// Subcat signals for bikes
const BIKE_SUBCATS = [13, 14, 30, 43, 44, 45, 46, 49, 50, 53, 55, 59, 60];

async function applyFix() {
    console.log("🚀 Starting ACTUAL Honda Segregation Migration...");
    
    const products = await db.products.findAll({
        where: {
            name: { [Op.like]: '%Honda%' },
            brand_id: 10 // Only target products currently leaked into Brand 10
        },
        attributes: ['id', 'name', 'brand_id', 'subcategory_id'],
        raw: true
    });

    let count = 0;

    for (const p of products) {
        const nameUpper = p.name.toUpperCase();
        let shouldMove = false;
        let targetVD = null;

        const words = nameUpper.split(/[^A-Z0-9+]/);
        
        let foundBikeModel = Object.keys(BIKE_MODELS_DICT).find(m => words.includes(m));
        
        if (foundBikeModel) {
            shouldMove = true;
            targetVD = BIKE_MODELS_DICT[foundBikeModel];
        } else if (BIKE_SUBCATS.includes(p.subcategory_id)) {
            shouldMove = true;
            targetVD = 534; // Activa 6G (Common catch-all for bikes if name is generic)
        } else if (nameUpper.includes("BIG WING") || nameUpper.includes("CB 350")) {
            shouldMove = true;
            targetVD = 522; // Unicorn (Substitute for Big Wing generic)
        }

        if (shouldMove) {
            console.log(`[MIGRATING] ID: ${p.id} | Name: ${p.name} -> Brand 37`);
            
            await db.products.update({
                brand_id: 37,
                vehicle_type_id: 1, // 2-Wheeler
                vehicle_details_id: targetVD || p.vehicle_details_id // Update VD if we found a match
            }, {
                where: { id: p.id }
            });
            count++;
        }
    }

    console.log(`\n✅ Migration Complete. Updated ${count} products.`);
    process.exit(0);
}

applyFix();
