-- Fix duplicate categories
-- Chạy query này nếu bạn gặp lỗi duplicate entry

-- Xóa category bị duplicate
DELETE FROM categories WHERE name = 'Cà Phê Sữa' AND id > (
  SELECT MIN(id) FROM (
    SELECT MIN(id) FROM categories WHERE name = 'Cà Phê Sữa'
  ) AS temp
);

-- Hoặc xóa toàn bộ categories và insert lại
-- TRUNCATE TABLE categories;
-- INSERT INTO categories (name, description) VALUES
-- ('Cà Phê Đen', 'Cà phê đen đậm đà'),
-- ('Cà Phê Sữa', 'Cà phê với sữa mịn mọng'),
-- ('Espresso', 'Cà phê Espresso nguyên chất'),
-- ('Cappuccino', 'Cà phê Cappuccino ý'),
-- ('Latte', 'Cà phê Latte mềm mại'),
-- ('Mocha', 'Cà phê Mocha với sô cô la');
