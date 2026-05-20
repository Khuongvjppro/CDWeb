const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    // Create order
    const orderResult = await Order.createOrder({
      userId: req.user.id,
      totalAmount,
      status: "pending",
      shippingAddress,
    });

    const orderId = orderResult.insertId;

    // Add items to order
    for (const item of items) {
      await Order.addOrderItem(
        orderId,
        item.productId,
        item.quantity,
        item.price,
      );
    }

    res.status(201).json({ message: "Order created", orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const items = await Order.getOrderItems(req.params.id);
    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.updateOrderStatus(req.params.id, status);
    res.json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
