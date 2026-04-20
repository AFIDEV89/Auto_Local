import db from '../database/index.js';

async function restore() {
    try {
        console.log("--- RESTORATION SCRIPT STARTING ---");
        console.log("Checking for 'car-accessories' mapping...");
        
        const existing = await db.seoMappings.findOne({ 
            where: { url: 'car-accessories' } 
        });
        
        if (existing) {
            console.log("Mapping already exists with ID:", existing.id);
            console.log("No action needed.");
            return;
        }

        console.log("Restoring missing mapping for Car Accessories (Category ID 11)...");
        const newRecord = await db.seoMappings.create({
            url: 'car-accessories',
            product_category_id: 11,
            seo_page_title: 'Premium Car Accessories - Autoform India',
            category_text: 'Explore our wide range of premium car interior and exterior accessories.',
            seo_page_description: 'Buy premium car interior and exterior accessories at Autoform India. Wide range of car care, organisers, and comfort accessories.',
            canonical_url: 'car-accessories'
        });

        console.log("SUCCESS: New record created with ID:", newRecord.id);
        console.log("The 'Car Accessories' link should now be active.");
    } catch (error) {
        console.error("CRITICAL ERROR during restoration:", error);
        throw error;
    }
}

restore().then(() => {
    console.log("--- SCRIPT FINISHED ---");
    process.exit(0);
}).catch(err => {
    console.error("FATAL:", err);
    process.exit(1);
});
