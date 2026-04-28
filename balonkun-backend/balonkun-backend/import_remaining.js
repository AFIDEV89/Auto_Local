import XLSX from 'xlsx';
import db from './src/database/index.js';

const run = async () => {
    try {
        console.log("Connecting to database...");
        await db.Sequelize.authenticate;
        console.log("Connected.");

        // Read excel
        const workbook = XLSX.readFile('C:\\Users\\prabh\\OneDrive\\Documents\\remaining.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`Found ${data.length} records in remaining.xlsx. Processing...`);

        const defaultVehicleDetail = await db.vehicleDetails.findOne();
        if (!defaultVehicleDetail) {
            console.error("No vehicle details found in DB to link to products.");
            process.exit(1);
        }
        const vehicle_details_id = defaultVehicleDetail.id;

        // Track subcategories
        const subCatCache = {};
        
        let createdCount = 0;
        let updatedCount = 0;

        for (let row of data) {
            // Handle different key naming
            const subNameRaw = row.subcategory || row.Subcategory || "Unknown";
            const subName = subNameRaw.trim();
            
            if (!subCatCache[subName]) {
                const canonical = subName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const [subCat, created] = await db.subcategories.findOrCreate({
                    where: { canonical: canonical },
                    defaults: {
                        name: subName.charAt(0).toUpperCase() + subName.slice(1), // Capitalize first letter for display
                        canonical: canonical,
                        category_id: 11
                    }
                });
                subCatCache[subName] = subCat.id;
                if (created) console.log(`Created subcategory: ${subName}`);
            }

            const subcategory_id = subCatCache[subName];
            
            const productData = {
                category_id: 11, // Accessories
                subcategory_id: subcategory_id,
                vehicle_details_id: vehicle_details_id, 
                name: row.name,
                original_price: row.price || 0,
                discounted_price: row.price || 0,
                detail: "",
                description: row.description || "",
                additional_info: (typeof row.additional_info === 'string') ? row.additional_info : JSON.stringify(row.additional_info),
                product_code: row.product_id || null,
                seo_title: row.name,
                seo_canonical: row.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                availability: 'In Stock'
            };

            // Upsert based on name
            const existingProduct = await db.products.findOne({ where: { name: row.name, category_id: 11 } });
            
            if (existingProduct) {
                // Update
                await existingProduct.update(productData);
                console.log(`Updated: ${row.name}`);
                updatedCount++;
            } else {
                // Create
                await db.products.create(productData);
                console.log(`Created: ${row.name}`);
                createdCount++;
            }
        }

        console.log("Import successfully completed!");
        console.log(`Total Handled: ${data.length}`);
        console.log(`Created: ${createdCount}`);
        console.log(`Updated: ${updatedCount}`);

        process.exit(0);

    } catch (error) {
        console.error("Import failed:", error);
        process.exit(1);
    }
}

run();
