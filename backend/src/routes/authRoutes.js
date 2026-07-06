const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/profile", authenticateToken, authController.getProfile);
router.put("/profile", authenticateToken, authController.updateProfile);
router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  authController.getAllUsers,
);

module.exports = router;
