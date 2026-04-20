import db from './src/database/index.js';
import { Op } from 'sequelize';

async function perfectLinkingBatched() {
    console.log("=== PERFECT 4W PRODUCT HIERARCHY RESTORATION (STAGING - BATCHED) ===\n");

    try {
        // 1. Load Reference Data
        const brands = await db.brands.findAll({ where: { vehicle_type_id: 2 }, logging: false });
        const allModels = await db.brandModels.findAll({ logging: false });
        const vds = await db.vehicleDetails.findAll({ logging: false });
        const products = await db.products.findAll({
            where: { category_id: 10 },
            attributes: ['id', 'name', 'brand_id', 'vehicle_details_id', 'vehicle_type_id'],
            logging: false
        });

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

        const trulyGenericIds = Array.from({ length: 9981 - 9959 + 1 }, (_, i) => 9959 + i);
        const universalBrandId = 38;
        const universalModelId = 199;
        const universalVdId = vdMap[`${universalBrandId}:${universalModelId}`];

        console.log(`📡 Total Products to process: ${products.length}\n`);

        let counts = { modelSpecific: 0, makeOnly: 0, trulyGeneric: 0, movedTo2W: 0, totalProcessed: 0 };
        const BATCH_SIZE = 50;

        for (let i = 0; i < products.length; i += BATCH_SIZE) {
            const batch = products.slice(i, i + BATCH_SIZE);
            
            await Promise.all(batch.map(async (p) => {
                const name = p.name;
                const lowerName = name.toLowerCase();

                // 1. Truly Generic
                if (trulyGenericIds.includes(p.id)) {
                    await db.products.update({ brand_id: universalBrandId, vehicle_details_id: universalVdId, vehicle_type_id: 2 }, { where: { id: p.id }, logging: false });
                    counts.trulyGeneric++;
                } 
                // 2. Honda Bike leak check
                else if ((['cd110', 'shine', 'activa', 'dio', 'unicorn', 'grazia', 'navi sx', 'navi bs4', 'navi bs6', 'cb shine', 'dream yuga'].some(w => lowerName.includes(w))) && (lowerName.includes('honda')) && !lowerName.includes('navigation')) {
                    await db.products.update({ brand_id: 37, vehicle_type_id: 1 }, { where: { id: p.id }, logging: false });
                    counts.movedTo2W++;
                }
                // 3. Match 4W brand & Model
                else {
                    let matchedBrand = brands.find(b => lowerName.includes(b.name.trim().toLowerCase()));
                    if (matchedBrand) {
                        const brandModels = allModels.filter(m => m.brand_id === matchedBrand.id);
                        brandModels.sort((a, b) => b.name.trim().length - a.name.trim().length);

                        let targetModelId = null;
                        let isMakeOnly = true;

                        for (const m of brandModels) {
                            const mName = m.name.trim().toLowerCase();
                            if (mName === matchedBrand.name.trim().toLowerCase()) continue;

                            if (mName.length >= 2 && lowerName.includes(mName)) {
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
                }
            }));

            counts.totalProcessed += batch.length;
            if (counts.totalProcessed % 500 === 0 || counts.totalProcessed === products.length) {
                console.log(`✅ Progress: ${counts.totalProcessed}/${products.length} processed...`);
            }
        }

        console.log(`\n🚀 BATCHED RESTORATION COMPLETE!`);
        console.log(`   - Model-Specific mapped: ${counts.modelSpecific}`);
        console.log(`   - Make-Only mapped: ${counts.makeOnly}`);
        console.log(`   - Truly Generic (Universal) mapped: ${counts.trulyGeneric}`);
        console.log(`   - Honda Bike products refined: ${counts.movedTo2W}`);

    } catch (e) {
        console.error("Batch Fix Error:", e);
    }
    process.exit(0);
}
perfectLinkingBatched();
