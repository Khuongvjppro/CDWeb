const Product = require("../models/Product");

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured in backend .env" });
    }

    // Fetch active products to provide context
    let productListText = "";
    try {
      const products = await Product.getAllProducts();
      productListText = products
        .map(p => `- ${p.name}: ${Number(p.price).toLocaleString('vi-VN')}đ (Danh mục: ${p.category}, Tồn kho: ${p.stock}, Mô tả: ${p.description || "Chưa có mô tả"})`)
        .join("\n");
    } catch (dbError) {
      console.error("Error fetching products for AI context:", dbError);
      productListText = "Hiện tại không thể truy vấn thực đơn trực tiếp từ database.";
    }

    const systemInstruction = `Bạn là nhân viên tư vấn ảo thân thiện và chuyên nghiệp của quán cà phê "CoffeeShop".
Nhiệm vụ của bạn là tư vấn các loại đồ uống, giới thiệu thực đơn, giải đáp thắc mắc của khách hàng về quán và hỗ trợ họ chọn món phù hợp.

Dưới đây là danh sách thực đơn hiện tại của quán (được lấy trực tiếp từ hệ thống của chúng tôi):
${productListText}

Hãy tuân thủ các quy tắc sau:
1. Luôn trả lời bằng tiếng Việt lịch sự, thân thiện, sử dụng các từ ngữ ấm áp (ví dụ: "dạ", "ạ", "em có thể giúp gì cho anh/chị...").
2. Chỉ giới thiệu các món có trong thực đơn trên. Nếu khách hỏi món không có, hãy lịch sự thông báo và gợi ý món tương tự có trong thực đơn.
3. Khi giới thiệu món, hãy nêu giá tiền rõ ràng để khách hàng dễ lựa chọn.
4. Trả lời ngắn gọn, súc tích, định dạng văn bản dễ đọc (sử dụng các gạch đầu dòng, in đậm tên món ăn/thức uống).
5. Tránh bàn luận về các chủ đề nhạy cảm hoặc không liên quan đến quán cà phê, đồ uống, hoặc thực đơn của quán.`;

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction
    });

    // Formulate chat history for Gemini (lịch sử phải bắt đầu bằng tin nhắn của user)
    let formattedHistory = (history || []).map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    const firstUserIndex = formattedHistory.findIndex(h => h.role === "user");
    if (firstUserIndex !== -1) {
      formattedHistory = formattedHistory.slice(firstUserIndex);
    } else {
      formattedHistory = [];
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ text: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
