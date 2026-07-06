const pool = require("../config/database");

class Category {
  static async getAllCategories() {
    const query = "SELECT * FROM categories ORDER BY name ASC";
    const result = await pool.execute(query);
    return result[0];
  }

  static async getCategoryById(id) {
    const query = "SELECT * FROM categories WHERE id = ?";
    const result = await pool.execute(query, [id]);
    return result[0][0];
  }

  static async getCategoryByName(name) {
    const query = "SELECT * FROM categories WHERE name = ?";
    const result = await pool.execute(query, [name]);
    return result[0][0];
  }

  static async createCategory(categoryData) {
    const { name, description } = categoryData;
    const query = "INSERT INTO categories (name, description, createdAt) VALUES (?, ?, NOW())";
    const result = await pool.execute(query, [name, description || ""]);
    return result[0];
  }

  static async updateCategory(id, categoryData) {
    const { name, description } = categoryData;
    const query = "UPDATE categories SET name = ?, description = ? WHERE id = ?";
    const result = await pool.execute(query, [name, description || "", id]);
    return result[0];
  }

  static async deleteCategory(id) {
    const query = "DELETE FROM categories WHERE id = ?";
    const result = await pool.execute(query, [id]);
    return result[0];
  }
}

module.exports = Category;
