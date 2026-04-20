import Sequelize from "sequelize";
import config from "../config.js";

const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DIALECT } = config;

const db = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
    port: DATABASE_PORT,
});

async function migrate() {
    try {
        console.log("Checking leads table structure...");
        const [results] = await db.query("DESCRIBE pop_leads");
        console.log("Current structure:", results);
        
        // Ensure contact_no allows NULL
        const contactNoInfo = results.find(r => r.Field === 'contact_no');
        if (contactNoInfo && contactNoInfo.Null === 'NO') {
            console.log("Updating contact_no to allow NULL...");
            await db.query("ALTER TABLE pop_leads MODIFY contact_no VARCHAR(255) NULL");
            console.log("Updated contact_no.");
        }

        // Ensure email exists (it should, but good to check)
        const emailInfo = results.find(r => r.Field === 'email');
        if (!emailInfo) {
            console.log("Adding email column...");
            await db.query("ALTER TABLE pop_leads ADD COLUMN email VARCHAR(255) NULL AFTER customer_name");
            console.log("Added email column.");
        }

        console.log("Migration successful.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await db.close();
    }
}

migrate();
