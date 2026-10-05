import React, { useState, useRef, useEffect } from 'react';
import { useDq } from '../context/DqContext';
import { Bot, Send, X, Sparkles, AlertCircle, RefreshCw, Shield, Lightbulb } from 'lucide-react';
import { getLocalDqResponse } from '../utils/dqAiEngine';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const PRESET_PROMPTS = [
  'สรุป 8 ทักษะ DQ ให้เข้าใจง่าย',
  'วิธีจับสังเกตลิงก์หลอกลวง (Phishing)',
  'ถ้าเพื่อนถูกบูลลี่ในกลุ่มแชต ควรช่วยอย่างไร?',
  'Digital Footprints ลบได้จริงไหม มีผลอย่างไร?',
  'ช่วยวิเคราะห์สถานการณ์: ได้รับข้อความขอยืมเงินจากเพื่อนในเฟซบุ๊ก'
];

export const DqBuddyDrawer: React.FC = () => {
  const { isBuddyOpen, setIsBuddyOpen, setActiveTab, setSelectedSkillId } = useDq();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'สวัสดีครับ! ผมคือ **DQ Buddy** เพื่อนคู่คิดด้านความฉลาดทางดิจิทัล 🤖✨\n\nพร้อมช่วยเหลือคุณทั้งการอธิบาย 8 ทักษะ DQ, แนะนำวิธีรับมือภัยออนไลน์, ตรวจสอบข่าวปลอม หรือวิเคราะห์สถานการณ์ที่กำลังเจอครับ อยากให้ผมช่วยเรื่องไหน สอบถามได้เลย!',
      time: 'เมื่อสักครู่'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBuddyOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBuddyOpen]);

  if (!isBuddyOpen) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setInputPrompt('');

    const newMsgId = Date.now().toString();
    const nowTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    const newHistory: ChatMessage[] = [
      ...messages,
      { id: newMsgId, role: 'user', content: userText, time: nowTime }
    ];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/dq-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          conversationHistory: newHistory.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || 'ขออภัยครับ ระบบประมวลผลขัดข้องชั่วคราว ลองถามใหม่อีกครั้งนะครับ',
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('DQ Buddy server endpoint unavailable, using smart local DQ knowledge base:', err);
      const fallbackReply = getLocalDqResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackReply,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputPrompt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white">DQ Buddy</h2>
                <span className="text-[10px] text-sky-400 font-medium px-1.5 py-0.2 bg-sky-950/80 border border-sky-800/60 rounded">
                  AI Mentor
                </span>
              </div>
              <p className="text-xs text-slate-400">ผู้ช่วยเรียนรู้ความฉลาดทางดิจิทัล</p>
            </div>
          </div>

          <button
            onClick={() => setIsBuddyOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Knowledge Source Notice */}
        <div className="px-4 py-2 bg-sky-950/30 border-b border-sky-900/30 flex items-center gap-2 text-[11px] text-sky-300">
          <Shield className="w-3.5 h-3.5 shrink-0 text-sky-400" />
          <span className="truncate">อิงตามกรอบ 8 ทักษะ DQ สสวท. (Scimath)</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {messages.map((msg) => {
            const isMe = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>DQ Buddy กำลังคิดคำตอบ...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>คำถามที่พบบ่อย:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="พิมพ์คำถาม หรือสถานการณ์ที่ต้องการปรึกษา..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <button
              onClick={() => sendMessage(inputPrompt)}
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-40 disabled:hover:bg-sky-500 transition-all shrink-0 active:scale-95"
              title="ส่งคำถาม"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            DQ Buddy ให้ความรู้และคำแนะนำเชิงการศึกษา ไม่ใช่คำปรึกษาทางกฎหมาย
          </p>
        </div>
      </div>
    </div>
  );
};
