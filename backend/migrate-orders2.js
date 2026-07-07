const pool = require('./src/config/database');

async function migrate() {
  try {
    console.log('Connected to database via src/config/database.js');

    const [columns] = await pool.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'orders' AND TABLE_SCHEMA = 'coffee_shop'
    `);
    
    const columnNames = columns.map(c => c.COLUMN_NAME);

    const columnsToAdd = [
      { name: 'paymentMethod', definition: "VARCHAR(50) DEFAULT 'cod'" },
      { name: 'paymentStatus', definition: "VARCHAR(50) DEFAULT 'pending'" },
      { name: 'vnpTxnRef', definition: "VARCHAR(100) NULL" },
      { name: 'vnpTransactionNo', definition: "VARCHAR(100) NULL" },
      { name: 'vnpResponseCode', definition: "VARCHAR(10) NULL" },
      { name: 'vnpPayDate', definition: "VARCHAR(50) NULL" },
    ];

    for (const col of columnsToAdd) {
      if (!columnNames.includes(col.name)) {
        console.log(`Adding ${col.name}...`);
        await pool.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.definition}`);
      } else {
        console.log(`${col.name} already exists.`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    process.exit();
  }
}

migrate();
