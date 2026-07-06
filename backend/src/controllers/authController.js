const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Check if user exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.createUser({
      email,
      password: hashedPassword,
      fullName,
      phone,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await User.updateUser(req.user.id, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email là bắt buộc" });
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      // Để tránh thu thập email, vẫn báo thành công
      return res.json({ message: "Đường liên kết đặt lại mật khẩu đã được gửi nếu email tồn tại trên hệ thống!" });
    }

    // Tạo mã token ngắn hạn (15 phút) bằng cách kết hợp mật khẩu hiện tại làm một phần của khóa bí mật
    const secret = (process.env.JWT_SECRET || "secret") + user.password;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: "15m" }
    );

    // Đường dẫn reset mật khẩu ở Frontend (cổng 3001)
    const resetUrl = `http://localhost:3001/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass) {
      // Gửi email thật qua Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"CoffeeShop Support" <${emailUser}>`,
        to: user.email,
        subject: "Yêu cầu khôi phục mật khẩu - CoffeeShop",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eadbc9; border-radius: 15px; background-color: #fffaf3; color: #5a3e36;">
            <div style="text-align: center; border-bottom: 1px solid #eadbc9; padding-bottom: 20px;">
              <h2 style="color: #7b1e2b; margin: 0; font-size: 24px;">COFFEESHOP</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #806d61;">Khôi phục mật khẩu của bạn</p>
            </div>
            <div style="padding: 20px 0;">
              <p>Xin chào <strong>${user.fullName}</strong>,</p>
              <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để khôi phục mật khẩu (Đường dẫn có hiệu lực trong vòng 15 phút):</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #5a3e36, #b55239); color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">Đặt lại mật khẩu mới</a>
              </div>
              <p style="font-size: 12px; color: #806d61; line-height: 1.5;">Nếu bạn không yêu cầu điều này, xin vui lòng bỏ qua email này. Mật khẩu của bạn vẫn sẽ được giữ an toàn.</p>
            </div>
            <div style="text-align: center; border-top: 1px solid #eadbc9; padding-top: 20px; font-size: 11px; color: #806d61;">
              © 2026 CoffeeShop · Đặt trước • Giao nhanh • Thưởng thức tại nhà
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      // Chế độ phát triển cục bộ: Log liên kết ra terminal
      console.log("\n==================================================");
      console.log("🛠️ CHẾ ĐỘ PHÁT TRIỂN: LINK KHÔI PHỤC MẬT KHẨU");
      console.log(`Email nhận: ${user.email}`);
      console.log(`Reset Link: ${resetUrl}`);
      console.log("==================================================\n");
    }

    res.json({ message: "Đường liên kết đặt lại mật khẩu đã được gửi nếu email tồn tại trên hệ thống!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: "Thiếu thông tin yêu cầu" });
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Người dùng không tồn tại" });
    }

    // Xác thực token bằng chính khóa bí mật động (chứa password hash cũ)
    const secret = (process.env.JWT_SECRET || "secret") + user.password;
    try {
      jwt.verify(token, secret);
    } catch (tokenErr) {
      return res.status(400).json({ error: "Mã khôi phục không hợp lệ hoặc đã hết hạn!" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong database
    await User.updatePassword(user.id, hashedPassword);

    res.json({ message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
