const pool = require('../config/database');

class User {
  static async createUser(userData) {
    const { email, password, fullName, phone } = userData;
    const query = 'INSERT INTO users (email, password, fullName, phone, role, createdAt) VALUES (?, ?, ?, ?, ?, NOW())';
    const result = await pool.execute(query, [email, password, fullName, phone, 'user']);
    return result[0];
  }

  static async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await pool.execute(query, [email]);
    return result[0][0];
  }

  static async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await pool.execute(query, [id]);
    return result[0][0];
  }

  static async updateUser(id, userData) {
    const { fullName, phone, address } = userData;
    const query = 'UPDATE users SET fullName = ?, phone = ?, address = ? WHERE id = ?';
    const result = await pool.execute(query, [fullName, phone, address, id]);
    return result[0];
  }

  static async getAllUsers() {
    const query = 'SELECT id, email, fullName, phone, role, createdAt FROM users';
    const result = await pool.execute(query);
    return result[0];
  }
}

module.exports = User;
