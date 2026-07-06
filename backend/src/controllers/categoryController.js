const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tên danh mục không được để trống" });
    }

    const existing = await Category.getCategoryByName(name.trim());
    if (existing) {
      return res.status(400).json({ error: "Tên danh mục này đã tồn tại" });
    }

    const result = await Category.createCategory({
      name: name.trim(),
      description,
    });
    res.status(201).json({ message: "Tạo danh mục thành công", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tên danh mục không được để trống" });
    }

    const category = await Category.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }

    const existing = await Category.getCategoryByName(name.trim());
    if (existing && String(existing.id) !== String(id)) {
      return res.status(400).json({ error: "Tên danh mục này đã trùng với một danh mục khác" });
    }

    await Category.updateCategory(id, {
      name: name.trim(),
      description,
    });
    res.json({ message: "Cập nhật danh mục thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }

    await Category.deleteCategory(id);
    res.json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.message.includes("foreign key constraint")) {
      return res.status(400).json({
        error: "Không thể xóa danh mục này vì vẫn còn sản phẩm đang thuộc danh mục! Vui lòng thay đổi danh mục sản phẩm trước.",
      });
    }
    res.status(500).json({ error: error.message });
  }
};
