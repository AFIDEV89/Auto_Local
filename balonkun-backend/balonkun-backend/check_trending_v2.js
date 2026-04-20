
import db from './src/database/index.js';
import { Op } from 'sequelize';

async function checkTrendingWithVehicle() {
    try {
        const vehicleTypes = await db.vehicleTypes.findAll({ attributes: ['id', 'name'] });
        const categories = await db.categories.findAll({ attributes: ['id', 'name'] });

        console.log('--- Trending Products by Vehicle Type & Category ---');

        for (const vt of vehicleTypes) {
            console.log(`\nVehicle Type: ${vt.name}`);
            for (const cat of categories) {
                // Find products that are trending, belong to this category, and match this vehicle type
                const count = await db.products.count({
                    where: { 
                        is_trending: true,
                        category_id: cat.id
                    },
                    include: [{
                        model: db.vehicleDetails,
                        required: true,
                        include: [{
                            model: db.vehicleTypes,
                            where: { name: vt.name },
                            required: true
                        }]
                    }]
                });
                console.log(`  - ${cat.name}: ${count} trending products`);
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTrendingWithVehicle();
