import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, Bot, User as UserIcon, X, Maximize2, Minimize2 } from "lucide-react"
import { useStore } from "@/store/useStore"

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatExtension() {
  const { isAIChatOpen, setAIChatOpen, aiPromptBuffer, setAIPrompt, spendEnergy, addXp } = useStore()
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Halo! Saya Asisten AI terintegrasi Anda. Saya siap membantu menjawab pertanyaan Anda, memecahkan soal fisika, atau menjelaskan simulasi lab. Apa yang bisa saya bantu?"
  }]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isAIChatOpen, isExpanded]);

  // Pantau buffer prompt dari global store (tombol Tanya AI)
  useEffect(() => {
    if (aiPromptBuffer) {
      setInputVal(aiPromptBuffer);
      setAIPrompt(""); // clear buffer
      // Kita langsung eksekusi tanpa nunggu user tekan enter
      handleSendAI(aiPromptBuffer);
    }
  }, [aiPromptBuffer]);

  const handleSendAI = async (textToSubmit: string = inputVal) => {
    if (!textToSubmit.trim()) return;
    
    // Cek Energi
    if (!spendEnergy(10)) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Energi tidak cukup! Selesaikan kuis atau misi untuk mendapatkan minimal 10 Energi agar AI bisa memproses jawaban." }]);
      return;
    }

    // Beri XP karena mau belajar
    addXp(2);
    
    const userMsg: ChatMessage = { role: 'user', content: textToSubmit };
    setMessages(prev => [...prev, userMsg]);
    if (textToSubmit === inputVal) setInputVal("");
    setIsTyping(true);
    
    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "Anda adalah asisten AI ahli fisika dan edukator cerdas untuk aplikasi Physics Lab. Jawab dengan bahasa yang mudah dipahami, ramah, dan ringkas. Gunakan markdown jika perlu." },
              ...messages,
              userMsg
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        const aiReply = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "*(Simulasi respons AI - Token GitHub belum diatur)*\n\nBaik, ini adalah penjelasan saya mengenai topik yang Anda tanyakan. Energi mekanik adalah total energi dari gabungan energi potensial dan kinetik. Apakah Anda mau saya berikan contoh soal?" 
          }]);
          setIsTyping(false);
        }, 1500);
        return;
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Maaf, gagal terhubung ke server API AI. Pastikan VITE_GITHUB_TOKEN valid dan koneksi internet lancar." }]);
    }
    
    setIsTyping(false);
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isAIChatOpen && (
        <button 
          onClick={() => setAIChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] shadow-indigo-500/50 transition-all hover:scale-110 active:scale-95 group"
        >
          <Sparkles size={28} className="group-hover:animate-pulse" />
          <span className="absolute -top-10 right-0 w-max px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Buka Asisten AI
          </span>
        </button>
      )}

      {/* Panel Chat */}
      {isAIChatOpen && (
        <div className={`fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 ease-in-out ${isExpanded ? 'w-full md:w-[600px] h-full md:h-[80vh] md:rounded-2xl' : 'w-full md:w-[400px] h-[500px] md:rounded-2xl'}`}>
          
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex items-center justify-between text-white shrink-0 md:rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Bot size={22} />
              </div>
              <div>
                <h2 className="font-bold leading-tight">AI Asisten Lab</h2>
                <p className="text-[11px] text-indigo-100 font-medium">Powered by GitHub Models GPT-4o</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors hidden md:block"
                title={isExpanded ? "Perkecil" : "Perbesar"}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={() => setAIChatOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Tutup"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === 'user' ? (
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <UserIcon size={16} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                        <Bot size={16} />
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm overflow-hidden break-words ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' 
                      : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-sm'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed break-words">
                      {msg.content.split('**').map((text, i) => i % 2 === 1 ? <strong key={i} className={msg.role === 'user' ? 'text-white' : 'text-slate-900 dark:text-white'}>{text}</strong> : text)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendAI(); }} 
              className="flex items-end gap-2"
            >
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendAI();
                  }
                }}
                placeholder="Tanyakan sesuatu..."
                className="flex-1 max-h-32 min-h-[44px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white resize-y"
              />
              <button 
                type="submit"
                disabled={isTyping || !inputVal.trim()}
                className="h-[44px] w-[44px] shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-all shadow-md"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
