const pool = require("../config/database");

class Order {
  static async createOrder(orderData) {
    const { userId, totalAmount, status, shippingAddress } = orderData;
    const query =
      "INSERT INTO orders (userId, totalAmount, status, shippingAddress, createdAt) VALUES (?, ?, ?, ?, NOW())";
    const result = await pool.execute(query, [
      userId,
      totalAmount,
      status,
      shippingAddress,
    ]);
    return result[0];
  }

  static async getOrderById(id) {
    const query = "SELECT * FROM orders WHERE id = ?";
    const result = await pool.execute(query, [id]);
    return result[0][0];
  }

  static async getUserOrders(userId) {
    const query =
      "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC";
    const result = await pool.execute(query, [userId]);
    return result[0];
  }

  static async getAllOrders() {
    const query = "SELECT * FROM orders ORDER BY createdAt DESC";
    const result = await pool.execute(query);
    return result[0];
  }

  static async updateOrderStatus(id, status) {
    const query = "UPDATE orders SET status = ? WHERE id = ?";
    const result = await pool.execute(query, [status, id]);
    return result[0];
  }

  static async addOrderItem(orderId, productId, quantity, price) {
    const query =
      "INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)";
    const result = await pool.execute(query, [
      orderId,
      productId,
      quantity,
      price,
    ]);
    return result[0];
  }

  static async getOrderItems(orderId) {
    const query =
      "SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.productId = p.id WHERE oi.orderId = ?";
    const result = await pool.execute(query, [orderId]);
    return result[0];
  }
}

module.exports = Order;
