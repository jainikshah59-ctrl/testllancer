import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { askCleo } from '../../collancerAI'; // Using the stub we created earlier

export default function CleoAIPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Hi! I am Cleo, your Collancer AI assistant. I can help you find creators, plan campaigns, or answer questions about the platform. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { id: Date.now(), role: 'user', text: userText }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Call the AI engine
      const response = await askCleo(userText);
      setMessages([...newMessages, { id: Date.now() + 1, role: 'ai', text: response.answer }]);
    } catch (error) {
      setMessages([...newMessages, { id: Date.now() + 1, role: 'ai', text: 'I am currently offline or experiencing issues. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <header className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cleo AI</h1>
          <p className="text-sm text-gray-500">Intelligent campaign & discovery assistant</p>
        </div>
      </header>

      <div className="flex-1 glass rounded-3xl border border-gray-100 flex flex-col overflow-hidden shadow-sm">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-cyan-100 text-cyan-700' : 'bg-black text-cyan-400'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-cyan-500 text-white rounded-tr-sm' : 'bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-black text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 border border-gray-100 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Cleo to find tech creators in Mumbai..."
              className="w-full pl-6 pr-14 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <Send size={18} className="mr-0.5 mt-0.5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-400">Cleo can make mistakes. Verify critical campaign data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
