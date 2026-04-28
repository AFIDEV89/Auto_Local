import db from './src/database/index.js';

async function auditProduct() {
  try {
    const [prods] = await db.query(
      "SELECT p.id, p.name, p.brand_id, p.vehicle_details_id, b.name as brand_name, m.name as model_name FROM products p LEFT JOIN brands b ON p.brand_id = b.id LEFT JOIN vehicle_details vd ON p.vehicle_details_id = vd.id LEFT JOIN brand_models m ON vd.model_id = m.id WHERE p.name LIKE '%XCLUSIVE Plus%'"
    );
    console.log(prods);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

auditProduct();
