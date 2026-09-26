import React, { useState } from 'react';
import { X, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const NestGuideChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am **NestGuide**, your scholarship advisor. Tell me about your course, state, or financial requirements, and I'll find matching scholarships for you."
    }
  ]);

  const suggestedPrompts = [
    "Scholarships for computer science with income below ₹5 lakh",
    "Fully funded scholarships for female engineering students",
    "Scholarships closing this month in Tamil Nadu",
    "Grants for first-generation undergraduate students"
  ];

  const handleSend = async (textToSend = null) => {
    const promptText = textToSend || query;
    if (!promptText.trim() || loading) return;

    const userMsg = { sender: 'user', text: promptText };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await API.post('/ai/nestguide', { query: promptText });
      const assistantMsg = {
        sender: 'assistant',
        text: res.data.reply,
        results: res.data.filteredScholarships || []
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I experienced a temporary connection hiccup. Please try asking again!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Icon - Friendly circular badge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#EA580C] text-white font-bold shadow-xl hover:bg-[#C2410C] hover:scale-105 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#C2410C] flex items-center justify-center font-black text-xs">
            🪹
          </div>
          <span className="text-sm tracking-tight font-serif">Ask NestGuide</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white border border-[#EAE3D9] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-[#EA580C] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FEF3C7] text-[#C2410C] flex items-center justify-center font-extrabold text-base shadow-xs">
                🪹
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif leading-tight">NestGuide Assistant</h4>
                <p className="text-[11px] text-orange-100">Personal Student Funding Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#EA580C] text-white rounded-br-none'
                      : 'bg-white border border-[#EAE3D9] text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Inline mini scholarship cards if returned */}
                {msg.results && msg.results.length > 0 && (
                  <div className="mt-2 w-full space-y-2">
                    {msg.results.slice(0, 3).map((item) => (
                      <div key={item._id} className="p-2.5 bg-white border border-orange-200 rounded-xl shadow-xs">
                        <div className="flex justify-between items-start gap-1">
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h5>
                          <span className="text-[10px] font-bold text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded">
                            {item.matchPercentage || 85}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {item.currency || '₹'}{item.amount ? item.amount.toLocaleString('en-IN') : 0} • {item.location}
                        </p>
                        <Link
                          to={`/scholarship/${item._id}`}
                          onClick={() => setIsOpen(false)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#EA580C] hover:underline"
                        >
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 w-fit">
                <div className="w-2 h-2 rounded-full bg-orange-600 animate-ping"></div>
                Analyzing scholarship eligibility rules...
              </div>
            )}
          </div>

          {/* Quick Suggested Prompts */}
          <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 text-[10px] text-slate-600 no-scrollbar">
            {suggestedPrompts.slice(0, 2).map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-900 border border-slate-200 transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#EAE3D9] flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask NestGuide about scholarships..."
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C]"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className="p-2 rounded-xl bg-[#EA580C] text-white hover:bg-[#C2410C] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default NestGuideChat;
