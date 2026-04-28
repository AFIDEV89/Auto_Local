import mysql2 from 'mysql2/promise';

const conn = await mysql2.createConnection({
  host: 'staging-autoformdb.cpqpdscnexwq.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Autoform123',
  database: 'dev-autoform',
  port: 3306
});

// The source product names that were being cloned
const SOURCE_IDS = [
  8985, 8986, 8987, 8988, 8989, 9232, 9233, 9234, 9235, 9236, 9237, 9238,
  9239, 9241, 9243, 9244, 9245, 9246, 9247, 9248, 9249, 9250, 9251, 9255,
  9256, 9257, 9258, 9259, 9260, 9261, 9262, 9263, 9264, 9265, 9266, 9267,
  9268, 9231, 9983, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014,
  10015, 10016, 10017, 10018, 10019, 10020, 10032, 10033, 10037,
  9211, 9982, 9984, 9985, 9986, 10036
];

// 1. Find the names of source products
const [srcProds] = await conn.query(
  `SELECT name FROM products WHERE id IN (${SOURCE_IDS.join(',')})`
);
const sourceNames = srcProds.map(p => p.name);
console.log(`Source product names to check: ${sourceNames.length}`);

// 2. Find all CLONED rows (same name, but id NOT in original source IDs)
const escapedNames = sourceNames.map(n => conn.escape(n)).join(',');
const [clonedProds] = await conn.query(`
  SELECT id, name, vehicle_details_id
  FROM products
  WHERE name IN (${escapedNames})
  AND id NOT IN (${SOURCE_IDS.join(',')})
  ORDER BY id
`);

console.log(`\nCloned products found: ${clonedProds.length}`);

if (clonedProds.length > 0) {
  const clonedIds = clonedProds.map(p => p.id);
  console.log(`IDs to delete: ${clonedIds.slice(0, 20).join(', ')}${clonedIds.length > 20 ? '...' : ''}`);
  console.log(`Min ID: ${Math.min(...clonedIds)}, Max ID: ${Math.max(...clonedIds)}`);

  // 3. Delete their product_variants first
  const [varDel] = await conn.query(
    `DELETE FROM product_variants WHERE product_id IN (${clonedIds.join(',')})`
  );
  console.log(`\nDeleted ${varDel.affectedRows} product_variants`);

  // 4. Delete the cloned products themselves
  const [prodDel] = await conn.query(
    `DELETE FROM products WHERE id IN (${clonedIds.join(',')})`
  );
  console.log(`Deleted ${prodDel.affectedRows} products`);

  console.log('\n✅ Revert complete — staging DB is clean!');
} else {
  console.log('\n✅ No clones found — DB was not modified (connection reset before any inserts)');
}

await conn.end();
