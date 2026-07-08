const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// Public route to get reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);

// Protected route to submit a review
router.post("/", authenticateToken, reviewController.createReview);

// Admin routes
router.get("/admin", authenticateToken, authorizeAdmin, reviewController.getAllReviews);
router.delete("/admin/:id", authenticateToken, authorizeAdmin, reviewController.deleteReview);

module.exports = router;
