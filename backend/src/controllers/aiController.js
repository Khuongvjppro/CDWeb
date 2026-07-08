const Product = require("../models/Product");
const { GoogleGenerativeAI } = require("@google/generative-ai");

function generateFallbackResponse(message, products) {
  const msg = (message || "").toLowerCase().trim();
  
  const formatPrice = (price) => Number(price).toLocaleString('vi-VN') + "đ";

  if (!products || products.length === 0) {
    return "Dạ, hiện tại hệ thống thực đơn đang bảo trì một chút ạ. Anh/Chị có thể hỏi lại em sau hoặc tham khảo trực tiếp trên trang Thực đơn của CoffeeShop nhé! ☕";
  }

  // 1. Tired/Refreshment query
  if (msg.includes("mệt") || msg.includes("buồn ngủ") || msg.includes("uể oải") || msg.includes("tỉnh táo")) {
    const coffeeItems = products.filter(p => p.category === "Cà phê").slice(0, 3);
    let reply = "Dạ, nếu anh/chị đang cảm thấy mệt mỏi hoặc cần tỉnh táo, em xin gợi ý các món **Cà phê đậm vị** thơm ngon của quán để nạp năng lượng ngay ạ:\n\n";
    coffeeItems.forEach(p => {
      reply += `- **${p.name}** (${formatPrice(p.price)}): ${p.description || "Hương vị đậm đà truyền thống"}\n`;
    });
    reply += "\nAnh/Chị có muốn thêm ngay một ly vào giỏ hàng không ạ? ☕";
    return reply;
  }

  if (msg.includes("mát") || msg.includes("nóng") || msg.includes("giải nhiệt") || msg.includes("khát")) {
    const refreshItems = products.filter(p => p.category === "Trà" || p.category === "Freeze").slice(0, 3);
    let reply = "Dạ, để giải nhiệt sảng khoái và xua tan cái nóng, em xin giới thiệu các món uống mát lạnh của quán ạ:\n\n";
    refreshItems.forEach(p => {
      reply += `- **${p.name}** (${formatPrice(p.price)}): ${p.description || "Thơm ngon mát lạnh"}\n`;
    });
    reply += "\nCác món trà và đá xay này đều rất phù hợp để giải nhiệt đấy ạ! Anh/Chị có muốn chọn thử một món không ạ? 🍹";
    return reply;
  }

  // 2. Recommend/Suggestion query
  if (msg.includes("ngon") || msg.includes("tư vấn") || msg.includes("gợi ý") || msg.includes("khuyên") || msg.includes("chọn")) {
    const featured = products.filter(p => p.is_featured || p.is_new).slice(0, 3);
    const displayItems = featured.length > 0 ? featured : products.slice(0, 3);
    let reply = "Dạ, CoffeeShop xin gợi ý một số món uống nổi bật được yêu thích nhất của quán hiện tại ạ:\n\n";
    displayItems.forEach(p => {
      reply += `- **${p.name}** (${formatPrice(p.price)}): ${p.description || "Hương vị tuyệt hảo, được nhiều khách lựa chọn"}\n`;
    });
    reply += "\nAnh/Chị có muốn thử một trong các món bán chạy này không ạ? 🥰";
    return reply;
  }

  // 3. Category queries
  if (msg.includes("cà phê") || msg.includes("caphe") || msg.includes("cafe")) {
    const items = products.filter(p => p.category === "Cà phê");
    let reply = "Dạ, thực đơn **Cà phê** của quán gồm có các món sau ạ:\n\n";
    items.forEach(p => {
      reply += `- **${p.name}** (${formatPrice(p.price)}): ${p.description || "Thơm ngon đậm đà"}\n`;
    });
    return reply;
  }

  if (msg.includes("trà") || msg.includes("tra")) {
    const items = products.filter(p => p.category === "Trà");
    let reply = "Dạ, thực đơn **Trà** thanh mát của quán gồm có các món sau ạ:\n\n";
    items.forEach(p => {
      reply += `- **${p.name}** (${formatPrice(p.price)}): ${p.description || "Hương vị tự nhiên thanh tao"}\n`;
    });
    return reply;
  }

  if (msg.includes("freeze") || msg.includes("đá xay") || msg.includes("daxay") || msg.includes("lạnh")) {
    const items = products.filter(p => p.category === "Freeze");
    let reply = "Dạ, thực đơn **Freeze (Đá xay)** mát lạnh ngọt ngào của quán gồm có các món sau ạ:\n\n";
    items.forEach(p => {
      reply += `- **${p.name}** (${formatPrice(p.price)}): ${p.description || "Mát lạnh sảng khoái"}\n`;
    });
    return reply;
  }

  // 4. Price / Specific product match
  const matched = products.find(p => msg.includes(p.name.toLowerCase()));
  if (matched) {
    return `Dạ, món **${matched.name}** có giá là **${formatPrice(matched.price)}** ạ. Món này ${matched.description ? `có đặc trưng: ${matched.description}` : "thơm ngon và rất được yêu thích"}. Anh/Chị có muốn thêm món này vào giỏ hàng ngay không ạ? 🥰`;
  }

  // 5. Default Response
  return "Dạ, em là **Trợ lý CoffeeShop** đây ạ! Anh/Chị cần em tư vấn thêm về các món Cà phê, Trà thanh mát hay các món Freeze đá xay ngọt ngào của quán không ạ? Anh/Chị cũng có thể nhập tên món để em báo giá và tư vấn nhanh nhé! 🥰";
}

exports.chat = async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  let products = [];
  try {
    products = await Product.getAllProducts();
  } catch (dbError) {
    console.error("Error fetching products for context:", dbError);
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured in backend .env");
    }

    let productListText = products
      .map(p => `- ${p.name}: ${Number(p.price).toLocaleString('vi-VN')}đ (Danh mục: ${p.category}, Tồn kho: ${p.stock}, Mô tả: ${p.description || "Chưa có mô tả"})`)
      .join("\n");

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction
    });

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
    console.error("Gemini API Error, falling back to database rules:", error);
    try {
      const fallbackText = generateFallbackResponse(message, products);
      res.json({ text: fallbackText });
    } catch (fallbackError) {
      console.error("Fallback failed:", fallbackError);
      res.status(500).json({ error: error.message });
    }
  }
};
