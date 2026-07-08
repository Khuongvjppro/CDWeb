const pool = require("../config/database");

class Review {
  static async checkUserBoughtProduct(userId, productId) {
    const query = `
      SELECT oi.id 
      FROM order_items oi
      JOIN orders o ON oi.orderId = o.id
      WHERE o.userId = ? AND oi.productId = ? AND o.status != 'cancelled'
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [userId, productId]);
    return rows.length > 0;
  }

  static async hasUserReviewed(userId, productId) {
    const query = `
      SELECT id FROM reviews 
      WHERE user_id = ? AND product_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [userId, productId]);
    return rows.length > 0;
  }

  static async createReview(userId, productId, rating, comment) {
    const query = `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [userId, productId, rating, comment]);
    return result;
  }

  static async getReviewsByProductId(productId) {
    const query = `
      SELECT r.*, u.fullName as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.execute(query, [productId]);
    return rows;
  }

  static async getAverageRating(productId) {
    const query = `
      SELECT AVG(rating) as averageRating, COUNT(*) as reviewCount
      FROM reviews
      WHERE product_id = ?
    `;
    const [rows] = await pool.execute(query, [productId]);
    return {
      averageRating: rows[0].averageRating ? Number(rows[0].averageRating).toFixed(1) : 0,
      reviewCount: rows[0].reviewCount || 0
    };
  }

  static async getAllReviews() {
    const query = `
      SELECT r.*, u.fullName as user_name, u.email as user_email, p.name as product_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async deleteReview(id) {
    const query = `DELETE FROM reviews WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
  }
}

module.exports = Review;
