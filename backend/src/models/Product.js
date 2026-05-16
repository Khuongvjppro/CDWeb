const pool = require('../config/database');

class Product {
  static formatProduct(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description || '',
      price: Number(row.price) || 0,
      sale_price: row.sale_price !== null && row.sale_price !== undefined ? Number(row.sale_price) : null,
      image: row.image_url || row.image || '',
      category: row.category_name || row.category || '',
      categoryId: row.category_id || null,
      brand: row.brand || '',
      size: row.size || '',
      stock: Number(row.stock) || 0,
      is_featured: Boolean(row.is_featured),
      is_new: Boolean(row.is_new),
      createdAt: row.created_at || row.createdAt || null,
      updatedAt: row.updated_at || row.updatedAt || null,
    };
  }

  static async resolveCategoryId(category) {
    if (!category) {
      return null;
    }

    if (Number.isInteger(category) || /^\d+$/.test(String(category))) {
      return Number(category);
    }

    const [rows] = await pool.execute('SELECT id FROM categories WHERE name = ?', [category]);
    return rows[0] ? rows[0].id : null;
  }

  static async createProduct(productData) {
    const {
      name,
      description,
      price,
      image,
      image_url,
      category,
      category_id,
      stock,
      brand = 'Coffee Shop',
      size = 'M',
      sale_price = null,
      is_featured = 0,
      is_new = 0,
    } = productData;

    const resolvedCategoryId = category_id || await Product.resolveCategoryId(category);
    const slug = String(name || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const query = `
      INSERT INTO products
        (category_id, name, slug, description, brand, size, price, sale_price, image_url, stock, is_featured, is_new, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const result = await pool.execute(query, [
      resolvedCategoryId,
      name,
      slug,
      description || '',
      brand,
      size,
      price,
      sale_price,
      image_url || image || '',
      stock || 0,
      is_featured ? 1 : 0,
      is_new ? 1 : 0,
    ]);
    return result[0];
  }

  static async getProductById(id) {
    const query = `
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.slug,
        p.description,
        p.brand,
        p.size,
        p.price,
        p.sale_price,
        p.image_url,
        p.stock,
        p.is_featured,
        p.is_new,
        p.created_at,
        p.updated_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const result = await pool.execute(query, [id]);
    return result[0][0] ? Product.formatProduct(result[0][0]) : null;
  }

  static async getAllProducts() {
    const query = `
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.slug,
        p.description,
        p.brand,
        p.size,
        p.price,
        p.sale_price,
        p.image_url,
        p.stock,
        p.is_featured,
        p.is_new,
        p.created_at,
        p.updated_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    const result = await pool.execute(query);
    return result[0].map(Product.formatProduct);
  }

  static async getProductsByCategory(category) {
    const query = `
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.slug,
        p.description,
        p.brand,
        p.size,
        p.price,
        p.sale_price,
        p.image_url,
        p.stock,
        p.is_featured,
        p.is_new,
        p.created_at,
        p.updated_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.name = ?
      ORDER BY p.name ASC
    `;
    const result = await pool.execute(query, [category]);
    return result[0].map(Product.formatProduct);
  }

  static async updateProduct(id, productData) {
    const {
      name,
      description,
      price,
      image,
      image_url,
      category,
      category_id,
      stock,
      brand = 'Coffee Shop',
      size = 'M',
      sale_price = null,
      is_featured = 0,
      is_new = 0,
    } = productData;

    const resolvedCategoryId = category_id || await Product.resolveCategoryId(category);
    const slug = String(name || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const query = `
      UPDATE products
      SET category_id = ?, name = ?, slug = ?, description = ?, brand = ?, size = ?, price = ?, sale_price = ?, image_url = ?, stock = ?, is_featured = ?, is_new = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const result = await pool.execute(query, [
      resolvedCategoryId,
      name,
      slug,
      description || '',
      brand,
      size,
      price,
      sale_price,
      image_url || image || '',
      stock || 0,
      is_featured ? 1 : 0,
      is_new ? 1 : 0,
      id,
    ]);
    return result[0];
  }

  static async deleteProduct(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    const result = await pool.execute(query, [id]);
    return result[0];
  }

  static async searchProducts(keyword) {
    const query = `
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.slug,
        p.description,
        p.brand,
        p.size,
        p.price,
        p.sale_price,
        p.image_url,
        p.stock,
        p.is_featured,
        p.is_new,
        p.created_at,
        p.updated_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)
      ORDER BY p.created_at DESC
    `;
    const searchTerm = `%${keyword}%`;
    const result = await pool.execute(query, [searchTerm, searchTerm, searchTerm]);
    return result[0].map(Product.formatProduct);
  }
}

module.exports = Product;
