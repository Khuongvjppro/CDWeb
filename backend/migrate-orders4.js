const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function migrate() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1', // Try 127.0.0.1 instead of localhost
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'coffee_shop',
    });
    console.log('Connected to database (127.0.0.1)');

    const [columns] = await connection.query(`
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
        await connection.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.definition}`);
      } else {
        console.log(`${col.name} already exists.`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
