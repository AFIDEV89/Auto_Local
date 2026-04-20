import db from '../database/index.js';
import { Op } from 'sequelize';

/**
 * RESTORE TRENDING SEAT COVERS
 * Uses the actual DESIGNS table to find one representative product per design.
 *
 * 4W Designs: E5, E1, E4, Q2, Amaze+, E2, H-Cross, D3, U-Focus, U-Highway,
 *   D5, Amaze Duo+, U-Arrow, U-Ladder, U-Blade, U-Volt, H-Grand,
 *   Navigation+, X-Cross, POLO, Xclusive, Xclusive+, U-Impress, U-Joy, U-Pat
 *
 * 2W Designs: U-ACTIVE Bike, U-ACTIVE PLUS Bike, U-ACTIVE PLUS Scooter,
 *   U-Active Scooter, U-CROSS Bike, U-DRIVE Bike, U-IMPRESS Bike,
 *   U-IMPRESS EVS, U-IMPRESS Scooter, U-Sportz Bike, U-Sportz Scooter
 *
 * Does NOT touch Accessories or Mats (already working).
 */

// 4W design IDs from the designs table
const DESIGNS_4W = [
    1,  // Amaze+
    2,  // Amaze Duo+
    3,  // E1
    4,  // E2
    6,  // E4
    7,  // E5
    9,  // D3
    10, // D5
    15, // H-Cross
    60, // H-Grand
    24, // Navigation+
    54, // Q2
    57, // U-Arrow
    58, // U-Blade
    16, // U-Focus
    11, // U-Highway
    14, // U-Impress
    12, // U-Joy
    59, // U-Ladder
    13, // U-Pat
    55, // U-Volt
    66, // X-Cross
    56, // Xclusive
    26, // Xclusive+
    65, // POLO
];

// 2W design IDs from the designs table
const DESIGNS_2W = [
    79, // U-ACTIVE Bike
    81, // U-ACTIVE PLUS Bike
    76, // U-ACTIVE PLUS Scooter
    61, // U-Active Scooter
    35, // U-CROSS Bike
    83, // U-DRIVE Bike
    78, // U-IMPRESS Bike
    82, // U-IMPRESS EVS
    77, // U-IMPRESS Scooter
    63, // U-Sportz Bike
    64, // U-Sportz Scooter
];

const SEAT_COVERS_CAT = 10;

async function restoreSeatCoverTrending() {
    console.log('=== Restoring Seat Cover Trending Products ===\n');

    // Step 1: Clear existing trending for seat covers only
    const cleared = await db.products.update(
        { is_trending: false },
        { where: { is_trending: true, category_id: SEAT_COVERS_CAT } }
    );
    console.log(`Cleared ${cleared[0]} existing trending seat covers.\n`);

    let totalMarked = 0;

    // Step 2: Process 4W designs
    console.log('--- 4W Seat Covers ---');
    for (const designId of DESIGNS_4W) {
        // Find products that have a variant with this design_id
        const product = await db.products.findOne({
            where: { category_id: SEAT_COVERS_CAT },
            include: [
                {
                    model: db.productVariants,
                    where: { design_id: designId },
                    required: true,
                    include: [{ model: db.designs, attributes: ['name'] }]
                },
                {
                    model: db.vehicleDetails,
                    required: true,
                    include: [{
                        model: db.vehicleTypes,
                        where: { name: '4W' },
                        required: true
                    }]
                }
            ],
            order: [['updatedAt', 'DESC']],
        });

        if (product) {
            await db.products.update({ is_trending: true }, { where: { id: product.id } });
            const designName = product.product_variants?.[0]?.design?.name || designId;
            console.log(`  [4W] ${designName} -> "${product.name}" (ID: ${product.id})`);
            totalMarked++;
        } else {
            // Try by name as fallback
            const design = await db.designs.findByPk(designId);
            console.log(`  [4W] SKIP: No 4W product found for design "${design?.name || designId}"`);
        }
    }

    // Step 3: Process 2W designs
    console.log('\n--- 2W Seat Covers ---');
    for (const designId of DESIGNS_2W) {
        const product = await db.products.findOne({
            where: { category_id: SEAT_COVERS_CAT },
            include: [
                {
                    model: db.productVariants,
                    where: { design_id: designId },
                    required: true,
                    include: [{ model: db.designs, attributes: ['name'] }]
                },
                {
                    model: db.vehicleDetails,
                    required: true,
                    include: [{
                        model: db.vehicleTypes,
                        where: { name: '2W' },
                        required: true
                    }]
                }
            ],
            order: [['updatedAt', 'DESC']],
        });

        if (product) {
            await db.products.update({ is_trending: true }, { where: { id: product.id } });
            const designName = product.product_variants?.[0]?.design?.name || designId;
            console.log(`  [2W] ${designName} -> "${product.name}" (ID: ${product.id})`);
            totalMarked++;
        } else {
            const design = await db.designs.findByPk(designId);
            console.log(`  [2W] SKIP: No 2W product found for design "${design?.name || designId}"`);
        }
    }

    console.log(`\n=== DONE: Marked ${totalMarked} seat cover products as trending ===`);
}

async function main() {
    try {
        await restoreSeatCoverTrending();

        // Verify final counts
        console.log('\n=== Final Trending Counts ===');
        const categories = await db.categories.findAll({ attributes: ['id', 'name'] });
        for (const cat of categories) {
            const count = await db.products.count({
                where: { is_trending: true, category_id: cat.id }
            });
            console.log(`  ${cat.name}: ${count} trending`);
        }
        const total = await db.products.count({ where: { is_trending: true } });
        console.log(`  TOTAL: ${total} trending products`);

        process.exit(0);
    } catch (error) {
        console.error('FATAL ERROR:', error);
        process.exit(1);
    }
}

main();
