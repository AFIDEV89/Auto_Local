import db from './src/database/index.js';
import { Op } from 'sequelize';

async function perfectLinking() {
    console.log("=== PERFECT 4W PRODUCT HIERARCHY RESTORATION (STAGING) ===\n");

    try {
        // 1. Load Data
        const brands = await db.brands.findAll({ where: { vehicle_type_id: 2 }, logging: false });
        const allModels = await db.brandModels.findAll({ logging: false });
        const vds = await db.vehicleDetails.findAll({ logging: false });
        const products = await db.products.findAll({
            where: { category_id: 10 },
            attributes: ['id', 'name', 'brand_id', 'vehicle_details_id', 'vehicle_type_id'],
            logging: false
        });

        // Mapping for duplicates (using highest ID as primary)
        const primaryModelMap = {
            '1:exter': 245,
            '10:city': 306,
            '10:brio': 276,
            '20:aerox': 659,
            '37:dio 125 bs6': 490,
            '18:i qube': 580,
            '18:pep+': 581
        };

        const vdMap = {};
        vds.forEach(v => { vdMap[`${v.brand_id}:${v.model_id}`] = v.id; });

        // Truly Generic products provided by user (IDs 9959-9981)
        const trulyGenericIds = Array.from({ length: 9981 - 9959 + 1 }, (_, i) => 9959 + i);
        const universalBrandId = 38;
        const universalModelId = 199;
        const universalVdId = vdMap[`${universalBrandId}:${universalModelId}`];

        console.log(`📡 Processing ${products.length} seat cover products...`);

        let counts = { modelSpecific: 0, makeOnly: 0, trulyGeneric: 0, movedTo2W: 0 };

        for (const p of products) {
            const name = p.name;
            const lowerName = name.toLowerCase();

            // 1. Truly Generic
            if (trulyGenericIds.includes(p.id)) {
                await db.products.update({ brand_id: universalBrandId, vehicle_details_id: universalVdId, vehicle_type_id: 2 }, { where: { id: p.id }, logging: false });
                counts.trulyGeneric++;
                continue;
            }

            // 2. Honda Bike leak check
            const bikeWords = ['cd110', 'shine', 'activa', 'dio', 'unicorn', 'grazia', 'navi sx', 'navi bs4', 'navi bs6', 'cb shine', 'dream yuga'];
            const isBikeHonda = bikeWords.some(w => lowerName.includes(w)) && (lowerName.includes('honda')) && !lowerName.includes('navigation');
            if (isBikeHonda) {
                await db.products.update({ brand_id: 37, vehicle_type_id: 1 }, { where: { id: p.id }, logging: false });
                counts.movedTo2W++;
                continue;
            }

            // 3. Match 4W brand
            let matchedBrand = brands.find(b => lowerName.includes(b.name.trim().toLowerCase()));
            if (!matchedBrand) continue;

            // 4. Match Model
            const brandModels = allModels.filter(m => m.brand_id === matchedBrand.id);
            brandModels.sort((a, b) => b.name.trim().length - a.name.trim().length);

            let targetModelId = null;
            let isMakeOnly = true;

            for (const m of brandModels) {
                const mName = m.name.trim().toLowerCase();
                if (mName === matchedBrand.name.trim().toLowerCase()) continue; // Skip catch-all

                if (mName.length >= 2 && lowerName.includes(mName)) {
                    // Check if it's a primary model for duplicates
                    const primKey = `${matchedBrand.id}:${mName}`;
                    targetModelId = primaryModelMap[primKey] || m.id;
                    isMakeOnly = false;
                    break;
                }
            }

            if (isMakeOnly) {
                const catchAll = brandModels.find(m => m.name.trim().toLowerCase() === matchedBrand.name.trim().toLowerCase());
                targetModelId = catchAll ? catchAll.id : null;
                counts.makeOnly++;
            } else {
                counts.modelSpecific++;
            }

            if (targetModelId) {
                const targetVdId = vdMap[`${matchedBrand.id}:${targetModelId}`];
                if (targetVdId) {
                    await db.products.update({ brand_id: matchedBrand.id, vehicle_details_id: targetVdId, vehicle_type_id: 2 }, { where: { id: p.id }, logging: false });
                }
            }
        }

        console.log(`\n🚀 RESTORATION COMPLETE!`);
        console.log(`   - Model-Specific mapped: ${counts.modelSpecific}`);
        console.log(`   - Make-Only mapped: ${counts.makeOnly}`);
        console.log(`   - Truly Generic (Universal) mapped: ${counts.trulyGeneric}`);
        console.log(`   - Honda Bike products refined: ${counts.movedTo2W}`);

    } catch (e) { console.error(e); }
    process.exit(0);
}
perfectLinking();
