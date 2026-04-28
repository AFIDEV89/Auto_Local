import mysql from 'mysql2/promise';
import fs from 'fs';

(async () => {
    const c = await mysql.createConnection({
        host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com', 
        user: 'admin', 
        password: 'Autoform123', 
        database: 'dev-autoform'
    });

    const [rows] = await c.query(`
        SELECT p.id as Product_ID, p.name as Product_Name, 
               c.name as Category,
               b.name as Brand_Make,
               bm.name as Model,
               vt.name as Vehicle_Type,
               vd.id as VD_ID
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id
        LEFT JOIN brands b ON vd.brand_id = b.id
        LEFT JOIN brand_models bm ON vd.model_id = bm.id
        LEFT JOIN vehicle_types vt ON vd.vehicle_type_id = vt.id
        WHERE p.category_id IN (11, 12)
        ORDER BY Category, Product_Name
    `);

    let csv = "Product ID,Product Name,Category,Mapped Make (Brand),Mapped Model,Vehicle Type,Vehicle Details ID\n";
    rows.forEach(r => {
        const brand = r.Brand_Make || "UNIVERSAL (NULL)";
        const model = r.Model || "UNIVERSAL (NULL)";
        const vtype = r.Vehicle_Type || "UNKNOWN";
        csv += `${r.Product_ID},"${r.Product_Name}",${r.Category},${brand},${model},${vtype},${r.VD_ID}\n`;
    });

    fs.writeFileSync('D:/Autoform_Local/accessories_mats_current_mapping.csv', csv);
    console.log("Generated mapping file at D:/Autoform_Local/accessories_mats_current_mapping.csv");

    c.end();
})().catch(e => console.error(e));
