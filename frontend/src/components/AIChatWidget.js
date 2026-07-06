import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Coffee, Sparkles, AlertCircle } from "lucide-react";
import { aiAPI } from "../utils/api";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Xin chào! Mình là **Trợ lý ảo CoffeeShop** ☕. Mình có thể giúp gì cho bạn hôm nay? Bạn cần tư vấn cà phê hay thức uống giải nhiệt nào?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Hôm nay có món gì ngon?",
    "Tư vấn cà phê đậm vị",
    "Trà trái cây mát lạnh",
    "Giá của Espresso chuẩn Ý?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Map history to backend expected format: { role: 'user'|'model', text: '...' }
      // Exclude the first welcome message to keep the prompt clean or include it as model
      const chatHistory = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      const response = await aiAPI.chat(text, chatHistory);
      const aiReply = response.data.text;

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      let errMsg = "Đã xảy ra lỗi kết nối với trợ lý ảo. Bạn vui lòng thử lại sau nhé!";
      if (error.response && error.response.status === 500) {
        errMsg = "Trợ lý ảo đang nghỉ ngơi hoặc chưa được cấu hình API Key. Bạn hãy kiểm tra lại biến GEMINI_API_KEY trong file .env nhé! ☕";
      }
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Helper to format basic markdown (**bold** and lists)
  const formatMessageText = (text) => {
    if (!text) return "";
    
    // Bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Split into lines
    const lines = formatted.split("\n");
    return lines.map((line, idx) => {
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.replace(/^[\s-*]+/, "");
        return (
          <li key={idx} className="ml-4 list-disc mb-1" dangerouslySetInnerHTML={{ __html: itemText }} />
        );
      }
      return (
        <p key={idx} className={line.trim() === "" ? "h-2" : "mb-1.5"} dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#5a3e36] to-[#b55239] text-white shadow-[0_10px_25px_rgba(90,62,54,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_30px_rgba(90,62,54,0.4)] active:scale-95"
        title="Trợ lý ảo AI tư vấn"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c2624b] opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-[#b55239] text-[9px] font-bold text-white items-center justify-center">AI</span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-3xl border border-[#e7d8c9]/60 bg-white/95 shadow-[0_20px_50px_rgba(90,62,54,0.18)] backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e7d8c9]/40 bg-gradient-to-r from-[#5a3e36] to-[#7c584c] px-5 py-4 text-white rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white animate-pulse">
                <Coffee size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  Trợ lý CoffeeShop <Sparkles size={13} className="text-[#e7d8c9] fill-[#e7d8c9]/30" />
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Trực tuyến và sẵn sàng</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#fdfbf7] to-white">
            {messages.map((msg, index) => {
              const isAI = msg.sender === "ai";
              return (
                <div key={index} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
                  <div className={`flex max-w-[85%] flex-col ${isAI ? "items-start" : "items-end"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isAI
                          ? "bg-[#5a3e36]/5 text-[#4b342d] rounded-tl-sm border border-[#e7d8c9]/30"
                          : "bg-gradient-to-r from-[#b55239] to-[#c2624b] text-white rounded-tr-sm shadow-sm"
                      }`}
                    >
                      {isAI ? (
                        <ul className="space-y-1">{formatMessageText(msg.text)}</ul>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                    <span className="mt-1 text-[9px] text-[#5a3e36]/40 font-medium px-1">
                      {isAI ? "Trợ lý ảo" : "Bạn"}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] flex-col items-start">
                  <div className="bg-[#5a3e36]/5 text-[#4b342d] rounded-2xl rounded-tl-sm px-4 py-3.5 border border-[#e7d8c9]/30">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#b55239]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#b55239]" style={{ animationDelay: "0.2s" }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#b55239]" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50/50 p-3.5 text-xs text-red-600">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <p className="leading-normal">{errorMsg}</p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (Shown when only welcome message exists or just to help) */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 border-t border-[#e7d8c9]/30 bg-[#fdfbf7]">
              <p className="text-[10px] font-bold text-[#5a3e36]/40 uppercase tracking-wider mb-1.5">Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] px-2.5 py-1.5 rounded-xl border border-[#e7d8c9]/50 bg-white text-[#5a3e36] font-medium transition-all duration-300 hover:border-[#b55239] hover:bg-[#b55239]/5"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-[#e7d8c9]/40 bg-white rounded-b-3xl">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Hỏi trợ lý ảo về đồ uống, giá cả..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="w-full rounded-2xl border border-[#e7d8c9]/60 bg-[#fdfbf7]/40 py-3 pl-4 pr-12 text-sm text-[#4b342d] placeholder-[#5a3e36]/45 outline-none transition-all duration-300 focus:border-[#b55239] focus:bg-white focus:ring-4 focus:ring-[#b55239]/5 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2.5 flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[#5a3e36] text-white transition-all duration-300 hover:bg-[#b55239] disabled:bg-stone-100 disabled:text-stone-400"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
