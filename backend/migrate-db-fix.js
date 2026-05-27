/**
 * Database Migration Script
 * Run this to fix the products table schema
 * Usage: node migrate-db.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'coffee_shop',
  multipleStatements: true,
});

async function migrate() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✓ Connected to database');

    // Check if products table has the required columns
    console.log('\n🔍 Checking products table schema...');
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' AND TABLE_SCHEMA = 'coffee_shop'
    `);

    const columnNames = columns.map(c => c.COLUMN_NAME);
    console.log('Existing columns:', columnNames.join(', '));

    // Check if migration is needed
    const needsMigration = !columnNames.includes('category_id') || !columnNames.includes('image_url');

    if (!needsMigration) {
      console.log('✓ Database schema is already up to date!');
      return;
    }

    console.log('\n⚙️  Running migration...');

    // Start transaction
    await connection.query('START TRANSACTION');

    // Step 1: Add new columns if they don't exist
    if (!columnNames.includes('category_id')) {
      console.log('  → Adding category_id column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN category_id INT NULL AFTER id
      `);
    }

    if (!columnNames.includes('slug')) {
      console.log('  → Adding slug column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE NULL AFTER name
      `);
    }

    if (!columnNames.includes('brand')) {
      console.log('  → Adding brand column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN brand VARCHAR(100) DEFAULT 'Highlands Coffee' AFTER description
      `);
    }

    if (!columnNames.includes('size')) {
      console.log('  → Adding size column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN size VARCHAR(50) DEFAULT 'M' AFTER brand
      `);
    }

    if (!columnNames.includes('sale_price')) {
      console.log('  → Adding sale_price column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN sale_price DECIMAL(10, 2) NULL AFTER price
      `);
    }

    if (!columnNames.includes('image_url')) {
      console.log('  → Adding image_url column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN image_url VARCHAR(255) NULL AFTER sale_price
      `);
    }

    if (!columnNames.includes('is_featured')) {
      console.log('  → Adding is_featured column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN is_featured TINYINT DEFAULT 0 AFTER stock
      `);
    }

    if (!columnNames.includes('is_new')) {
      console.log('  → Adding is_new column...');
      await connection.query(`
        ALTER TABLE products ADD COLUMN is_new TINYINT DEFAULT 0 AFTER is_featured
      `);
    }

    // Step 2: Update category_id from category name
    console.log('  → Populating category_id from category names...');
    await connection.query(`
      UPDATE products p
      JOIN categories c ON p.category = c.name
      SET p.category_id = c.id
      WHERE p.category_id IS NULL
    `);

    // Step 3: Populate image_url from image column
    if (columnNames.includes('image')) {
      console.log('  → Populating image_url from image column...');
      await connection.query(`
        UPDATE products SET image_url = image WHERE image_url IS NULL OR image_url = ''
      `);
    }

    // Step 4: Generate slugs
    console.log('  → Generating slugs for products...');
    await connection.query(`
      UPDATE products SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), 'à', 'a'))
      WHERE slug IS NULL
    `);

    // Step 5: Add foreign key if not exists
    console.log('  → Adding foreign key constraint...');
    try {
      // First remove old constraint if exists
      await connection.query(`
        ALTER TABLE products DROP FOREIGN KEY products_ibfk_1
      `).catch(() => {}); // Ignore if constraint doesn't exist

      // Add new constraint
      await connection.query(`
        ALTER TABLE products ADD CONSTRAINT products_ibfk_1 
        FOREIGN KEY (category_id) REFERENCES categories(id)
      `);
    } catch (err) {
      console.log('  ⚠ Foreign key constraint already exists or error: ', err.message.substring(0, 50));
    }

    // Commit transaction
    await connection.query('COMMIT');
    console.log('\n✓ Migration completed successfully!');

    // Verify results
    console.log('\n📊 Verification:');
    const [products] = await connection.query(`
      SELECT COUNT(*) as total FROM products
    `);
    console.log(`  Total products: ${products[0].total}`);

    const [sampleProducts] = await connection.query(`
      SELECT id, name, category_id, price, stock FROM products LIMIT 3
    `);
    console.log('\n  Sample products:');
    sampleProducts.forEach(p => {
      console.log(`    - ID: ${p.id}, Name: ${p.name}, Category ID: ${p.category_id}, Price: ${p.price}, Stock: ${p.stock}`);
    });

  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    if (connection) {
      await connection.query('ROLLBACK').catch(() => {});
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.release();
    }
    await pool.end();
  }
}

// Run migration
console.log('🚀 Starting database migration...\n');
migrate().then(() => {
  console.log('\n✅ Done!');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
