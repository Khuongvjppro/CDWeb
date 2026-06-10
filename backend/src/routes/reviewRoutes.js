const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { authenticateToken } = require("../middleware/auth");

// Public route to get reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);

// Protected route to submit a review
router.post("/", authenticateToken, reviewController.createReview);

module.exports = router;
