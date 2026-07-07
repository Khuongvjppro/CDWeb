const mysql = require('mysql2/promise');

(async () => {
  try {
    const pool = mysql.createPool({ 
      host: '127.0.0.1', 
      port: 3307, 
      user: 'root', 
      password: '', 
      database: 'coffee_shop' 
    }); 
    const cols = []; 
    const [columns] = await pool.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'orders' AND TABLE_SCHEMA = 'coffee_shop'"); 
    const columnNames = columns.map(c => c.COLUMN_NAME); 
    
    if (!columnNames.includes('paymentMethod')) cols.push("ADD COLUMN paymentMethod VARCHAR(50) DEFAULT 'vnpay'"); 
    if (!columnNames.includes('paymentStatus')) cols.push("ADD COLUMN paymentStatus VARCHAR(50) DEFAULT 'pending'"); 
    if (!columnNames.includes('vnpTxnRef')) cols.push("ADD COLUMN vnpTxnRef VARCHAR(100) NULL"); 
    if (!columnNames.includes('vnpTransactionNo')) cols.push("ADD COLUMN vnpTransactionNo VARCHAR(100) NULL"); 
    if (!columnNames.includes('vnpResponseCode')) cols.push("ADD COLUMN vnpResponseCode VARCHAR(10) NULL"); 
    if (!columnNames.includes('vnpPayDate')) cols.push("ADD COLUMN vnpPayDate VARCHAR(50) NULL"); 
    
    if (cols.length > 0) { 
      console.log('Migrating...'); 
      await pool.query("ALTER TABLE orders " + cols.join(', ')); 
    } 
    console.log('Migration OK'); 
    process.exit(0); 
  } catch(e) { 
    console.error(e.message); 
    process.exit(1); 
  }
})();
