import db from './src/database/index.js';
import fs from 'fs';

async function listAll() {
    try {
        const brands = await db.brands.findAll({
            where: { vehicle_type_id: 2 },
            order: [['name', 'ASC']],
            logging: false
        });

        let report = `=== ALL 4W MAKES & THEIR MODELS ===\n\n`;

        for (const brand of brands) {
            const models = await db.brandModels.findAll({
                where: { brand_id: brand.id },
                order: [['name', 'ASC']],
                logging: false
            });

            report += `📦 ${brand.name.trim()} (Brand ID: ${brand.id}) — ${models.length} models\n`;
            
            if (models.length > 0) {
                models.forEach(m => {
                    report += `   └── ${m.name.trim()} (Model ID: ${m.id})\n`;
                });
            } else {
                report += `   └── (No models)\n`;
            }
            report += `\n`;
        }

        fs.writeFileSync('all_4w_makes_models.txt', report);
        console.log(report);

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
listAll();
