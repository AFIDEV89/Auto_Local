import XLSX from 'xlsx';
import db from './src/database/index.js';

const run = async () => {
    try {
        console.log("Connecting to database...");
        await db.Sequelize.authenticate;
        console.log("Connected.");

        // Read excel
        const workbook = XLSX.readFile('C:\\Users\\prabh\\OneDrive\\Documents\\audio&security.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`Found ${data.length} records. Processing...`);

        // Get a universal vehicle detail ID or generic one to bypass vehicle_details_id constraint
        // Sometimes Universal is associated with a specific vehicle details ID, like 1 or the first one.
        const defaultVehicleDetail = await db.vehicleDetails.findOne();
        if (!defaultVehicleDetail) {
            console.error("No vehicle details found in DB to link to products.");
            process.exit(1);
        }
        const vehicle_details_id = defaultVehicleDetail.id;
        console.log(`Using generic vehicle_details_id = ${vehicle_details_id}`);

        // Track subcategories
        const subCatCache = {};

        let productsToCreate = [];

        for (let row of data) {
            // Normalize subcategory
            const subName = row.Subcategory ? row.Subcategory.trim() : "Unknown";
            
            if (!subCatCache[subName]) {
                const canonical = subName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const [subCat, created] = await db.subcategories.findOrCreate({
                    where: { canonical: canonical },
                    defaults: {
                        name: subName,
                        canonical: canonical,
                        category_id: 11
                    }
                });
                subCatCache[subName] = subCat.id;
                if (created) console.log(`Created new subcategory: ${subName}`);
            }

            const subcategory_id = subCatCache[subName];
            
            productsToCreate.push({
                category_id: 11, // Accessories
                subcategory_id: subcategory_id,
                vehicle_details_id: vehicle_details_id, // Setting a valid ID
                name: row.name,
                original_price: row.price || 0,
                discounted_price: row.price || 0, // Assume price provided is selling price
                detail: "",
                description: "",
                additional_info: row.additional_info || "[]",
                product_code: row.product_id,
                seo_title: row.name,
                seo_canonical: row.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                availability: 'In Stock'
            });
        }

        console.log("Bulk creating products...");
        await db.products.bulkCreate(productsToCreate);
        console.log("Import successfully completed!");

        process.exit(0);

    } catch (error) {
        console.error("Import failed:", error);
        process.exit(1);
    }
}

run();
