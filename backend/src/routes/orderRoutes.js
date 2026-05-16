const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// User routes
router.post('/', authenticateToken, orderController.createOrder);
router.get('/user', authenticateToken, orderController.getUserOrders);
router.get('/details/:id', authenticateToken, orderController.getOrderDetails);

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticateToken, authorizeAdmin, orderController.updateOrderStatus);

module.exports = router;
