import db from './src/database/index.js';
import fs from 'fs';

async function research() {
    try {
        const products = await db.products.findAll({
            where: { category_id: 10, subcategory_id: null },
            include: [
                { model: db.vehicleDetails, include: [{ model: db.brands }] },
                { model: db.brands }
            ],
            logging: false
        });

        const designs = await db.designs.findAll({ attributes: ['id', 'name'], logging: false });
        const designNames = designs.map(d => ({ id: d.id, name: d.name.toLowerCase() }));

        let analysis = `=== ANALYSIS OF 714 REMAINING PRODUCTS ===\n\n`;
        let matchCount = 0;

        const results = products.map(p => {
            const lowerName = p.name.toLowerCase();
            let matchedDesign = designNames.find(d => lowerName.includes(d.name));
            
            let vehicleType = 0;
            if (p.vehicle_detail && p.vehicle_detail.brand) {
                vehicleType = p.vehicle_detail.brand.vehicle_type_id;
            } else if (p.brand) {
                vehicleType = p.brand.vehicle_type_id;
            }

            if (matchedDesign) matchCount++;

            return {
                id: p.id,
                name: p.name,
                matchedDesign: matchedDesign ? matchedDesign.name : 'NONE',
                vehicleType: vehicleType === 2 ? '4W' : (vehicleType === 1 ? '2W' : 'UNKNOWN')
            };
        });

        analysis += `Total Products: ${products.length}\n`;
        analysis += `Products with Design in Name: ${matchCount}\n`;
        analysis += `----------------------------------------\n\n`;

        results.slice(0, 50).forEach(r => {
            analysis += `[ID: ${r.id}] [Type: ${r.vehicleType}] [Design Match: ${r.matchedDesign}] ${r.name}\n`;
        });

        fs.writeFileSync('name_match_research.txt', analysis);
        console.log("✅ Research complete. See name_match_research.txt");

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
research();
