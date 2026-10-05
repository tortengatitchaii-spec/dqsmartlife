import React, { useState } from 'react';
import { useDq } from '../context/DqContext';
import { KNOWLEDGE_TIPS } from '../data/knowledgeTips';
import { Lightbulb, Share2, Check, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';

export const KnowledgeTipsView: React.FC = () => {
  const { stats, toggleSaveTip, addXp } = useDq();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = async (tip: typeof KNOWLEDGE_TIPS[0]) => {
    const textToShare = `💡 DQ SMART LIFE - รู้ทันโลกดิจิทัล\n“${tip.headline}”\n${tip.subtext}\n\n${tip.quote}\n\n#DQSmartLife #DigitalIntelligence #สสวท`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `DQ Smart Tip: ${tip.headline}`,
          text: textToShare,
        });
        addXp(10, 'แชร์การ์ดความรู้ DQ สู่สังคมออนไลน์');
        return;
      } catch (err) {
        // User cancelled or not supported
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopiedId(tip.id);
      addXp(10, 'คัดลอกข้อความการ์ดความรู้ DQ');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-400 text-xs font-medium mb-3">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Bite-sized Wisdom Cards</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          รู้ทันโลกดิจิทัล (DQ Quick Tips)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
          การ์ดข้อคิดและคำเตือนสติสั้นๆ เพื่อการใช้ชีวิตบนโลกออนไลน์อย่างปลอดภัย สามารถกดแชร์หรือคัดลอกส่งต่อให้เพื่อนและครอบครัวได้ทันที
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {KNOWLEDGE_TIPS.map((tip) => {
          const isSaved = stats.savedTips.includes(tip.id);
          const isCopied = copiedId === tip.id;

          return (
            <div
              key={tip.id}
              className="group relative bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30 border border-slate-800 hover:border-sky-600/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/30"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-sky-400 tracking-wide">
                    {tip.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleSaveTip(tip.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title={isSaved ? 'ยกเลิกการบันทึก' : 'บันทึกการ์ดนี้'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-sky-300 transition-colors">
                  “{tip.headline}”
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">
                  {tip.subtext}
                </p>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed italic border-l-2 border-sky-500/40 pl-3">
                  "{tip.quote}"
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  DQ SMART LIFE
                </span>

                <button
                  onClick={() => handleShare(tip)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isCopied
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>คัดลอกแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>แชร์การ์ดนี้ (+10 XP)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
