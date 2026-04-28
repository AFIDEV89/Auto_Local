
import db from '../database/index.js';
import { Op } from 'sequelize';

/**
 * FINAL STANDALONE DATABASE SCRIPT (REFINED)
 * Restores "Trending Products" with a mix of generic and representative items.
 */

async function restoreFinalTrending() {
    console.log("Starting FINAL Trending Products Restoration (4W + 2W)...");

    try {
        // 1. Clear all trending flags
        await db.products.update({ is_trending: false }, { where: { is_trending: true } });

        // 2. Restore 4W Generic Seat Covers (The 24 Masters)
        const generic4W = await db.products.findAll({
            where: { category_id: 10 },
            include: [{
                model: db.vehicleDetails,
                where: { vehicle_type_id: 2, brand_id: null },
                required: true
            }]
        });

        for (const p of generic4W) {
            await db.products.update({ is_trending: true }, { where: { id: p.id } });
            console.log(`  [4W OK] ${p.name}`);
        }

        // 3. Restore 2W Seat Covers (Picking 10 diverse representatives since no generics exist)
        console.log("\nRestoring 2W Seat Cover representatives...");
        const representatives2W = await db.products.findAll({
            where: { category_id: 10 },
            include: [{
                model: db.vehicleDetails,
                where: { vehicle_type_id: 1 },
                required: true
            }],
            limit: 12, // Pick a nice set
            order: [['updatedAt', 'DESC']]
        });

        for (const p of representatives2W) {
            await db.products.update({ is_trending: true }, { where: { id: p.id } });
            console.log(`  [2W OK] ${p.name}`);
        }

        // 4. Restore Accessories and Mats (The generic non-branded items)
        const brands = ['Hyundai', 'Maruti', 'Mahindra', 'Toyota', 'Honda', 'Tata', 'Kia', 'Nissan', 'Ford', 'Renault', 'Skoda', 'Volkswagen', 'MG', 'Jeep', 'Suzuki', 'Datsun', 'Chevrolet', 'Yamaha', 'TVS', 'Bajaj', 'Hero', 'Royal Enfield'];
        const otherGenerics = await db.products.findAll({
            where: {
                category_id: { [Op.in]: [11, 12] },
                [Op.and]: brands.map(b => ({ name: { [Op.notLike]: `%${b}%` } }))
            },
            limit: 20
        });

        for (const p of otherGenerics) {
            await db.products.update({ is_trending: true }, { where: { id: p.id } });
        }

        console.log("\nALL TRENDING SECTIONS RESTORED SUCCESSFULLY!");
        process.exit(0);
    } catch (error) {
        console.error("ERROR:", error);
        process.exit(1);
    }
}

restoreFinalTrending();
