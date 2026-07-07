const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
      return res.status(400).json({ message: "Sản phẩm và số sao là bắt buộc." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Số sao phải từ 1 đến 5." });
    }

    // Check if user has bought the product
    const hasBought = await Review.checkUserBoughtProduct(userId, productId);
    if (!hasBought) {
      return res.status(403).json({ message: "Bạn cần mua sản phẩm này để có thể đánh giá." });
    }

    // Optional: Check if user already reviewed
    const hasReviewed = await Review.hasUserReviewed(userId, productId);
    if (hasReviewed) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi." });
    }

    await Review.createReview(userId, productId, rating, comment);

    // Fetch updated average
    const stats = await Review.getAverageRating(productId);

    res.status(201).json({
      message: "Cảm ơn bạn đã đánh giá!",
      stats
    });
  } catch (error) {
    console.error("Lỗi khi tạo đánh giá:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi tạo đánh giá." });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.getReviewsByProductId(productId);
    const stats = await Review.getAverageRating(productId);

    res.status(200).json({
      reviews,
      stats
    });
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy danh sách đánh giá." });
  }
};
