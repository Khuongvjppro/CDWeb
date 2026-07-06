const pool = require("../config/database");

class Order {
  static async createOrder(orderData, connection = pool) {
    const {
      userId,
      totalAmount,
      status,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      vnpTxnRef,
      vnpTransactionNo,
      vnpResponseCode,
      vnpPayDate,
    } = orderData;
    const query =
      "INSERT INTO orders (userId, totalAmount, status, shippingAddress, paymentMethod, paymentStatus, vnpTxnRef, vnpTransactionNo, vnpResponseCode, vnpPayDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    const result = await connection.execute(query, [
      userId,
      totalAmount,
      status,
      shippingAddress,
      paymentMethod || "vnpay",
      paymentStatus || "pending",
      vnpTxnRef || null,
      vnpTransactionNo || null,
      vnpResponseCode || null,
      vnpPayDate || null,
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

  static async updatePaymentInfo(id, paymentInfo) {
    const {
      status,
      paymentStatus,
      vnpTxnRef,
      vnpTransactionNo,
      vnpResponseCode,
      vnpPayDate,
    } = paymentInfo;
    const query =
      "UPDATE orders SET status = ?, paymentStatus = ?, vnpTxnRef = ?, vnpTransactionNo = ?, vnpResponseCode = ?, vnpPayDate = ? WHERE id = ?";
    const result = await pool.execute(query, [
      status,
      paymentStatus,
      vnpTxnRef || null,
      vnpTransactionNo || null,
      vnpResponseCode || null,
      vnpPayDate || null,
      id,
    ]);
    return result[0];
  }

  static async addOrderItem(orderId, productId, quantity, price, connection = pool) {
    const query =
      "INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)";
    const result = await connection.execute(query, [
      orderId,
      productId,
      quantity,
      price,
    ]);
    return result[0];
  }

  static async getOrderItems(orderId) {
    const query =
      "SELECT oi.*, p.name, p.image_url AS image FROM order_items oi JOIN products p ON oi.productId = p.id WHERE oi.orderId = ?";
    const result = await pool.execute(query, [orderId]);
    return result[0];
  }
}

module.exports = Order;
