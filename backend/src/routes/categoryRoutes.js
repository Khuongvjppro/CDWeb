const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// Public endpoints
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin only endpoints
router.post("/", authenticateToken, authorizeAdmin, categoryController.createCategory);
router.put("/:id", authenticateToken, authorizeAdmin, categoryController.updateCategory);
router.delete("/:id", authenticateToken, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;
