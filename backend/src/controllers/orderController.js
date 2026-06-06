const Order = require("../models/Order");
const Product = require("../models/Product");
const { buildPaymentUrl, verifySignature } = require("../utils/vnpay");

function buildReturnUrl(req) {
  return (
    process.env.VNPAY_RETURN_URL ||
    `${req.protocol}://${req.get("host")}/api/orders/vnpay/return`
  );
}

function buildIpnUrl(req) {
  return (
    process.env.VNPAY_IPN_URL ||
    `${req.protocol}://${req.get("host")}/api/orders/vnpay/ipn`
  );
}

async function handleVnpayCallback(req, res, shouldRedirect) {
  try {
    const hashSecret = process.env.VNPAY_HASH_SECRET;

    if (!hashSecret) {
      return res.status(500).json({ error: "VNPay configuration is missing" });
    }

    if (!verifySignature(req.query, hashSecret)) {
      if (shouldRedirect) {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders?payment=failed`,
        );
      }

      return res
        .status(400)
        .json({ RspCode: "97", Message: "Invalid signature" });
    }

    const orderId = Number(req.query.vnp_TxnRef);
    const responseCode = String(req.query.vnp_ResponseCode || "");
    const transactionStatus = String(req.query.vnp_TransactionStatus || "");
    const transactionNo = req.query.vnp_TransactionNo || null;
    const payDate = req.query.vnp_PayDate || null;
    const amount = Number(req.query.vnp_Amount || 0) / 100;

    const order = await Order.getOrderById(orderId);
    if (!order) {
      if (shouldRedirect) {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders?payment=failed`,
        );
      }

      return res
        .status(404)
        .json({ RspCode: "01", Message: "Order not found" });
    }

    if (Number(order.totalAmount) !== Number(amount)) {
      if (shouldRedirect) {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders?payment=failed`,
        );
      }

      return res.status(400).json({ RspCode: "04", Message: "Invalid amount" });
    }

    const isSuccess = responseCode === "00" && transactionStatus === "00";
    const nextStatus = isSuccess ? "processing" : "cancelled";
    const nextPaymentStatus = isSuccess ? "paid" : "failed";

    await Order.updatePaymentInfo(orderId, {
      status: nextStatus,
      paymentStatus: nextPaymentStatus,
      vnpTxnRef: req.query.vnp_TxnRef,
      vnpTransactionNo: transactionNo,
      vnpResponseCode: responseCode,
      vnpPayDate: payDate,
    });

    if (shouldRedirect) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      return res.redirect(
        `${frontendUrl}/orders?payment=${isSuccess ? "success" : "failed"}&orderId=${orderId}`,
      );
    }

    return res.json({
      RspCode: isSuccess ? "00" : "00",
      Message: isSuccess ? "Confirm Success" : "Confirm Success",
    });
  } catch (error) {
    if (shouldRedirect) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders?payment=failed`,
      );
    }

    return res.status(500).json({ RspCode: "99", Message: error.message });
  }
}

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod = "vnpay",
      paymentInfo = {},
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId || item.id,
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    }));

    const invalidItem = normalizedItems.find((item) => !item.productId);
    if (invalidItem) {
      return res.status(400).json({
        error: "Each order item must include a product id",
      });
    }

    // Create order
    const orderResult = await Order.createOrder({
      userId: req.user.id,
      totalAmount: Number(totalAmount) || 0,
      status: "pending",
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
    });

    const orderId = orderResult.insertId;

    // Add items to order
    for (const item of normalizedItems) {
      await Order.addOrderItem(
        orderId,
        item.productId,
        item.quantity,
        item.price,
      );
    }

    if (paymentMethod === "vnpay") {
      const paymentUrl = buildPaymentUrl({
        req,
        orderId,
        amount: totalAmount,
        orderInfo:
          paymentInfo.orderInfo ||
          `Thanh toan don hang ${orderId} - CoffeeShop`,
        returnUrl: paymentInfo.returnUrl || buildReturnUrl(req),
        ipnUrl: paymentInfo.ipnUrl || buildIpnUrl(req),
        bankCode: paymentInfo.bankCode,
      });

      await Order.updatePaymentInfo(orderId, {
        status: "pending",
        paymentStatus: "pending",
        vnpTxnRef: String(orderId),
        vnpTransactionNo: null,
        vnpResponseCode: null,
        vnpPayDate: null,
      });

      return res.status(201).json({
        message: "Order created",
        orderId,
        paymentUrl,
      });
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

exports.vnpayReturn = async (req, res) => {
  return handleVnpayCallback(req, res, true);
};

exports.vnpayIpn = async (req, res) => {
  return handleVnpayCallback(req, res, false);
};
