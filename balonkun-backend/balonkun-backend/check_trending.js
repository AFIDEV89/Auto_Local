
import db from './src/database/index.js';
import { Op } from 'sequelize';

async function checkTrending() {
    try {
        const trendingCount = await db.products.count({
            where: { is_trending: true }
        });
        
        const totalCount = await db.products.count();
        
        console.log(`Total Products: ${totalCount}`);
        console.log(`Trending Products: ${trendingCount}`);
        
        const categories = await db.categories.findAll({
            attributes: ['id', 'name']
        });
        
        console.log('\n--- Breakdown by Category ---');
        for (const cat of categories) {
            const count = await db.products.count({
                where: { 
                    category_id: cat.id, 
                    is_trending: true 
                }
            });
            console.log(`${cat.name}: ${count} products trending`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTrending();
