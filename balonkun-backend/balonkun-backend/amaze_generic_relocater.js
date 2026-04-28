import db from './src/database/index.js';

async function moveAmazeGenerics() {
  try {
    console.log("🕵️ FINDING AND MOVING THE 23 GENERIC AMAZE DESIGNS...\n");
    // We search for products that START with Amaze, meaning no car brand is in front of them
    const [prods] = await db.query(
      "SELECT id, name, brand_id, vehicle_details_id FROM products WHERE name LIKE 'Amaze+ %' OR name LIKE 'Amaze Plus %' OR name LIKE 'Amaze Duo %'"
    );
    
    console.log(`Found ${prods.length} generic Amaze products.\n`);
    
    let moveCount = 0;
    for (const p of prods) {
       console.log(`🚀 [MOVING] ID: ${p.id} | ${p.name} -> Target: Universal (Brand 38, VD 279)`);
       
       // Update master products table
       await db.query("UPDATE products SET brand_id = 38, vehicle_details_id = 279 WHERE id = :id", { 
           replacements: { id: p.id }
       });
       
       // Update junction table
       await db.query("DELETE FROM product_vehicle_details WHERE product_id = :id", { 
           replacements: { id: p.id }
       });
       await db.query("INSERT INTO product_vehicle_details (product_id, vehicle_details_id, createdAt, updatedAt) VALUES (:id, 279, NOW(), NOW())", { 
           replacements: { id: p.id }
       });
       
       moveCount++;
    }
    
    console.log(`\n✅ Success! Moved ${moveCount} generic styles to the Universal category.`);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

moveAmazeGenerics();
