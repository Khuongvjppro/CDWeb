/**
 * Database Migration Script for Reviews Table
 * Usage: node migrate-reviews.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'coffee_shop',
});

async function migrate() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✓ Connected to database');

    console.log('\n⚙️  Creating reviews table if it does not exist...');
    
    // Create reviews table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTableQuery);
    console.log('✓ Table reviews created or already exists.');

    console.log('\n✓ Migration completed successfully!');

  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.release();
    }
    await pool.end();
  }
}

console.log('🚀 Starting reviews migration...\n');
migrate().then(() => {
  console.log('\n✅ Done!');
  process.exit(0);
});
